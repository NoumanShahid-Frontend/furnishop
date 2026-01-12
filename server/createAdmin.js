const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const createAdmin = async () => {
    try {
        const adminEmail = 'admin@furnishop.com';
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            userExists.name = userExists.name || 'Admin User';
            userExists.email = adminEmail;
            userExists.password = 'Hello123';
            userExists.isAdmin = true;
            await userExists.save();
            console.log('Admin user updated successfully');
            process.exit();
        }

        const user = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: 'Hello123',
            isAdmin: true,
        });

        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
