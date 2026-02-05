# Kitchen Stories - Password Protection & Editing Guide

## 🆕 New Features Added!

### 1. **Edit Recipes** ✏️
You can now edit any existing recipe just like you add new ones!

### 2. **Password Protection** 🔒
Only people with the admin password can:
- Add new recipes
- Edit existing recipes  
- Delete recipes

**Everyone else can:**
- Browse all recipes
- Search and filter
- View recipe details
- Print recipes

---

## 🔐 Setting Your Admin Password

### Step 1: Change the Default Password

**IMPORTANT:** Before uploading to GitHub, change your password!

1. Open the `config.js` file
2. Find this line:
   ```javascript
   adminPassword: 'mykitchen2026',
   ```
3. Change `'mykitchen2026'` to your own secure password:
   ```javascript
   adminPassword: 'YourSecurePassword123',
   ```
4. Save the file

### Step 2: Keep config.js Private

When uploading to GitHub, you have two options:

**Option A: Use .gitignore (Recommended)**
1. Create a file named `.gitignore` in your kitchen-stories folder
2. Add this line to it:
   ```
   config.js
   ```
3. Create a file named `config.example.js` with:
   ```javascript
   module.exports = {
       adminPassword: 'CHANGE_THIS_PASSWORD',
       port: 3000,
       maxFileSize: 5 * 1024 * 1024,
       allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp']
   };
   ```
4. In your README, tell users to:
   - Copy `config.example.js` to `config.js`
   - Set their own password

**Option B: Use Environment Variable**
See "Advanced: Environment Variables" section below.

---

## ✏️ How to Edit Recipes

### Method 1: From Recipe Detail Page
1. View any recipe
2. Click the **"Edit Recipe"** button
3. Enter your admin password when prompted
4. Make your changes
5. Click **"Update Recipe"**

### Method 2: Direct URL
Go to: `http://localhost:3000/edit-recipe.html?id=1` (replace 1 with recipe ID)

---

## 🗑️ How to Delete Recipes

1. Click **"Edit Recipe"** on any recipe
2. Enter your admin password
3. Scroll to the bottom
4. Click the red **"Delete Recipe"** button
5. Type `DELETE` to confirm
6. Recipe is permanently removed

---

## 🔑 How Password Protection Works

### For You (Admin):
1. When you click "Add Recipe" or "Edit Recipe", you'll see a password prompt
2. Enter your password once per browser session
3. The password is stored temporarily in your browser
4. You won't be asked again until you close the browser

### For Others (Viewers):
- They can browse and view all recipes
- If they try to add/edit/delete, they'll be asked for the password
- Without the correct password, they can't make changes

### Password Storage:
- Password is stored in `sessionStorage` (browser memory)
- Automatically cleared when browser is closed
- Never sent in URLs or cookies
- Sent securely in request headers

---

## 📁 Updated File Structure

```
kitchen-stories/
├── server.js               ← Updated with password protection
├── config.js              ← NEW! Your password settings
├── package.json
├── recipes.db
├── public/
│   ├── index.html
│   ├── recipe-detail.html ← Updated with Edit button
│   ├── add-recipe.html    ← Updated with password
│   ├── edit-recipe.html   ← NEW! Edit existing recipes
│   └── password-manager.js ← NEW! Handles authentication
└── uploads/
```

---

## 🚀 Starting the Updated Server

Everything works the same:

```bash
npm start
```

The password protection is automatic!

---

## 🧪 Testing the New Features

### Test Editing:
1. Go to http://localhost:3000
2. Click any recipe
3. Click "Edit Recipe"
4. Enter password: `mykitchen2026` (or whatever you set)
5. Change the title
6. Click "Update Recipe"
7. Check that changes saved!

### Test Password Protection:
1. Open a Private/Incognito browser window
2. Try to add a recipe
3. Enter wrong password → Should fail
4. Enter correct password → Should work!

---

## 📤 Preparing for GitHub

### Step 1: Create .gitignore

Create a file called `.gitignore` with:

```
# Dependencies
node_modules/

# Database (contains your personal recipes)
recipes.db

# Uploads (your recipe images)
uploads/

# Config (contains your password)
config.js

# OS files
.DS_Store
Thumbs.db
```

### Step 2: Create config.example.js

```javascript
module.exports = {
    adminPassword: 'CHANGE_THIS_PASSWORD',
    port: 3000,
    maxFileSize: 5 * 1024 * 1024,
    allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp']
};
```

### Step 3: Update README.md

Add instructions for others:

```markdown
## Setup

1. Clone this repository
2. Copy `config.example.js` to `config.js`
3. Edit `config.js` and set your own admin password
4. Run `npm install`
5. Run `npm start`
6. Open http://localhost:3000
```

### Step 4: Git Commands

```bash
git init
git add .
git commit -m "Initial commit - Kitchen Stories Cookbook"
git remote add origin https://github.com/yourusername/kitchen-stories.git
git push -u origin main
```

---

## ⚡ Advanced: Environment Variables

For extra security, use environment variables:

### Step 1: Create .env file
```
ADMIN_PASSWORD=your_secure_password_here
PORT=3000
```

### Step 2: Install dotenv
```bash
npm install dotenv
```

### Step 3: Update config.js
```javascript
require('dotenv').config();

module.exports = {
    adminPassword: process.env.ADMIN_PASSWORD || 'mykitchen2026',
    port: process.env.PORT || 3000,
    maxFileSize: 5 * 1024 * 1024,
    allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp']
};
```

### Step 4: Add .env to .gitignore
```
.env
```

### Step 5: Create .env.example
```
ADMIN_PASSWORD=change_this_password
PORT=3000
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Use a strong, unique password (mix of letters, numbers, symbols)
- Change the default password immediately
- Keep `config.js` out of Git
- Use different passwords for different deployments
- Use HTTPS if deploying online

### ❌ DON'T:
- Share your password publicly
- Commit `config.js` to GitHub
- Use simple passwords like "password123"
- Reuse passwords from other services

---

## 🆘 Troubleshooting

### "Unauthorized" error when editing
- Check your password in `config.js`
- Clear browser storage and try again
- Make sure server restarted after changing password

### Password prompt keeps appearing
- Enter the correct password
- Check browser console for errors
- Make sure `password-manager.js` is loaded

### Can't find Edit button
- Make sure you copied the updated `recipe-detail.html`
- Refresh your browser (Ctrl+F5)

### Others can still edit without password
- Make sure you're using the updated `server.js`
- Check that `config.js` exists
- Restart the server

---

## 🎉 You're All Set!

You now have:
- ✅ Ability to edit any recipe
- ✅ Password protection for editing/deleting
- ✅ Ready to share on GitHub
- ✅ Secure admin controls

Enjoy your cookbook! 🍳

---

## 💡 Tips

**Forgot your password?**
- Just open `config.js` and look at the `adminPassword` value

**Want multiple admins?**
- Everyone can use the same password
- Or: Modify the code to support multiple passwords/usernames

**Deploying online?**
- Consider using environment variables
- Use HTTPS (free with services like Heroku, Netlify, Railway)
- Consider more robust authentication (OAuth, JWT tokens)
