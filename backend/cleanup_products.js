const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rutikas_bakery', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to MongoDB');

    // Define Product schema (same as in models/product.js)
    const productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        available: { type: Boolean, default: true }
    }, { timestamps: true });

    const Product = mongoose.model('Product', productSchema);

    try {
        // Get all products
        const allProducts = await Product.find({});
        console.log(`Found ${allProducts.length} products total`);

        // Available images
        const availableImages = [
            'cake.jpg',
            'chocolate-chip-cookies.jpg',
            'chocolate-chip.jpg',
            'chocolate-fudge-cake.jpg',
            'croissant.jpg',
            'fruit-tart.jpg',
            'macarons.jpg',
            'red-velvet-cake.jpg',
            'red-velvet.jpg',
            'sourdough-bread.jpg',
            'sourdough.jpg',
            'whole-wheat-bread.jpg',
            'whole-wheat.jpg'
        ];

        // Remove products with invalid images
        const productsToRemove = allProducts.filter(product => !availableImages.includes(product.image));
        console.log(`Removing ${productsToRemove.length} products with invalid images:`);
        productsToRemove.forEach(product => {
            console.log(`- ${product.name}: ${product.image}`);
        });

        for (const product of productsToRemove) {
            await Product.findByIdAndDelete(product._id);
        }

        // Remove duplicates (keep the oldest one)
        const remainingProducts = await Product.find({});
        const seen = new Map();
        const duplicates = [];

        remainingProducts.forEach(product => {
            const key = `${product.name}-${product.category}`;
            if (seen.has(key)) {
                duplicates.push(product);
            } else {
                seen.set(key, product);
            }
        });

        console.log(`Removing ${duplicates.length} duplicate products:`);
        duplicates.forEach(product => {
            console.log(`- ${product.name} (${product.category})`);
        });

        for (const product of duplicates) {
            await Product.findByIdAndDelete(product._id);
        }

        // Final count
        const finalProducts = await Product.find({});
        console.log(`\nFinal product count: ${finalProducts.length}`);
        console.log('Remaining products:');
        finalProducts.forEach(product => {
            console.log(`- ${product.name}: ${product.image}`);
        });

        console.log('\nCleanup completed successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});
