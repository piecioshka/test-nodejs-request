const http = require('http');

/**
 * Parsing response. Convert buffer to JSON format.
 *
 * @param {Set} response
 * @returns {string}
 */
function parseResponse(response) {
    const string = [...response].join('');
    try {
        return JSON.parse(string);
    } catch (err) {
        return string;
    }
}

/**
 * Make request via native Node.js modules.
 *
 * @param {string} url
 * @returns {Promise}
 */
function request(url) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, (res) => {
            const response = new Set();
            res.on('data', (chunk) => {
                response.add(chunk.toString());
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: parseResponse(response)
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}

module.exports = { request };
