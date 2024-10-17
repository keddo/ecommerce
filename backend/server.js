import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import exp from 'constants';

const __dirname = path.resolve()
// console.log(__dirname) // E:\All_Courses\MERN-Projects\ecommerce
dotenv.config();


const app = express();
app.use(express.json({limit: '10mb'}));
app.use(cookieParser())

const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})