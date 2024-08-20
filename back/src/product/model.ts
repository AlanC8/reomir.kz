import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    photo: [{ type: String, required: true }],
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
