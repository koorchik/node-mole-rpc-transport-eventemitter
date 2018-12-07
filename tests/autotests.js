const MoleClient = require('mole-rpc/MoleClient');
const MoleServer = require('mole-rpc/MoleServer');
const AutoTester = require('mole-rpc/AutoTester');

const TransportClient = require('../TransportClient');
const TransportServer = require('../TransportServer');

const EventEmitter = require('events');

async function main() {
    const emitter = new EventEmitter();

    const server = await prepareServer(emitter);
    const [client1, client2] = await prepareClients(emitter);

    const autoTester = new AutoTester({server, client1, client2});
    await autoTester.runAllTests();
}

async function prepareServer(emitter) {
    return new MoleServer({
        transports: [
            new TransportServer({
                emitter,
                inTopic: 'fromClient1',
                outTopic: 'toClient1'
            }),
            new TransportServer({
                emitter,
                inTopic: 'fromClient2',
                outTopic: 'toClient2'
            }),
        ],
    });
}

async function prepareClients(emitter) {
    const client1 = new MoleClient({
        transport: new TransportClient({
            emitter,
            inTopic: 'toClient1',
            outTopic: 'fromClient1'
        }),
    });

    const client2 = new MoleClient({
        transport: new TransportClient({
            emitter,
            inTopic: 'toClient2',
            outTopic: 'fromClient2'
        }),
    });

   return [client1, client2];
}

main().then(console.log, console.error);