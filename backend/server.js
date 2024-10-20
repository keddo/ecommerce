import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import { connectDB } from './lib/db.js';

const __dirname = path.resolve()
// console.log(__dirname) // E:\All_Courses\MERN-Projects\ecommerce
dotenv.config();


const app = express();
app.use(express.json({limit: '10mb'}));
app.use(cookieParser())
app.use(morgan('dev'));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB()
})