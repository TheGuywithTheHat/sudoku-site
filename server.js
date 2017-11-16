const path = require('path');
const fs = require('fs');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');

const app = express();
const expressWs = require('express-ws')(app);

var connected = [];

var cells;
try {
    cells = require('./sudoku.json');
} catch (err) {
    cells = [];
    for (var y = 0; y < 9; y++) {
        cells.push([]);
        for (var x = 0; x < 9; x++) {
            cells[y].push({
                number: null,
                numbers: [],
            });
            for (var digit = 0; digit < 9; digit++) {
                cells[y][x].numbers.push(false);
            }
        }
    }
    write();
}

function write() {
    fs.writeFile(path.join(__dirname, 'sudoku.json'), JSON.stringify(cells), () => {
        // do nothing lol
    });
}

function send(ws) {
    ws.send(JSON.stringify({
        cells: cells
    }));
}

function broadcast(message) {
    if (typeof message != 'string') {
        message = JSON.stringify(message);
    }
    for (var client of expressWs.getWss().clients) {
        client.send(message);
    }
}

app.use('/', expressStaticGzip(path.join(__dirname, 'build')));

app.ws('/socket', (ws, req) => {
    var ip = ws._socket.remoteAddress;
    send(ws);

    connected.push(ip);
    broadcast({
        type: 'ips',
        ips: connected
    });

    ws.on('close', () => {
        connected.splice(connected.indexOf(ip), 1);
        broadcast({
            type: 'ips',
            ips: connected
        });
    });

    ws.send(JSON.stringify({
        text: 'Click a cell to select it, then press a key to set the digit for that cell.',
        name: 'System',
        type: 'chat-message',
    }));

    ws.send(JSON.stringify({
        text: 'Click a small number to toggle it.',
        name: 'System',
        type: 'chat-message',
    }));

    ws.send(JSON.stringify({
        text: 'This is realtime multiplayer, so don\'t screw it up lol.',
        name: 'System',
        type: 'chat-message',
    }));

    ws.on('message', (msg) => {
        try {
            var message = JSON.parse(msg);
            if (message.refresh) {
                send(ws);
            } else if (message.write) {
                if (message.type == 'small-number') {
                    cells[message.y][message.x].numbers[message.digit] = message.set;
                } else if (message.type == 'large-number') {
                    cells[message.y][message.x].number = message.set;
                }
                write();
            }
            if (message.broadcast) {
                message.origin = ip;
                broadcast(message);
            }
        } catch (err) {
            console.log(err);
        }
    });
});

app.listen(4200, () => {
    console.log('listening at http://localhost:4200');
});