// import mongoose, { Schema, Document, Model } from "mongoose";

// interface ITruck extends Document {
//   name: string;
//   length: number;
//   breadth: number;
//   height: number;
//   wt_capacity: number;
// }

// const TruckSchema = new Schema<ITruck>(
//   {
//     name: { type: String, required: true },
//     length: { type: Number, required: true },
//     breadth: { type: Number, required: true },
//     height: { type: Number, required: true },
//     wt_capacity: { type: Number, required: true },
//   },
//   { timestamps: true }
// );


// const Truck: Model<ITruck> =
//   mongoose.models.Truck || mongoose.model<ITruck>("Truck", TruckSchema);


// export {Truck};

