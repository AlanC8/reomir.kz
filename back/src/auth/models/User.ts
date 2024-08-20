import mongoose, { Document, Schema, Model } from "mongoose";

// Define the IUser interface
export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  city: string;
  icon?: string;
  bonus?: number;
  products: mongoose.Schema.Types.ObjectId[]; // Массив ObjectId продуктов
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String },
    password: { type: String, required: true },
    city: { type: String },
    icon: { type: String, default: "https://art.pixilart.com/0433de3a9dca4b9.png"},
    bonus: { type: Number, default: 0 },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }] // Поле для продуктов
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
