import mongoose from "mongoose";
async function connectDB() {
    async function main() {
        await mongoose.connect(process.env.MONGODB_URL);
    }
    try {
        const res = await main();
        console.log("Connected to DB");
    }catch(e) {
        console.log(e);
    }
}
export default connectDB;