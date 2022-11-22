import { Router } from "express";
import { check } from "express-validator";

import userCtrl from "../controllers/user.controller.js";
import { validFields } from "../middlewares/validFields.js";

const route = Router();

route.post(
  "/register",
  [
    check("name", "el campo name es obligatorio").notEmpty(),
    check("lastname", "el campo lastname es obligatorio").notEmpty(),
    check("email", "el campo email es obligatorio").notEmpty(),
    check("password", "el campo password es obligatorio").notEmpty(),
  ],
  validFields,
  userCtrl.register
);
route.post("/login", userCtrl.login);

export default route;
