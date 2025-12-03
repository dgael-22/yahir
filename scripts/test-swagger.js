const http = require('http');
const app = require('../index'); // Import the app

const port = 3001; // Use a different port for testing to avoid conflicts
const server = app.listen(port, () => {
    console.log(`Test server running on port ${port}`);

    const options = {
        hostname: 'localhost',
        port: port,
        path: '/api-docs/',
        method: 'GET',
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        if (res.statusCode === 200 || res.statusCode === 301) {
            console.log('Swagger endpoint is accessible.');
            server.close(() => process.exit(0));
        } else {
            console.error('Swagger endpoint failed.');
            server.close(() => process.exit(1));
        }
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        server.close(() => process.exit(1));
    });

    req.end();
});
