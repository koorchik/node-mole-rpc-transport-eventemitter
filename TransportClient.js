class EventEmitterTransportClient {
    constructor({ emitter, inTopic, outTopic }) {
        this.emitter = emitter;
        this.inTopic = inTopic;
        this.outTopic = outTopic;
    }

    onResponse(callback) {
        this.emitter.on(this.inTopic, callback);
    }

    async sendRequest(data) {
        return this.emitter.emit(this.outTopic, data);
    }
}

module.exports = EventEmitterTransportClient;
