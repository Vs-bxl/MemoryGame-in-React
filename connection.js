import mongoose from "mongoose";

const MONGO_URI = "mongodb://user_437mdzujn:p437mdzujn@ocdb.app:5050/db_437mdzujn";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "db_437mdzujn",
        });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};
