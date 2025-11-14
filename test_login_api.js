const http = require('http');

function testLoginAPI() {
    const postData = JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log('Response status:', res.statusCode);
        console.log('Response headers:', res.headers);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Response data:', jsonData);
            } catch (e) {
                console.log('Raw response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Error:', e.message);
    });

    req.write(postData);
    req.end();
}

testLoginAPI();
