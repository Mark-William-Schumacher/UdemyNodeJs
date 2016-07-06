'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');

const routes = {
    GET: {
        '/': (req, res) => {
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end('<h1>Hello Router</h1>');
        },
        '/about': (req, res) => {
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end('<h1>This is the about page</h1>');
        },
        '/api/getinfo': (req, res) => {
            // fetch data from db and respond as JSON
            const baseURI = url.parse(req.url, true);
            url.parse(req.url, true);
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify(baseURI.query));
        },
    },
    POST: {
        '/api/login': (req, res) => {
            let body = '';
            req.on('data', data => {
                body += data;
                console.log('Size: ', body.length / (1024 * 1024));
                if (body.length > 2097152) {
                    res.writeHead(413, { 'Content-type': 'text/html' });
                    res.end('<h3>Error: The file being uploaded exceeds the 2MB limit</h3>',
                    () => req.connection.destroy()); /* stops the connection */
                }
            });
            req.on('end', () => {
                const params = qs.parse(body);
                console.log('body', body);
                console.log('Username: ', params.username);
                console.log('Password: ', params.password);
                // Query a db to see if the user exists
                // If so, send a JSON response to the SPA
                res.end();
            });
        },
    },
    not_avaliable: (req, res) => {
        res.writeHead(404);
        res.end('Content not found.');
    },
};

function router(req, res) {
    const baseURI = url.parse(req.url, true);
    const resolveRoute = routes[req.method][baseURI.pathname];
    if (resolveRoute !== undefined) {
        resolveRoute(req, res);
    } else {
        routes.not_avaliable(req, res);
    }
}

http.createServer(router).listen(3000, () => {
    console.log('Server running on port 3000');
});
