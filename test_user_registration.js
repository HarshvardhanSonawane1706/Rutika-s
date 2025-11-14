const http = require('http');

function testUserRegistration() {
    const postData = JSON.stringify({
        name: 'New Test User',
        email: 'unique' + Date.now() + '@example.com',
        password: 'newtest123',
        phone: '9876543210'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log('Registration Response status:', res.statusCode);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Registration Response data:', jsonData);
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

testUserRegistration();
