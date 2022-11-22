import { Router } from "express";
import { check } from "express-validator";

import facturaCtrl from "../controllers/factura.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { validFields } from "../middlewares/validFields.js";

const route = Router();

route.get("/", facturaCtrl.listarFactura);
route.get("/:id", facturaCtrl.listarFacturaById);
route.post(
  "/",
  verifyToken,
  [
    check("product", "el campo product es obligatorio").notEmpty(),
    check("quantity", "el campo quantity es obligatorio")
      .notEmpty()
      .isNumeric(),
    check("user", "el campo user es obligatorio").notEmpty(),
  ],
  validFields,
  facturaCtrl.guardarFactura
);
route.delete("/:id", verifyToken, facturaCtrl.deleteFactura);
route.put("/:id", verifyToken, facturaCtrl.updateFactura);

export default route;
