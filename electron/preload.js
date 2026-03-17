const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  registerDoctor: (data) => ipcRenderer.invoke("register-doctor", data),
  registerWithClinic: (data) => ipcRenderer.invoke("register-with-clinic", data),
  loginDoctor: (data) => ipcRenderer.invoke("login-doctor", data),
  expandWindow: () => ipcRenderer.invoke("expand-window"),
  openResetWindow: () => ipcRenderer.invoke("open-reset-window"),
  openChangeWindow: () => ipcRenderer.invoke("open-change-window"),
  closeApp: () => ipcRenderer.invoke("close-app"),
});