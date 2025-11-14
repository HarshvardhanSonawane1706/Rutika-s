const mongoose = require('./backend/node_modules/mongoose');
const bcrypt = require('./backend/node_modules/bcryptjs');
const jwt = require('./backend/node_modules/jsonwebtoken');

async function testLogin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/rutikas_bakery');

        // Test user login
        const User = require('./backend/models/user');

        // Check if any users exist
        const users = await User.find({});
        console.log('Existing users:', users.length);

        if (users.length === 0) {
            console.log('No users found. Creating a test user...');

            const hashedPassword = await bcrypt.hash('test123', 12);

            const testUser = new User({
                name: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                phone: '1234567890'
            });

            await testUser.save();
            console.log('Test user created: test@example.com / test123');
        }

        // Test login with existing user
        const user = await User.findOne({ email: 'test@example.com' });
        if (user) {
            console.log('User found:', user.email);
            console.log('Stored hash:', user.password);
            const isMatch = await bcrypt.compare('test123', user.password);
            console.log('Password match for test123:', isMatch);

            // Try with different password
            const isMatch2 = await bcrypt.compare('password', user.password);
            console.log('Password match for password:', isMatch2);

            if (isMatch) {
                const token = jwt.sign(
                    { userId: user._id },
                    'bakery_secret',
                    { expiresIn: '7d' }
                );
                console.log('Login successful, token generated');
            } else {
                console.log('Password does not match. User may have different password.');
            }
        } else {
            console.log('Test user not found');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

testLogin();
