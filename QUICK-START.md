# Kitchen Stories - Quick Start 🚀

## Installation (One-time setup)

1. **Install Node.js** if you haven't already:
   - Download from https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - Run the installer

2. **Set up your project folder:**
   ```
   kitchen-stories/
   ├── server.js
   ├── package.json
   ├── SETUP-GUIDE.md (detailed instructions)
   └── public/
       ├── index.html
       ├── recipe-detail.html
       └── add-recipe.html
   ```

3. **Install dependencies:**
   Open terminal/command prompt in the `kitchen-stories` folder:
   ```bash
   npm install
   ```

## Running Your Cookbook

Every time you want to use your cookbook:

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open your browser:**
   Go to: http://localhost:3000

3. **When you're done:**
   Press `Ctrl+C` in the terminal to stop the server

## That's it! 

- Your recipes are automatically saved to the database
- Images are stored in the `uploads` folder
- Everything persists between sessions

## First Time?

The app comes with 3 sample recipes to get you started:
- Fluffy Buttermilk Pancakes
- Garlic Herb Roasted Chicken  
- Classic Chocolate Chip Cookies

Try clicking the orange "+" button to add your first recipe!

## File Structure Explained

**server.js** - The backend that runs your database and API
**package.json** - Lists all the code libraries needed
**public/index.html** - Your main recipe page
**public/recipe-detail.html** - Shows individual recipe details
**public/add-recipe.html** - Form to add new recipes
**recipes.db** - Your database (created automatically)
**uploads/** - Folder for recipe images (created automatically)

## Common Commands

- `npm start` - Start the server
- `npm run dev` - Start with auto-restart (for development)
- `Ctrl+C` - Stop the server

## Need Help?

Read the full SETUP-GUIDE.md for:
- Detailed troubleshooting
- How to backup your recipes
- How to customize the design
- API documentation
- Deployment options

Enjoy your cookbook! 🍳
