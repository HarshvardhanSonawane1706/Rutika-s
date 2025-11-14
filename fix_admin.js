const mongoose = require('./backend/node_modules/mongoose');
const bcrypt = require('./backend/node_modules/bcryptjs');
const Admin = require('./backend/models/admin');

async function fixAdmin() {
    try {
        await mongoose.connect('mongodb://localhost:27017/rutikas_bakery');

        const admin = await Admin.findOne({ email: 'riyu30747@gmail.com' });
        if (admin) {
            const hashedPassword = await bcrypt.hash('riya@001', 12);
            admin.adminId = 'riya sharma';
            admin.name = 'Riya Sharma';
            admin.password = hashedPassword;
            await admin.save();
            console.log('Admin updated successfully!');
            console.log('Admin ID: riya sharma');
            console.log('Password: riya@001');
        } else {
            console.log('Admin not found');
        }

    } catch (error) {
        console.error('Error fixing admin:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

fixAdmin();
