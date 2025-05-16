// import mongoose, { Schema, Model, Document } from 'mongoose';


// interface IMyTruck extends Document {
//   name: string;
//   timestamp: Date;
//   quantity: number;
//   length: number;
//   breadth: number;
//   height: number;
//   wt_capacity: number;
// }

// const TruckSchema = new Schema<IMyTruck>({
//   name: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
//   quantity: { type: Number, required: true },
//   length: { type: Number, required: true },
//     breadth: { type: Number, required: true },
//     height: { type: Number, required: true },
//     wt_capacity: { type: Number, required: true },
// });





// const MyTruck: Model<IMyTruck> =
//   mongoose.models.MyTruck || mongoose.model<IMyTruck>("MyTruck", TruckSchema);


// export {MyTruck};
// export  type  {IMyTruck};