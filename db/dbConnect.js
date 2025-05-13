import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose';

const Mongo_Url = process.env.MONGO_URI;


const dbConnect = async () => {
    try {
        await mongoose.connect(Mongo_Url);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        // Exit the process if DB connection fails
        process.exit(1);
    }
};

export default dbConnect;
