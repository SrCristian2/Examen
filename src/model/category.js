import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "el campo name es obligatorio"],
  },

  description: {
    type: String,
    required: [true, "el campo name es obligatorio"],
  },
  imgUrl: {
    type: String,
    default: null,
  },
  public_id: {
    type: String,
  },

});
categorySchema.methods.setImg = function setImg({ secure_url, public_id }) {
  this.imgUrl = secure_url;
  this.public_id = public_id;
};

export const categoryModel = model("category", categorySchema);
