const MoleClient = require('mole-rpc/MoleClient');
const MoleServer = require('mole-rpc/MoleServer');
const EventEmitterTransportClient = require('../TransportClient');
const EventEmitterTransportServer = require('../TransportServer');

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
        'NOTIFICATION FROM CLIENT 1',
        await client1.notify('getGreeting', 'User1')
    );

    console.log(
        'FROM CLIENT 2',
        await client2.callMethod('getGreeting', 'User2')
    );

    console.log('PROMISE ALL',
        await Promise.all([
            client1.callMethod('getGreeting', 'User1'),
            client1.callMethod('getGreeting', 'User2'),
            client1.callMethod('getGreeting', 'User3'),
            client1.callMethod('getGreeting', 'User4'),
            client1.callMethod('getGreeting', 'User5'),
            client1.callMethod('getGreeting', 'User6'),
            client2.callMethod('getGreeting', 'User1'),
            client2.callMethod('getGreeting', 'User2'),
            client2.callMethod('getGreeting', 'User3'),
            client2.callMethod('getGreeting', 'User4'),
            client2.callMethod('getGreeting', 'User5'),
            client2.callMethod('getGreeting', 'User6')
        ])
    );


    const batch = [
        ['getGreeting', 'User1'],
        ['getGreeting', 'User1'],
        ['getGreeting', 'User1'],
        ['getGreeting', 'User1']
    ];
    console.log('BATCH',
        await client1.batch(batch) // HOW TO BATCH NOTIFICATIONS
    );
);

    
}

main();