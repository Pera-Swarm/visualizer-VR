let jwt = require('jsonwebtoken');

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

export function getCredentials() {
    // TODO: Add channel, host and port into URL (as optional parameters)
    // Suggestion: Use JWT insted of exposed credentials
    // Simulator server can provide the JWT token

    const storedCredentials = localStorage.getItem('pera-swarm-credentials');

    const username = getUrlParam('username', false);
    const password = getUrlParam('password', false);
    const key = getUrlParam('key', false);
    const channel = getUrlParam('channel', false);
    const port = getUrlParam('port', false);
    const server = getUrlParam('server', false);

    clearParams();

    setTimeout(() => {
        if (server !== false) {
            localStorage.setItem('pera-swarm-server', server);
        }
        if (channel !== false) {
            localStorage.setItem('pera-swarm-channel', channel);
        }
        if (port !== false) {
            localStorage.setItem('pera-swarm-port', port);
        }
        if (key !== false) {
            localStorage.setItem('pera-swarm-key', key);
        }
    }, 2000);

    if (username === false && password === false && storedCredentials !== null) {
        return JSON.parse(storedCredentials);

    } else if (username !== false && password !== false) {
        localStorage.setItem('pera-swarm-credentials',
            JSON.stringify({
                username,
                password
            })
        );
        return {
            username,
            password
        };
    } else if (key !== false) {
        // decode the api key
        return decodeKey(key);
    } else {
        return -1;
    }

}

function clearParams() {
    const path = window.location.origin + window.location.pathname;
    window.history.pushState({}, document.title, path);
}

function decodeKey() {
    try {
        let decoded = jwt.verify(token, 'swarm-visualizer-secret');
        return decoded;
    } catch (err) {
        // err
        console.log('Token Error');
        return -1;
    }
}
