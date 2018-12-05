Event Emitter Transport for Mole RPC (JSON RPC Library) 
-------------------------------------------------------

```javascript
const MoleClient = require('mole-rpc/MoleClient');
const MoleServer = require('mole-rpc/MoleServer');
const EventEmitterTransportClient = require('mole-rpc-transport-eventemitter/TransportClient');
const EventEmitterTransportServer = require('mole-rpc-transport-eventemitter/TransportServer');

const EventEmitter = require('events');

async function main() {
    const emitter = new EventEmitter();

    await runServer(emitter);
    await runClients(emitter);
}

async function runServer(emitter) {
    const server = new MoleServer({
        transports: [
            new EventEmitterTransportServer({
                emitter,
                inTopic: 'fromClient1',
                outTopic: 'toClient1'
            }),
            new EventEmitterTransportServer({
                emitter,
                inTopic: 'fromClient2',
                outTopic: 'toClient2'
            }),
        ],
    });
    
    
    server.expose({
        getGreeting(name) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(`Hi, ${name}`)
                }, 1000);
            });
        } 
    });
}

async function runClients(emitter) {
    const client1 = new MoleClient({
        transport: new EventEmitterTransportClient({
            emitter,
            inTopic: 'toClient1',
            outTopic: 'fromClient1'
        }),
    });

    const client2 = new MoleClient({
        transport: new EventEmitterTransportClient({
            emitter,
            inTopic: 'toClient2',
            outTopic: 'fromClient2'
        }),
    });

    console.log(
        'FROM CLIENT 1',
        await client1.callMethod('getGreeting', 'User1')
    );

    console.log(
        'FROM CLIENT 2',
        await client2.callMethod('getGreeting', 'User2')
    );
}

main();
```