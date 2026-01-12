const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const products = [
    {
        name: "Ceiling Light",
        price: 75,
        oldPrice: 82,
        image: "/images/products/product-1.png",
        category: "Lighting",
        description: "Elegant ceiling light for your living room.",
        countInStock: 10,
        rating: 4.5,
        numReviews: 4,
    },
    {
        name: "Wood Chair",
        price: 50,
        oldPrice: 70,
        image: "/images/products/product-2.png",
        category: "Chair",
        description: "Comfortable wooden chair.",
        countInStock: 7,
        rating: 4.0,
        numReviews: 4,
    },
    {
        name: "Paper Cupboard",
        price: 105,
        oldPrice: 120,
        image: "/images/products/product-3.png",
        category: "Cupboard",
        description: "Stylish paper cupboard for storage.",
        countInStock: 5,
        rating: 3,
        numReviews: 3,
    },
    {
        name: "Ole Gundorse Spring",
        price: 75,
        oldPrice: 82,
        image: "/images/products/product-4.png",
        category: "Sofa",
        description: "Modern sofa for relaxation.",
        countInStock: 10,
        rating: 5,
        numReviews: 9,
    },
    {
        name: "Treos Seroes 911",
        price: 200,
        oldPrice: 210,
        image: "/images/products/product-5.png",
        category: "Table",
        description: "High quality table.",
        countInStock: 7,
        rating: 3.5,
        numReviews: 2,
    },
    {
        name: "Multi bilderman slibber",
        price: 45,
        oldPrice: 50,
        image: "/images/products/product-6.png",
        category: "Decoration",
        description: "Beautiful decoration item.",
        countInStock: 0,
        rating: 4,
        numReviews: 4,
    },
    {
        name: "XORA corner desk",
        price: 320,
        oldPrice: 325,
        image: "/images/products/product-7.png",
        category: "Desk",
        description: "Spacious corner desk.",
        countInStock: 10,
        rating: 4.5,
        numReviews: 5,
    },
    {
        name: "Black Forest Series Wood",
        price: 225,
        oldPrice: 240,
        image: "/images/products/product-8.png",
        category: "Chair",
        description: "Premium wood chair.",
        countInStock: 7,
        rating: 4.0,
        numReviews: 6,
    },
    {
        name: "Papper Cupboard",
        price: 105,
        oldPrice: 120,
        image: "/images/products/product-9.png",
        category: "Cupboard",
        description: "Another stylish cupboard.",
        countInStock: 5,
        rating: 3,
        numReviews: 3,
    },
    {
        name: "Ole Gundorse Spring",
        price: 75,
        oldPrice: 82,
        image: "/images/products/product-10.png",
        category: "Sofa",
        description: "Comfortable sofa.",
        countInStock: 10,
        rating: 5,
        numReviews: 9,
    },
];

const importData = async () => {
    try {
        await Product.collection.dropIndexes();
        await Product.deleteMany();
        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash('123456', salt);

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashPassword, // manually hashed for now or rely on pre-save hook if creating one by one. But insertMany skips pre-save hooks in some versions or if not configured. 
                // Actually, User.insertMany DOES NOT trigger pre('save').
                // So I should create user using create or manually hash. 
                // I'll manually hash above.
                isAdmin: true,
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password: hashPassword,
                isAdmin: false,
            }
        ]);

        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
