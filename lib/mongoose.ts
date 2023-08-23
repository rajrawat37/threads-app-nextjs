import mongoose from "mongoose";

let isConnected = false; //variable to check if mongoose is connected or not

export const connectToDB = async() => {

    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) return console.log('Mongo Db Url not found');

    if(isConnected) return console.log('Already connected to MongoDb');

    //else make connection to mongoose
    
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected=true;
        console.log('🍏 Connected to 🌿 Mongo db 🌿');
    } catch (error) {
        console.log("❌",error);
    }
}