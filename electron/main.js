const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const preloadPath = path.join(__dirname, "preload.js");

const API_URL = "https://dr-clinic-app.onrender.com";



let mainWindow = null;
let resetWindow = null;
let changeWindow = null;

/* ================= PROTOCOL (EMAIL RESET LINK) ================= */
app.setAsDefaultProtocolClient("myclinic");

app.on("open-url", (event, url) => {
  event.preventDefault();
  const parsed = new URL(url);
  const token = parsed.pathname.replace("/", "");
  // Note: Ensure createResetWindow is defined or handled
});

/* ================= MAIN WINDOW ================= */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    center: true,
    backgroundColor: "#0f172a",
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false, 
    },
  });
  mainWindow.webContents.openDevTools();
  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    
  } else {
    // Corrected production path logic
    const indexPath = path.join(__dirname, 'frontend-dist', 'index.html');
    
    // Using loadFile is safer for local files in packaged apps
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error("Failed to load index.html:", err);
    });
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* ================= IPC HANDLERS (LOGIN/REGISTER/ETC) ================= */
// ... (Your fetch handlers are correct as long as they point to Render)



/* ================= LOGIN IPC ================= */

ipcMain.handle("login-doctor", async (_, data) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return { success: false, message: "Login failed" };
  }
});

/* ================= REGISTER IPC ================= */

ipcMain.handle("register-with-clinic", async (_, data) => {
  try {
    const res = await fetch(
      `${API_URL}/auth/register-with-clinic`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    return await res.json();
  } catch (err) {
    console.error("register-with-clinic IPC error:", err);
    return { success: false, message: "IPC failed" };
  }
});


/* ================= WINDOW RESIZE ================= */

ipcMain.handle("expand-window", () => {
  if (mainWindow) {
    mainWindow.setSize(1200, 800);
    mainWindow.center();
  }
});

/* ================= RESET PASSWORD WINDOW ================= */

ipcMain.handle("open-reset-window", () => {
  const win = new BrowserWindow({
    width: 420,
    height: 300,
    modal: true,
    resizable: false,
    parent: BrowserWindow.getFocusedWindow(),
    webPreferences: {
      preload: preloadPath,
    },
  });
  if (!app.isPackaged) {
      win.loadURL("http://localhost:5173/#/request-reset");
    } else {
      // In production, load the local file with the #hash route
      win.loadFile(path.join(__dirname, 'frontend-dist/index.html'), { hash: 'request-reset' });
    }
  });


/* ================= CHANGE PASSWORD WINDOW ================= */

ipcMain.handle("open-change-window", () => {
  if (changeWindow) {
    changeWindow.focus();
    return;
  }

  changeWindow = new BrowserWindow({
    width: 480,
    height: 420,
    modal: true,
    // Safely check if mainWindow exists before assigning as parent
    parent: mainWindow || null, 
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false, // Recommended for security
    },
  });

  if (!app.isPackaged) {
    // Development mode
    changeWindow.loadURL("http://localhost:5173/#/change-password");
  } else {
    // Production mode using the safer .loadFile method with hash
    changeWindow.loadFile(path.join(__dirname, 'frontend-dist', 'index.html'), { 
      hash: 'change-password' 
    });
  } // <--- This was the missing brace!

  changeWindow.on("closed", () => {
    changeWindow = null;
  });
});
/* ================= CLOSE APP ================= */

ipcMain.handle("close-app", () => {
  app.quit();
});
