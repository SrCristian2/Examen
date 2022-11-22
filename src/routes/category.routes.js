import { Router } from "express";
import { body } from "express-validator";
import categoryCtrl from "../controllers/category.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/imgUpload.js";
import { validFields } from "../middlewares/validFields.js";

const route = Router();

route.get("/", categoryCtrl.listarCategorias);

route.get("/:id", categoryCtrl.listarCateById);

route.post(
  "/",
  verifyToken,
  [
    body("name", "el campo name es obligatorio").optional({
      checkFalsy: false,
    }),
    body("description", "el campo description es obligatorio").optional({
      checkFalsy: false,
    }),
    body("imgUrl").optional(),
  ],
  validFields,
  upload.single("img"),
  categoryCtrl.guardarCategoria
);

route.delete("/:id", verifyToken, categoryCtrl.deleteCategoria);

route.put(
  "/:id",
  verifyToken,
  upload.single("img"),
  categoryCtrl.actualizarCategoria
);

export default route;
