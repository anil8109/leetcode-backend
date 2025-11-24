import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";

export const connectDB = async () => {
  try {
    await mongoose.connect(serverConfig.DB_URL);

    mongoose.connection.on("connected", () => {
        logger.info("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (error) => {
        logger.error("MongoDB connection error:", error);
    })

    mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB connection disconnected");
    })

    console.log("Database connection established");

    process.on("SIGINT", async() => {
        await mongoose.connection.close();
        logger.info("Mongo DB connection closed due to app termination");
        process.exit(0); // Exit with success code
    })
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit with failure code
  }
}