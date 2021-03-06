## Event Emitter Transport for Mole RPC (JSON RPC Library)

[![npm version](https://badge.fury.io/js/mole-rpc-transport-eventemitter.svg)](https://badge.fury.io/js/mole-rpc-transport-eventemitter)
[![Build Status](https://travis-ci.org/koorchik/node-mole-rpc-transport-eventemitter.svg?branch=master)](https://travis-ci.org/koorchik/node-mole-rpc-transport-eventemitter)
[![Known Vulnerabilities](https://snyk.io/test/github/koorchik/node-mole-rpc-transport-eventemitter/badge.svg?targetFile=package.json)](https://snyk.io/test/github/koorchik/node-mole-rpc-transport-eventemitter?targetFile=package.json)


Mole-RPC is a tiny transport agnostic JSON-RPC 2.0 client and server which can work both in NodeJs, Browser, Electron etc.

This is EventEmitter based tranport but there are [many more transports](https://www.npmjs.com/search?q=keywords:mole-transport). 


## Usage example

```js
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
      })
    ]
  });

  server.expose({
    getGreeting(name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`Hi, ${name}`);
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
    })
  });

  const client2 = new MoleClient({
    transport: new EventEmitterTransportClient({
      emitter,
      inTopic: 'toClient2',
      outTopic: 'fromClient2'
    })
  });

  console.log('FROM CLIENT 1', await client1.callMethod('getGreeting', 'User1'));
  console.log('FROM CLIENT 2', await client2.callMethod('getGreeting', 'User2'));
}

main();
```
