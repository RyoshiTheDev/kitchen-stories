# Kitchen Stories Cookbook - Setup Guide

## 🚀 Complete Installation Instructions

This guide will help you set up the fully functional cookbook website with database backend.

## Prerequisites

Before you begin, make sure you have:
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor like **Visual Studio Code** - [Download here](https://code.visualstudio.com/)

### Check if you have Node.js installed:
Open a terminal/command prompt and run:
```bash
node --version
npm --version
```

If you see version numbers, you're good to go! If not, install Node.js first.

## 📁 Project Structure

```
kitchen-stories/
├── server.js                 # Backend server with API
├── package.json             # Node.js dependencies
├── recipes.db               # SQLite database (auto-created)
├── public/                  # Frontend files
│   ├── index.html          # Main recipe listing page
│   ├── recipe-detail.html  # Individual recipe view
│   └── add-recipe.html     # Add new recipe form
└── uploads/                # Recipe images (auto-created)
```

## 🛠️ Installation Steps

### Step 1: Set Up the Project Folder

1. Create a new folder called `kitchen-stories`
2. Place all the downloaded files in this folder:
   - `server.js`
   - `package.json`
3. Create a `public` folder inside `kitchen-stories`
4. Place these files in the `public` folder:
   - `index.html`
   - `recipe-detail.html`
   - `add-recipe.html`

### Step 2: Install Dependencies

Open a terminal/command prompt in the `kitchen-stories` folder and run:

```bash
npm install
```

This will install:
- **express** - Web server framework
- **sqlite3** - Database
- **multer** - File upload handling
- **body-parser** - Parse form data
- **cors** - Cross-origin resource sharing

### Step 3: Start the Server

Still in the terminal, run:

```bash
npm start
```

You should see:
```
🍳 Kitchen Stories server running on http://localhost:3000
📊 Database: SQLite (recipes.db)
📁 Upload folder: ./uploads
Connected to the SQLite database.
Recipes table ready.
Ingredients table ready.
Instructions table ready.
Inserting sample recipes...
Sample recipes inserted successfully!
```

### Step 4: Open the Website

Open your web browser and go to:
```
http://localhost:3000
```

You should see your cookbook website with 3 sample recipes already loaded!

## ✨ Features You Can Now Use

### ✅ View Recipes
- Browse all recipes on the homepage
- Click any recipe to view full details with ingredients and instructions
- Search recipes by name or description
- Filter by category (Breakfast, Lunch, Dinner, Desserts, Favorites)

### ✅ Add New Recipes
1. Click the orange "+" button
2. Fill out the form:
   - Title, description, category
   - Prep time, cook time, servings, difficulty
   - Upload an image (optional)
   - Add ingredients (organize in groups if you want)
   - Add step-by-step instructions
   - Add chef's notes (optional)
3. Click "Save Recipe"
4. Your recipe is now in the database!

### ✅ Upload Images
- Recipe images are stored in the `uploads` folder
- Supported formats: JPG, PNG, GIF, WebP
- Maximum file size: 5MB

## 🔧 How the System Works

### Backend (server.js)
- **Express Server** runs on port 3000
- **SQLite Database** stores all recipes, ingredients, and instructions
- **RESTful API** provides endpoints for CRUD operations:
  - `GET /api/recipes` - Get all recipes (with filters)
  - `GET /api/recipes/:id` - Get single recipe
  - `POST /api/recipes` - Create new recipe
  - `PUT /api/recipes/:id` - Update recipe
  - `DELETE /api/recipes/:id` - Delete recipe
  - `PATCH /api/recipes/:id/favorite` - Toggle favorite

### Frontend
- **index.html** - Fetches and displays all recipes
- **recipe-detail.html** - Fetches and displays single recipe
- **add-recipe.html** - Sends new recipe data to the server

### Database Schema
Three tables work together:
1. **recipes** - Main recipe info (title, category, times, etc.)
2. **ingredients** - All ingredients linked to recipes
3. **instructions** - Step-by-step instructions linked to recipes

## 🎯 Common Tasks

### Adding More Sample Data
The server automatically creates 3 sample recipes when first run. To add more:
1. Use the "+ Add Recipe" button in the web interface, OR
2. Edit the `sampleRecipes` array in `server.js` and delete `recipes.db`, then restart

### Viewing the Database
To see what's in your database:
1. Install a SQLite browser like [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open the `recipes.db` file
3. Browse your tables and data

### Backup Your Recipes
Simply copy the `recipes.db` file and the `uploads` folder to keep a backup!

### Reset Everything
To start fresh:
1. Stop the server (Ctrl+C)
2. Delete `recipes.db` file
3. Delete contents of `uploads` folder
4. Restart the server - sample recipes will be recreated

## 🐛 Troubleshooting

### "Cannot GET /" or blank page
- Make sure the server is running (`npm start`)
- Check that files are in the `public` folder
- Visit `http://localhost:3000` (not file://)

### "Error loading recipes"
- Ensure the server is running
- Check the browser console (F12) for errors
- Verify API_URL is set to `http://localhost:3000/api` in the HTML files

### "Port 3000 already in use"
- Another application is using port 3000
- Stop the other application, or
- Edit `server.js` and change `const PORT = 3000;` to a different number

### Images not uploading
- Check that the `uploads` folder exists
- Verify file size is under 5MB
- Ensure file is an image format (JPG, PNG, GIF, WebP)

### Database errors
- Delete `recipes.db` and restart the server
- The database will be recreated automatically

## 🚀 Advanced: Deploying Online

Want to share your cookbook online? Here are some options:

### Option 1: Heroku (Free Tier)
1. Sign up at [Heroku](https://www.heroku.com/)
2. Install Heroku CLI
3. Add a `Procfile` with: `web: node server.js`
4. Deploy using Git

### Option 2: Railway
1. Sign up at [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Deploy automatically

### Option 3: DigitalOcean
1. Create a droplet
2. Install Node.js
3. Upload your files
4. Run the server with PM2 for persistence

**Note:** For production, consider switching from SQLite to PostgreSQL or MongoDB for better performance and features.

## 📝 Development Mode

Want to make changes and see them instantly?

```bash
npm run dev
```

This uses nodemon to automatically restart the server when you make changes to `server.js`.

## 🎨 Customization

### Change Colors
Edit the CSS variables in any of the HTML files:
```css
:root {
    --cream: #FFF8F0;
    --terracotta: #D4745E;
    --olive: #8B9556;
    /* Change these to your preferred colors */
}
```

### Add New Categories
1. Update the navigation in `index.html`
2. Add the category option in `add-recipe.html`
3. Recipes will automatically filter by the new category

### Modify Database Schema
1. Stop the server
2. Delete `recipes.db`
3. Edit the table creation code in `server.js`
4. Restart the server

## 📚 API Documentation

### Get All Recipes
```
GET /api/recipes
Query params:
  - category: breakfast|lunch|dinner|dessert|favorites
  - search: text to search in title/description
```

### Get Single Recipe
```
GET /api/recipes/:id
```

### Create Recipe
```
POST /api/recipes
Content-Type: multipart/form-data
Body:
  - title (required)
  - description (required)
  - category (required)
  - difficulty (required)
  - prep_time (required)
  - cook_time (required)
  - servings (required)
  - notes (optional)
  - ingredients (JSON string)
  - instructions (JSON string)
  - image (file, optional)
```

### Update Recipe
```
PUT /api/recipes/:id
(Same body as Create Recipe)
```

### Delete Recipe
```
DELETE /api/recipes/:id
```

### Toggle Favorite
```
PATCH /api/recipes/:id/favorite
```

## 🎓 Learning Resources

Want to understand the code better?
- [Express.js Tutorial](https://expressjs.com/en/starter/installing.html)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [FormData for File Uploads](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

## 💡 Tips & Best Practices

1. **Regular Backups** - Copy your database file weekly
2. **Image Optimization** - Compress images before uploading for better performance
3. **Consistent Data** - Use the same format for times (e.g., always "30 mins" not "30 minutes")
4. **Test in Multiple Browsers** - Chrome, Firefox, Safari, Edge
5. **Mobile First** - The design is responsive, test on your phone!

## 🤝 Need Help?

Having issues? Here's what to include when asking for help:
1. What were you trying to do?
2. What happened instead?
3. Any error messages? (check browser console with F12)
4. Server logs from the terminal
5. Your operating system and Node.js version

## 🎉 You're All Set!

Enjoy your personal cookbook website! Start adding your favorite recipes and build your digital recipe collection.

Happy cooking! 👨‍🍳👩‍🍳
