// import mongoose, { Schema, Model, Document } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// type MessageRole = 'user' | 'assistant';

// interface IMessage extends Document {
//   id: string;
//   role: MessageRole;
//   content: string;
//   timestamp: Date;
//   msg_function: string;
// }

// const MessageSchema = new Schema<IMessage>({
//   id: { type: String, default: uuidv4 },
//   role: { type: String, enum: ['user', 'assistant'], required: true },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
//   msg_function: { type: String, required: true },
// });

// interface IChatThread extends Document {
//   my_id: string;
//   name: string,
//   messages: IMessage[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ChatThreadSchema = new Schema<IChatThread>({
//   my_id: { type: String, default: uuidv4 },
//   name: {type: String, default: ""},
//   messages: { type: [MessageSchema], default: [] },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });


// const ChatThread: Model<IChatThread> =
//   mongoose.models.ChatThread || mongoose.model<IChatThread>("ChatThread", ChatThreadSchema);


// export {ChatThread};
// export  type  {IMessage, IChatThread};