import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import facturaRoutes from "./routes/factura.routes.js";

import { connectDb } from "./database.js";
connectDb();

const app = express();

app.set("Port", process.env.PORT);
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/factura", facturaRoutes);

app.listen(app.get("Port"), () => {
  console.log("servidor escuchando por el puerto", app.get("Port"));
});
