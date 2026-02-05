require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const config = {
    adminPassword: process.env.ADMIN_PASSWORD || 'ryo123',
    port: process.env.PORT || 3000,
    maxFileSize: 5 * 1024 * 1024,
    allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp']
};

const app = express();
const PORT = config.port || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Password verification middleware for protected routes
function verifyPassword(req, res, next) {
    const password = req.headers['x-admin-password'] || req.body.adminPassword || req.query.adminPassword;
    
    if (password === config.adminPassword) {
        next();
    } else {
        res.status(401).json({ 
            error: 'Unauthorized', 
            message: 'Invalid admin password' 
        });
    }
}

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Initialize SQLite database
const db = new sqlite3.Database('./recipes.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

// Create tables with proper sequencing
function initializeDatabase() {
    db.serialize(() => {
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
        
        // Recipes table
        db.run(`CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            prep_time TEXT NOT NULL,
            cook_time TEXT NOT NULL,
            total_time TEXT,
            servings TEXT NOT NULL,
            image_url TEXT,
            notes TEXT,
            is_favorite INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating recipes table:', err.message);
            } else {
                console.log('Recipes table ready.');
            }
        });

        // Ingredients table
        db.run(`CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipe_id INTEGER NOT NULL,
            ingredient_group TEXT,
            ingredient_text TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                console.error('Error creating ingredients table:', err.message);
            } else {
                console.log('Ingredients table ready.');
            }
        });

        // Instructions table
        db.run(`CREATE TABLE IF NOT EXISTS instructions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipe_id INTEGER NOT NULL,
            step_number INTEGER NOT NULL,
            instruction_text TEXT NOT NULL,
            FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                console.error('Error creating instructions table:', err.message);
            } else {
                console.log('Instructions table ready.');
                // Only insert sample data after ALL tables are created
                setTimeout(() => {
                    insertSampleData();
                }, 100);
            }
        });
    });
}

// Insert sample data (only if database is empty)
function insertSampleData() {
    db.get('SELECT COUNT(*) as count FROM recipes', [], (err, row) => {
        if (err) {
            console.error('Error checking for existing recipes:', err.message);
            return;
        }
        
        if (row.count === 0) {
            console.log('Inserting sample recipes...');
            
            const sampleRecipes = [
                {
                    title: "Fluffy Buttermilk Pancakes",
                    description: "Light, airy pancakes with a golden exterior and tender interior. Perfect weekend breakfast tradition.",
                    category: "breakfast",
                    difficulty: "Easy",
                    prep_time: "10 mins",
                    cook_time: "15 mins",
                    servings: "4 servings",
                    is_favorite: 1,
                    notes: "For extra fluffy pancakes, let the batter rest for 5 minutes before cooking. You can also add blueberries or chocolate chips to the batter for variation.",
                    ingredients: [
                        { group: "Dry Ingredients", items: ["2 cups all-purpose flour", "2 tablespoons sugar", "2 teaspoons baking powder", "1 teaspoon baking soda", "1/2 teaspoon salt"] },
                        { group: "Wet Ingredients", items: ["2 cups buttermilk", "2 large eggs", "1/4 cup melted butter", "1 teaspoon vanilla extract"] }
                    ],
                    instructions: [
                        "In a large bowl, whisk together flour, sugar, baking powder, baking soda, and salt.",
                        "In a separate bowl, whisk together buttermilk, eggs, melted butter, and vanilla extract.",
                        "Pour wet ingredients into dry ingredients and gently fold together until just combined. Don't overmix – some lumps are okay.",
                        "Heat a griddle or large skillet over medium heat. Lightly grease with butter.",
                        "Pour 1/4 cup batter for each pancake. Cook until bubbles form on the surface, about 2-3 minutes.",
                        "Flip and cook until golden brown on the other side, about 1-2 minutes more.",
                        "Serve immediately with butter and maple syrup."
                    ]
                },
                {
                    title: "Garlic Herb Roasted Chicken",
                    description: "Juicy roasted chicken infused with fresh herbs and garlic. A family favorite that never disappoints.",
                    category: "dinner",
                    difficulty: "Medium",
                    prep_time: "15 mins",
                    cook_time: "75 mins",
                    servings: "6 servings",
                    is_favorite: 1,
                    notes: "The key to crispy skin is starting with a completely dry chicken. Make sure to pat it thoroughly with paper towels before seasoning.",
                    ingredients: [
                        { group: "Main", items: ["1 whole chicken (4-5 lbs)", "6 cloves garlic, minced", "2 tablespoons olive oil", "2 tablespoons butter, softened", "1 lemon, halved"] },
                        { group: "Herbs & Seasoning", items: ["2 tablespoons fresh rosemary, chopped", "2 tablespoons fresh thyme", "1 tablespoon fresh sage, chopped", "2 teaspoons salt", "1 teaspoon black pepper"] }
                    ],
                    instructions: [
                        "Preheat oven to 425°F (220°C). Pat chicken dry with paper towels.",
                        "In a small bowl, mix together garlic, olive oil, butter, rosemary, thyme, sage, salt, and pepper.",
                        "Gently loosen the skin from the chicken breast and thighs. Spread half the herb mixture under the skin.",
                        "Rub remaining herb mixture all over the outside of the chicken. Place lemon halves inside the cavity.",
                        "Tie legs together with kitchen twine and tuck wing tips under the body.",
                        "Place chicken breast-side up in a roasting pan. Roast for 60-75 minutes until internal temperature reaches 165°F.",
                        "Let rest for 10-15 minutes before carving. Serve with pan juices."
                    ]
                },
                {
                    title: "Classic Chocolate Chip Cookies",
                    description: "Crispy edges with a chewy center. The ultimate comfort food from grandma's recipe box.",
                    category: "dessert",
                    difficulty: "Easy",
                    prep_time: "15 mins",
                    cook_time: "12 mins",
                    servings: "24 cookies",
                    is_favorite: 0,
                    notes: "For chewier cookies, slightly underbake them. For crispier cookies, bake an extra 1-2 minutes. Cookies will continue to cook on the hot baking sheet after removing from oven.",
                    ingredients: [
                        { group: "", items: ["2 1/4 cups all-purpose flour", "1 teaspoon baking soda", "1 teaspoon salt", "1 cup (2 sticks) butter, softened", "3/4 cup granulated sugar", "3/4 cup packed brown sugar", "2 large eggs", "2 teaspoons vanilla extract", "2 cups chocolate chips"] }
                    ],
                    instructions: [
                        "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
                        "In a medium bowl, whisk together flour, baking soda, and salt.",
                        "In a large bowl, cream together softened butter, granulated sugar, and brown sugar until light and fluffy, about 3 minutes.",
                        "Beat in eggs one at a time, then add vanilla extract.",
                        "Gradually mix in the flour mixture until just combined.",
                        "Fold in chocolate chips.",
                        "Drop rounded tablespoons of dough onto prepared baking sheets, spacing 2 inches apart.",
                        "Bake for 10-12 minutes until edges are golden brown. Centers will look slightly underdone.",
                        "Cool on baking sheet for 5 minutes before transferring to a wire rack."
                    ]
                }
            ];

            let recipesInserted = 0;
            sampleRecipes.forEach((recipe, index) => {
                db.run(`INSERT INTO recipes (title, description, category, difficulty, prep_time, cook_time, servings, notes, is_favorite) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [recipe.title, recipe.description, recipe.category, recipe.difficulty, recipe.prep_time, recipe.cook_time, recipe.servings, recipe.notes, recipe.is_favorite],
                    function(err) {
                        if (err) {
                            console.error('Error inserting recipe:', err.message);
                            return;
                        }
                        
                        const recipeId = this.lastID;
                        
                        // Insert ingredients
                        recipe.ingredients.forEach((group) => {
                            group.items.forEach((item, itemIndex) => {
                                db.run(`INSERT INTO ingredients (recipe_id, ingredient_group, ingredient_text, sort_order) VALUES (?, ?, ?, ?)`,
                                    [recipeId, group.group, item, itemIndex],
                                    (err) => {
                                        if (err) console.error('Error inserting ingredient:', err.message);
                                    }
                                );
                            });
                        });
                        
                        // Insert instructions
                        recipe.instructions.forEach((instruction, stepIndex) => {
                            db.run(`INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES (?, ?, ?)`,
                                [recipeId, stepIndex + 1, instruction],
                                (err) => {
                                    if (err) console.error('Error inserting instruction:', err.message);
                                }
                            );
                        });
                        
                        recipesInserted++;
                        if (recipesInserted === sampleRecipes.length) {
                            console.log('Sample recipes inserted successfully!');
                        }
                    }
                );
            });
        }
    });
}

// API Routes

// Get all recipes (with optional filtering)
app.get('/api/recipes', (req, res) => {
    const { category, search, favorites } = req.query;
    
    let query = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    
    if (category && category !== 'all') {
        if (category === 'favorites') {
            query += ' AND is_favorite = 1';
        } else {
            query += ' AND category = ?';
            params.push(category);
        }
    }
    
    if (search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get single recipe with ingredients and instructions
app.get('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    
    db.get('SELECT * FROM recipes WHERE id = ?', [recipeId], (err, recipe) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!recipe) {
            res.status(404).json({ error: 'Recipe not found' });
            return;
        }
        
        // Get ingredients
        db.all('SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY sort_order', [recipeId], (err, ingredients) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Group ingredients
            const groupedIngredients = [];
            const groups = {};
            
            ingredients.forEach(ing => {
                const groupName = ing.ingredient_group || 'Main';
                if (!groups[groupName]) {
                    groups[groupName] = [];
                }
                groups[groupName].push(ing.ingredient_text);
            });
            
            Object.keys(groups).forEach(groupName => {
                groupedIngredients.push({
                    group: groupName,
                    items: groups[groupName]
                });
            });
            
            // Get instructions
            db.all('SELECT * FROM instructions WHERE recipe_id = ? ORDER BY step_number', [recipeId], (err, instructions) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                
                recipe.ingredients = groupedIngredients;
                recipe.instructions = instructions.map(inst => inst.instruction_text);
                
                res.json(recipe);
            });
        });
    });
});

// Create new recipe (PASSWORD PROTECTED)
app.post('/api/recipes', verifyPassword, upload.single('image'), (req, res) => {
    const {
        title,
        description,
        category,
        difficulty,
        prep_time,
        cook_time,
        servings,
        notes,
        ingredients,
        instructions
    } = req.body;
    
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    db.run(`INSERT INTO recipes 
        (title, description, category, difficulty, prep_time, cook_time, servings, notes, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, category, difficulty, prep_time, cook_time, servings, notes || null, image_url],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            const recipeId = this.lastID;
            
            // Parse and insert ingredients
            let ingredientsArray = [];
            try {
                ingredientsArray = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
            } catch (e) {
                console.error('Error parsing ingredients:', e);
            }
            
            if (Array.isArray(ingredientsArray)) {
                ingredientsArray.forEach((group, groupIndex) => {
                    if (group.items && Array.isArray(group.items)) {
                        group.items.forEach((item, itemIndex) => {
                            db.run(`INSERT INTO ingredients (recipe_id, ingredient_group, ingredient_text, sort_order) VALUES (?, ?, ?, ?)`,
                                [recipeId, group.group || '', item, itemIndex]
                            );
                        });
                    }
                });
            }
            
            // Parse and insert instructions
            let instructionsArray = [];
            try {
                instructionsArray = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
            } catch (e) {
                console.error('Error parsing instructions:', e);
            }
            
            if (Array.isArray(instructionsArray)) {
                instructionsArray.forEach((instruction, index) => {
                    db.run(`INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES (?, ?, ?)`,
                        [recipeId, index + 1, instruction]
                    );
                });
            }
            
            res.json({
                message: 'Recipe created successfully',
                recipeId: recipeId,
                image_url: image_url
            });
        }
    );
});

// Update recipe (PASSWORD PROTECTED)
app.put('/api/recipes/:id', verifyPassword, upload.single('image'), (req, res) => {
    const recipeId = req.params.id;
    const {
        title,
        description,
        category,
        difficulty,
        prep_time,
        cook_time,
        servings,
        notes,
        ingredients,
        instructions
    } = req.body;
    
    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    let updateQuery = `UPDATE recipes SET 
        title = ?,
        description = ?,
        category = ?,
        difficulty = ?,
        prep_time = ?,
        cook_time = ?,
        servings = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP`;
    
    const params = [title, description, category, difficulty, prep_time, cook_time, servings, notes];
    
    if (image_url) {
        updateQuery += ', image_url = ?';
        params.push(image_url);
    }
    
    updateQuery += ' WHERE id = ?';
    params.push(recipeId);
    
    db.run(updateQuery, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Delete existing ingredients and instructions
        db.run('DELETE FROM ingredients WHERE recipe_id = ?', [recipeId]);
        db.run('DELETE FROM instructions WHERE recipe_id = ?', [recipeId]);
        
        // Insert new ingredients
        let ingredientsArray = [];
        try {
            ingredientsArray = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
        } catch (e) {
            console.error('Error parsing ingredients:', e);
        }
        
        if (Array.isArray(ingredientsArray)) {
            ingredientsArray.forEach((group) => {
                if (group.items && Array.isArray(group.items)) {
                    group.items.forEach((item, itemIndex) => {
                        db.run(`INSERT INTO ingredients (recipe_id, ingredient_group, ingredient_text, sort_order) VALUES (?, ?, ?, ?)`,
                            [recipeId, group.group || '', item, itemIndex]
                        );
                    });
                }
            });
        }
        
        // Insert new instructions
        let instructionsArray = [];
        try {
            instructionsArray = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
        } catch (e) {
            console.error('Error parsing instructions:', e);
        }
        
        if (Array.isArray(instructionsArray)) {
            instructionsArray.forEach((instruction, index) => {
                db.run(`INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES (?, ?, ?)`,
                    [recipeId, index + 1, instruction]
                );
            });
        }
        
        res.json({
            message: 'Recipe updated successfully',
            recipeId: recipeId,
            image_url: image_url
        });
    });
});

// Delete recipe (PASSWORD PROTECTED)
app.delete('/api/recipes/:id', verifyPassword, (req, res) => {
    const recipeId = req.params.id;
    
    // Get image URL before deleting
    db.get('SELECT image_url FROM recipes WHERE id = ?', [recipeId], (err, recipe) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Delete image file if exists
        if (recipe && recipe.image_url) {
            const imagePath = path.join(__dirname, 'public', recipe.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        // Delete recipe (CASCADE will handle ingredients and instructions)
        db.run('DELETE FROM recipes WHERE id = ?', [recipeId], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            res.json({
                message: 'Recipe deleted successfully',
                deletedId: recipeId
            });
        });
    });
});

// Toggle favorite status
app.patch('/api/recipes/:id/favorite', (req, res) => {
    const recipeId = req.params.id;
    
    db.run('UPDATE recipes SET is_favorite = NOT is_favorite WHERE id = ?', [recipeId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        res.json({ message: 'Favorite status toggled successfully' });
    });
});

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🍳 Kitchen Stories server running on http://localhost:${PORT}`);
    console.log(`📊 Database: SQLite (recipes.db)`);
    console.log(`📁 Upload folder: ./uploads`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
