import WebSocket from 'ws';
import WebSocketServer from 'ws';

import { continueHeartbeat } from './../bot.js';
import { pulseHeartbeat } from './../bot.js';
import { identify } from './../bot.js';
import { runBot } from './../bot.js';

describe('A websocket test suite', function() {

    // Stub websocket server
    beforeAll(function() {
        // Spies for function calls I want to check.
        jasmine.createSpy(continueHeartbeat);
        jasmine.createSpy(identify);
    });


    it('should call correct funtions on hello opcode (opcode 10)', function() {

        const fakeJSON = {
            'op': 10,
            'd': {
                'heartbeat_interval': 45000,
            },
        };

        const stubWebSocketServer = new WebSocketServer('ws://localhost:8080/');

        function sendFakeData(fakeData) {
            stubWebSocketServer.on('connection', function connection(ws) {
                ws.send(fakeData);
            });
        }

        // Create stub to be used in runBot
        const stubWebSocket = new WebSocket('wss://localhost:8080/');

        // Call function under test
        runBot(stubWebSocket);

        sendFakeData(fakeJSON);


        // Check if correct functions were called
        expect(continueHeartbeat.toHaveBeenCalled());
        expect(identify.toHaveBeenCalled());

    });
});
