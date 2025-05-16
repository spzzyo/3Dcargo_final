// // Importing mongoose library along with Document and Model types from it
// import mongoose, { Schema, Document, Model } from "mongoose";
// import { ITruck } from "./Truck";
// import { ICargoBox } from "./CargoBox";

// export interface IUserData {
//   threadID: string;
//   trucks: mongoose.Types.ObjectId[]; // References to Truck documents
//   cargoBoxes: mongoose.Types.ObjectId[];

// }

// export interface IUserDataDocument extends IUserData, Document {
//   createdAt: Date;
//   updatedAt: Date;
// }


// const UserDataSchema = new mongoose.Schema<IUserDataDocument>(
//   {
//     threadID: {
//       type: String,
//       required: true,
//     },
//     trucks: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Truck", // Reference to the Truck model
//       },
//     ],
//     cargoBoxes: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "CargoBox", // Reference to the CargoBox model
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );
// const UserData: Model<IUserDataDocument> =
//   mongoose.models?.UserData || mongoose.model("UserData", UserDataSchema);

// export default UserData;