import {
  eliminarImagenCloudinary,
  subirImagenACloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/response.js";
import { facturaModel } from "../model/factura.js";
import { productModel } from "../model/product.js";

const productCtrl = {};

productCtrl.listarProducts = async (req, res) => {
  try {
    const productos = await productModel
      .find()
      .populate("user", { email: 1, name: 1 })
      .populate("category",{public_id:0})
      .sort("-createdAt");

    response(res, 200, true, productos, "lista de productos");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

productCtrl.listarProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productModel
      .findById(id)
      .populate("user", { email: 1, name: 1 })
      .populate("category", { public_id: 0 });

    if (!producto) {
      return response(res, 404, false, "", "producto no encontrado");
    }

    response(res, 200, true, producto, "producto encontrado");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

productCtrl.guardarProducto = async (req, res) => {
  try {
    const { name, description, rate, stock, price } = req.body;
    const newProduct = new productModel({
      name,
      description,
      rate,
      category: req.body._id,
      user: req.userId,
      stock,
      price,
    });
    if (req.file) {
      const { secure_url, public_id } = await subirImagenACloudinary(req.file);
      newProduct.setImg({ secure_url, public_id });
    }
    await productModel.create(newProduct);

    response(res, 201, true, newProduct, "producto creado");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

productCtrl.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productModel.findById(id);
    const factura = await facturaModel.findOne({ factura: id });

    if (factura) {
      return response(
        res,
        409,
        false,
        "",
        "el producto no pudo ser eliminado ya que tiene facturas asociadas"
      );
    }
    if (!producto) {
      return response(res, 404, false, "", "producto no encontrado");
    }
    if (producto.public_id) {
      await eliminarImagenCloudinary(producto.public_id);
    }
    await productModel.deleteOne();
    response(res, 200, true, "", "producto eliminado");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

productCtrl.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productModel.findById(id);

    if (!producto) {
      return response(res, 404, false, "", "producto no encontrado");
    }
    if (req.file) {
      if (producto.public_id) {
        await eliminarImagenCloudinary(producto.public_id);
      }
      const { secure_url, public_id } = await subirImagenACloudinary(req.file);
      producto.setImg({ secure_url, public_id });
      await producto.save();
    }

    await productModel.updateOne(req.body);
    response(res, 200, true, "", "producto actualizada");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default productCtrl;
