const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    pingHost: (host) => ipcRenderer.send('ping-host', host),
    onPingOutput: (callback) => ipcRenderer.on('ping-output', (event, data) => callback(data))
});
