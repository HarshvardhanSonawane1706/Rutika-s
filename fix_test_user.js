const mongoose = require('./backend/node_modules/mongoose');
const bcrypt = require('./backend/node_modules/bcryptjs');
const User = require('./backend/models/user');

async function fixTestUser() {
    try {
        await mongoose.connect('mongodb://localhost:27017/rutikas_bakery');

        const user = await User.findOne({ email: 'test@example.com' });
        if (user) {
            const hashedPassword = await bcrypt.hash('test123', 12);
            user.password = hashedPassword;
            await user.save();
            console.log('Test user password updated to test123');
        } else {
            console.log('Test user not found');
        }

    } catch (error) {
        console.error('Error fixing test user:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

fixTestUser();
