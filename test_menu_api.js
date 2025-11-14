const http = require('http');

function testMenuAPI() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/menu',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log('Menu API Response status:', res.statusCode);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Menu API Response data length:', jsonData.length);
                console.log('First item:', jsonData[0]);
            } catch (e) {
                console.log('Raw response:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Error:', e.message);
    });

    req.end();
}

testMenuAPI();
