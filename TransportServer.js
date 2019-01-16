class EventEmitterTransportServer {
    constructor({ emitter, inTopic, outTopic }) {
        this.emitter = emitter;
        this.inTopic = inTopic;
        this.outTopic = outTopic;
        this.onRequestCallback = undefined;
    }

    onRequest(callback) {
        this.onRequestCallback = callback;
    }

    run() {
        this.emitter.on(this.inTopic, async reqData => {
            const respData = await this.onRequestCallback(reqData);
            if (!respData) return; // no data means notification

            this.emitter.emit(this.outTopic, respData);
        });
    }
}

module.exports = EventEmitterTransportServer;
