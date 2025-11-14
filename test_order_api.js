const http = require('http');

// Test order creation
function testOrderCreation() {
    const orderData = {
        userId: '690758f577bbd82b5215962a', // Test user ID
        items: [
            {
                productId: '6907590377bbd82b5215962d',
                quantity: 1,
                price: 25
            }
        ],
        totalAmount: 25,
        deliveryAddress: '123 Test Street',
        phone: '1234567890'
    };

    const postData = JSON.stringify(orderData);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/orders',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log('Order Creation Response status:', res.statusCode);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Order Creation Response data:', jsonData);
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

// Test get orders for user
function testGetUserOrders() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/orders/user/690758f577bbd82b5215962a',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log('Get User Orders Response status:', res.statusCode);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Get User Orders Response data length:', jsonData.length);
                if (jsonData.length > 0) {
                    console.log('First order:', jsonData[0]);
                }
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

// Test get all orders (admin)
function testGetAllOrders() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/orders',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log('Get All Orders Response status:', res.statusCode);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Get All Orders Response data length:', jsonData.length);
                if (jsonData.length > 0) {
                    console.log('First order:', jsonData[0]);
                }
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

// Run tests
console.log('Testing Order APIs...');
testOrderCreation();
setTimeout(() => {
    testGetUserOrders();
    setTimeout(() => {
        testGetAllOrders();
    }, 1000);
}, 1000);
