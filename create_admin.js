const mongoose = require('./backend/node_modules/mongoose');
const bcrypt = require('./backend/node_modules/bcryptjs');
const Admin = require('./backend/models/admin');

async function createAdmin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/rutikas_bakery');

        const hashedPassword = await bcrypt.hash('riya@001', 12);

        const admin = new Admin({
            adminId: 'riya sharma',
            name: 'Riya Sharma',
            email: 'riyu30747@gmail.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin created successfully!');
        console.log('Admin ID: riya sharma');
        console.log('Password: riya@001');

    } catch (error) {
        console.error('Error creating admin:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

createAdmin();
