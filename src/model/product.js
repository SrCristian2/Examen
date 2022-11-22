import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "el campo name es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "el campo description es obligatorio"],
  },
  rate: {
    type: Number,
    min:0,
    max:5,
    required: [true, "el campo rate es obligatorio"],
  },
  imgUrl: {
    type: String,
    default: null,
  },
  public_id: {
    type: String,
  },
    
  price: {
    type: Number,
    required: [true, "el campo price es obligatorio"],
  },
  stock: {
    type: Number,
    required: [true, "el campo stock es obligatorio"],
  },
  category:{
    type:Schema.Types.ObjectId,
    ref:"category"
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:"user"
  }
});

productSchema.methods.setImg = function setImg({ secure_url, public_id }) {
  this.imgUrl = secure_url;
  this.public_id = public_id;
};

export const productModel = model("product", productSchema);
