import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Failed To Connect MongoDB");
    console.error(error.message); // 🔥 VERY IMPORTANT
    process.exit(1);
  }
};

export default connectdb;