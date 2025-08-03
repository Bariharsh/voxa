import mongoose, { Schema,Document } from "mongoose";

interface Chat extends Document {
    sender: string,
    text: string,
    timestamp: Date
}

const chatSchema:Schema<Chat> = new Schema({
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
      type: Date,
      default: Date.now,
    },
},{timestamps: true});

const ChatModel = (mongoose.models.Chat as mongoose.Model<Chat>)|| mongoose.model<Chat>("Chat",chatSchema);

export default ChatModel
