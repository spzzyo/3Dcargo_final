// import mongoose, { Connection } from "mongoose";

// // Declaring a variable to store the cached database connection
// let cachedConnection: Connection | null = null;

// // Function to establish a connection to MongoDB
// export async function connectToMongoDB() {
//   // If a cached connection exists, return it
//   if (cachedConnection) {
//     console.log("Using cached db connection");
//     return cachedConnection;
//   }
//   try {
//     const cnx = await mongoose.connect("mongodb+srv://dbUser:ov438XlM0LphCHtx@cluster0.uxyna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"!);
//     cachedConnection = cnx.connection;
//     console.log("New mongodb connection established");
//     return cachedConnection;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }