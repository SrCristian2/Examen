import { Router } from "express";
import { body } from "express-validator";
import productCtrl from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/imgUpload.js";
import { validFields } from "../middlewares/validFields.js";

const route = Router();

route.get("/", productCtrl.listarProducts);
route.get("/:id", productCtrl.listarProductoById);
route.post(
  "/",
  verifyToken,
  body("name", "el campo name es obligatorio").optional({
    checkFalsy: true,
  }),

  body("rate", "el campo rate es obligatorio").optional({
    checkFalsy: true,
  }),

  body("imgUrl").optional(),

  body("price", "el campo price es obligatorio").optional({
    checkFalsy: true,
  }),

  body("stock", "el campo stock es obligatorio").optional({
    checkFalsy: true,
  }),

  body("category", "el campo category es obligatorio").optional({
    checkFalsy: true,
  }),
  
  body("user", "el campo user es obligatorio").optional({
    checkFalsy: true,
  }),
validFields,
  upload.single("img"),
  productCtrl.guardarProducto
);
route.delete("/:id", verifyToken, productCtrl.deleteProduct);
route.put("/:id", verifyToken, upload.single("img"), productCtrl.updateProduct);

export default route;
