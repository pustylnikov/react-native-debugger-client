global.console = proxy(global.console);
const supportedMethods = {
    clear: null, count: null, dir: null, dirxml: null, error: null,
    group: null, groupCollapsed: null, groupEnd: null, info: null,
    log: null, table: null, time: null, timeEnd: null, warn: null,
};
let socket = null;
let isConnect = false;
let started = false;
let queue = [];

export function runDebugger(url) {

    if (started === true) {
        return;
    }

    started = true;

    socket = new WebSocket('ws://' + url + '?client=app');

    socket.onopen = () => {
        isConnect = true;
        console.clear();
        queue.forEach(([name, args]) => {
            track(name, ...args);
        });
        queue = [];
    };

    socket.onclose = () => {
        isConnect = false;
    };
}

export function track(name, ...args) {
    if (supportedMethods[name] === undefined) {
        throw new Error(`Only methods supported: ${Object.values(supportedMethods).join(', ')}`);
    }
    if (isConnect) {
        try {
            let cache = [];
            const json = JSON.stringify([name, args], function (key, value) {
                if (typeof value === 'function') {
                    return 'function ' + value.name;
                } else if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return value.toString();
                    }
                    cache.push(value);
                    return value;
                } else {
                    return value;
                }
            });
            cache = null;
            socket.send(json);
        } catch (e) {
            socket.send(JSON.stringify(['log', [e.message]]));
        }
    } else if (started === true) {
        queue.push([name, args]);
    }
}

function proxy(target) {
    return new Proxy({}, {
        get(_target, prop) {
            let value = target[prop];
            if (started === true && supportedMethods[prop] !== undefined && typeof value === 'function') {
                return (...args) => {
                    track(prop, ...args);
                    return value(...args);
                };
            }
            return value;
        },
    });
}
