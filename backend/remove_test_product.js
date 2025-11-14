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
        // Remove the test product
        const result = await Product.deleteOne({ name: 'Test Product' });
        console.log('Deleted test product:', result);

        // Add some new sample products with existing image names
        const newProducts = [
            {
                name: 'Vanilla Cupcake',
                description: 'Classic vanilla cupcake with buttercream frosting',
                price: 3.99,
                category: 'Pastries',
                image: 'cake.jpg',
                available: true
            },
            {
                name: 'Blueberry Muffins',
                description: 'Fresh blueberry muffins with streusel topping',
                price: 4.49,
                category: 'Pastries',
                image: 'fruit-tart.jpg',
                available: true
            },
            {
                name: 'Bagel',
                description: 'Fresh baked bagel with various toppings available',
                price: 2.99,
                category: 'Breads',
                image: 'sourdough.jpg',
                available: true
            },
            {
                name: 'Oatmeal Raisin Cookies',
                description: 'Chewy oatmeal cookies with plump raisins',
                price: 2.49,
                category: 'Cookies',
                image: 'chocolate-chip.jpg',
                available: true
            },
            {
                name: 'Tiramisu',
                description: 'Classic Italian dessert with coffee-soaked ladyfingers',
                price: 7.99,
                category: 'Pastries',
                image: 'macarons.jpg',
                available: true
            }
        ];

        const insertedProducts = await Product.insertMany(newProducts);
        console.log('Added new products:', insertedProducts.length);

        console.log('Operation completed successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});
