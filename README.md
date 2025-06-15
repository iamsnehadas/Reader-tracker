## Website Progress Tracker

This project is a simple web app to help you track your reading or learning progress on websites that provide content in chapters or lessons. It allows you to fetch a list of chapters from a given URL, store your progress locally, and resume later.

### Features

- Fetch chapters automatically from a given URL and CSS selector.
- Manual list option if the site does not allow automated fetching.
- Progress tracking with checkboxes.
- Local storage to save progress across sessions.
- Resume dashboard to manage multiple sites.
- Netlify Functions to handle CORS for safe cross-origin requests.

### How to Use

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/website-progress-tracker.git
   cd website-progress-tracker
2. **Install dependencies**

   ```bash
   npm install
3. **Run locally with Netlify Dev**
   ```bash
   netlify dev
This will serve your site and run the serverless function for fetching pages.

## Add a Site URL and the CSS Selector for Chapter Links

**Example:**

- **URL:** `https://www.example.com/`
- **Selector:** `.readers-list a`

## Mark Chapters as Complete and Monitor Your Progress

## Resume Previous Progress from the Dashboard


**License
MIT License — free to use and modify.**
