const http = require('http');

function testAdminLogin() {
    const postData = JSON.stringify({
        adminId: 'Riya',
        password: 'riya@123'
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/admin-login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log('Admin Login Response status:', res.statusCode);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Admin Login Response data:', jsonData);
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

testAdminLogin();
