import mongoose, {Schema, Document} from "mongoose";


export interface Message extends Document {
    content: string
    createdAt: Date, 
}

const MessageSchema : Schema<Message> = new Schema({
        content : {
            type : String, 
            required: true
        },
        createdAt : {
            type: Date,
            required: true,
            default: Date.now
        }
})


export interface User extends Document {
    username: String,
    email: String,
    password: String,
    verifyCode: String,
    isVerified: boolean,
    verifyCodeExpiry: Date, 
    isAcceptingMessages: Boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyCode: { type: String, required: true },
    isVerified: { type: Boolean, required: true},
    verifyCodeExpiry: { type: Date, required: true },
    isAcceptingMessages: { type: Boolean, required: true, default: true },
    messages: { type: [MessageSchema], required: true, default: [] },
  });




const UserModel = (mongoose.models?.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema)
export default UserModel;
