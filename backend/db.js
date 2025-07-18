import mongoose from "mongoose";


async function connectDb() {
    try {

        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected")
    } catch(error) {
        console.error(error)
    }
}

export default connectDb;