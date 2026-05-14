const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveImage: (file) => ipcRenderer.invoke('save-image', file)
});