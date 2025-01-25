require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const adminData = {
            firstName: 'Prajwal',
            lastName: 'Admin',
            email: 'Prajwal01532@gmail.com',
            password: 'Prajwal@123',
            nationality: 'Nepalese',
            mobileNumber: '9876543210',
            isAdmin: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new User(adminData);
        await admin.save();

        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin(); 