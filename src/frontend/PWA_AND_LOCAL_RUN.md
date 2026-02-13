# Forest Fire Monitor - Installation & Local Development Guide

## Table of Contents
1. [Installing on Windows (PWA)](#installing-on-windows-pwa)
2. [Running Locally](#running-locally)
3. [Important Notes](#important-notes)

---

## Installing on Windows (PWA)

This application can be installed on Windows as a **Progressive Web App (PWA)**, which creates a standalone desktop application experience. **Note: This is NOT a native Windows .exe file**, but a web app that runs in its own window without browser UI.

### Installation Steps for Chrome (Windows)

1. **Open the deployed app** in Google Chrome browser
   - Navigate to your app's URL (e.g., `https://your-app-url.ic0.app`)

2. **Install the app**
   - Look for the **install icon** (⊕ or computer icon) in the address bar (right side)
   - Click the install icon
   - OR click the **three-dot menu** (⋮) in the top-right corner
   - Select **"Install [App Name]..."** or **"Install app"**

3. **Confirm installation**
   - A dialog will appear asking to install the app
   - Click **"Install"**

4. **Launch the app**
   - The app will open in a standalone window (no browser tabs/address bar)
   - A desktop shortcut will be created automatically
   - You can also find it in your Start Menu

### Installation Steps for Microsoft Edge (Windows)

1. **Open the deployed app** in Microsoft Edge browser
   - Navigate to your app's URL

2. **Install the app**
   - Look for the **app available icon** (⊕) in the address bar
   - Click the icon
   - OR click the **three-dot menu** (⋯) in the top-right corner
   - Select **"Apps"** → **"Install this site as an app"**

3. **Confirm installation**
   - A dialog will appear with app details
   - Click **"Install"**

4. **Launch the app**
   - The app opens in its own window
   - Find it in Start Menu under "Apps"
   - Pin to taskbar for quick access

### Uninstalling the PWA

**Chrome:**
- Open the installed app
- Click the three-dot menu (⋮) in the app window
- Select **"Uninstall [App Name]..."**

**Edge:**
- Right-click the app icon in the taskbar or Start Menu
- Select **"Uninstall"**
- OR go to Settings → Apps → Installed apps → find the app → Uninstall

---

## Running Locally

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** package manager
- **DFX** (Internet Computer SDK) - [Install here](https://internetcomputer.org/docs/current/developer-docs/setup/install)

### Step 1: Install Dependencies

