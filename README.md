# GPU-Ai Website

This is a website for a GPU server company, built with **Astro**.
Astro turns the files in this folder into a plain website that any web server can show.

---

## What you need first

- **Node.js** version 22 or newer
- **npm** (it comes with Node.js)
- **git** (only if you want to push to GitHub)

Check that you have them:

```
node -v
npm -v
git --version
```

---

## How to run it on your computer

1. Open a terminal in this folder.
2. Install the parts the site needs (you only do this once):
   ```
   npm install
   ```
3. Start the site:
   ```
   npm run dev
   ```
4. Open your browser at **http://localhost:4321**

The site reloads by itself when you change a file.
Press `Ctrl + C` in the terminal to stop it.

---

## How to make the final website

```
npm run build
```

This makes a folder called `dist`. That folder is the finished website.
Copy everything inside `dist` to any web server (Caddy, Nginx, Netlify, Vercel, and so on).

To check the finished website before you upload it:

```
npm run preview
```

---

## Where things are

| Folder or file | What it holds |
|---|---|
| `src/config/site.ts` | Company name, email, phone, address, logo and menu links. **Change these first.** |
| `src/pages/` | One file for each page of the site |
| `src/components/` | Parts used on many pages: header, footer, GPU scene |
| `src/layouts/` | The frame every page sits inside |
| `src/content-html/` | The main text and layout of each page |
| `src/styles/` | Shared styles |
| `public/` | Images, fonts, scripts and styles copied as they are |

---

## How to change the company details

1. Open `src/config/site.ts`.
2. Change the name, email, phone numbers, address and logo paths.
3. Save. The header and footer update on every page.
4. Some page text still has the old company name. Search for it across the project and replace it.

---

## The GPU 3D scene on the home page

- Script: `public/wp-content/plugins/ai-server-quote-system/nodex-server-photo-scene.js`
- Wrapper: `src/components/GpuScene.astro`

It starts by itself on any page that has `<div class="nx-server-scene" data-nx-scene>`.

---

## Forms

The quote, contact and withdraw forms **show on the page but do not send anything yet.**
To make them work, connect them to an email service or a form backend later.

---

## Push to GitHub in steps

Run the script in this folder (it stays on your computer and is not pushed):

```
bash push.sh
```

It saves the project to git in small, clear steps, then pushes everything to GitHub.
When it asks for a password, paste a **GitHub token**, because GitHub does not accept your normal account password there.
