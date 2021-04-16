const merge = require('lodash.merge')
const request = require('request-promise')
const nodeRedUtils = require("@node-red/util")
const util = nodeRedUtils.util
const log = nodeRedUtils.log

const DEFAULT_REQUEST_OPTS = require('./constants')

class ConfigServiceStorage {
    constructor(url, opts) {
        const self = this
        async function _requestConfig(url, opts) {
            try {
                if (url && url.length) {
                    log.info(`[ConfigService Connector] request to ${url} every ${opts.interval} miliseconds`)
                    const config = await request({ url, strictSSL: opts.strictSSL })
                    self.data.global.config = merge({}, self.data.global.config, JSON.parse(config))
                    log.info('[ConfigService Connector] request successfully')
                } else {
                    throw new Error('target url is missing')
                }
            } catch(err) {
                log.error(`[ConfigService Connector] request failed`)
                log.debug(`[ConfigService Connector] response error: ${err.message}`)
                if (opts.optional) {
                    log.warn('[ConfigService Connector] dependency is optional')
                } else {
                    log.warn('[ConfigService Connector] dependency is mandatory')
                    process.exit(503)
                }
            }
        }
        // Assign ConfigServiceStorage parameters
        this.url = url
        this.opts = merge({}, DEFAULT_REQUEST_OPTS, opts)
        this.data = {
            global: {
                config: {}
            }
        };
        // Request once Configuration
        _requestConfig(url, this.opts)
        // Start the clock
        setInterval(() => _requestConfig(url, this.opts), this.opts.interval)
    }
    // We copy the following code from here:
    // https://github.com/node-red/node-red/blob/master/packages/node_modules/%40node-red/runtime/lib/nodes/context/memory.js
    open() {
        return Promise.resolve()
    }
    close() {
        return Promise.resolve()
    }
    get(scope, key, callback) {
        var value;
        var error;
        if (!Array.isArray(key)) {
            try {
                value = this._getOne(scope,key);
            } catch(err) {
                if (!callback) {
                    throw err;
                }
                error = err;
            }
            if (callback) {
                callback(error,value);
                return;
            } else {
                return value;
            }
        }

        value = [];
        for (var i=0; i<key.length; i++) {
            try {
                value.push(this._getOne(scope,key[i]));
            } catch(err) {
                if (!callback) {
                    throw err;
                } else {
                    callback(err);
                    return;
                }
            }
        }
        if (callback) {
            callback.apply(null, [undefined].concat(value));
        } else {
            return value;
        }
    }
    set(scope, key, value, callback) {
        if(!this.data[scope]){
            this.data[scope] = {};
        }
        var error;
        if (!Array.isArray(key)) {
            key = [key];
            value = [value];
        } else if (!Array.isArray(value)) {
            // key is an array, but value is not - wrap it as an array
            value = [value];
        }
        try {
            for (var i=0; i<key.length; i++) {
                var v = null;
                if (i < value.length) {
                    v = value[i];
                }
                util.setObjectProperty(this.data[scope],key[i],v);
            }
        } catch(err) {
            if (callback) {
                error = err;
            } else {
                throw err;
            }
        }
        if(callback){
            callback(error);
        }
    }
    keys(scope, callback) {
        var values = [];
        var error;
        try{
            if(this.data[scope]){
                if (scope !== "global") {
                    values = Object.keys(this.data[scope]);
                } else {
                    values = Object.keys(this.data[scope]).filter(function (key) {
                        return key !== "set" && key !== "get" && key !== "keys";
                    });
                }
            }
        }catch(err){
            if(callback){
                error = err;
            }else{
                throw err;
            }
        }
        if(callback){
            if(error){
                callback(error);
            } else {
                callback(null, values);
            }
        } else {
            return values;
        }
    }
    delete(scope) {
        delete this.data[scope];
        return Promise.resolve();
    }
    clean(activeNodes) {
        for(var id in this.data){
            if(this.data.hasOwnProperty(id) && id !== "global"){
                var idParts = id.split(":");
                if(activeNodes.indexOf(idParts[0]) === -1){
                    delete this.data[id];
                }
            }
        }
        return Promise.resolve();
    }
    _getOne(scope, key) {
        var value;
        if(this.data[scope]){
            try {
                value = util.getObjectProperty(this.data[scope], key);
            } catch(err) {
                if (err.code === "INVALID_EXPR") {
                    throw err;
                }
                value = undefined;
            }
        }
        return value;
    }
    _export() {
        return this.data;
    }
}
 
module.exports = (url, opts) => (new ConfigServiceStorage(url, opts))
