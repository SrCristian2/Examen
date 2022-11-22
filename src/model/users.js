import mongoose from "mongoose";

import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "el campo name es obligatorio"],
    },

    lastname: {
      type: String,
      required: [true, "el campo lastname es obligatorio"],
    },

    email: {
      type: String,
      required: [true, "el campo email es obligatorio"],
    },
    
    password: {
      type: String,
      required: [true, "el campo password es obligatorio"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export const userModel = model("user", userSchema);
