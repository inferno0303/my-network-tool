const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadFile('index.html');
}

ipcMain.on('ping-host', (event, host) => {
    let cmd, args;
    if (process.platform === 'win32') {
        // 先切换到 UTF-8 编码页，再执行 ping
        cmd = 'cmd.exe';
        args = ['/c', `chcp 65001 >nul && ping -n 100 ${host}`];
    } else {
        cmd = 'ping';
        args = ['-c', '5', host];
    }

    const ping = spawn(cmd, args);

    ping.stdout.on('data', (data) => {
        event.sender.send('ping-output', data.toString());
    });

    ping.stderr.on('data', (data) => {
        event.sender.send('ping-output', `错误: ${data.toString()}`);
    });

    ping.on('close', (code) => {
        event.sender.send('ping-output', `进程结束 (退出码 ${code})`);
    });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    app.quit();
});
