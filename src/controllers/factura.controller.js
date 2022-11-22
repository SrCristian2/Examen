import { response } from "../helpers/response.js";
import { facturaModel } from "../model/factura.js";
import { productModel } from "../model/product.js";

const facturaCtrl = {};

facturaCtrl.listarFactura = async (req, res) => {
  try {
    const facturas = await facturaModel
      .find()
      .populate("product", { user: 0, public_id: 0 })
      .populate("user", { email: 1, name: 1 });
    response(res, 200, true, facturas, "lista de facturas");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

facturaCtrl.listarFacturaById = async (req, res) => {
  try {
    const { id } = req.params;

    const factura = await facturaModel
      .findById(id)
      .populate("product")
      .populate("user", { email: 1, name: 1 });
    if (!factura) {
      return response(res, 404, false, "", "factura no encontrada");
    }
    response(res, 200, true, factura, "factura encontrada");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

facturaCtrl.guardarFactura = async (req, res) => {
  try {
    const { quantity, product } = req.body;
    const newFactura = new facturaModel({
      quantity,
      product: req.body.product,
      user: req.userId,
    });

    const producto = await productModel.findOne({ product });

    const setTotal = producto.price * quantity;
    const stock = producto.stock;

    if (quantity > producto.stock) {
      return response(
        res,
        409,
        false,
        "",
        `la cantidad solicitada no se encuentra disponible en este momento,el stock disponible es de : ${stock} `
      );
    }
    const factura = { ...newFactura._doc, total: setTotal };
    await facturaModel.create(factura);
    response(res, 201, true, factura, "factura creada");
    const restaStock = stock - quantity;

    await productModel.updateOne({ stock: restaStock });
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

facturaCtrl.deleteFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await facturaModel.findById(id);
    const product = await productModel.findOne({ product: id });

    const stock = product.stock;

    if (!factura) {
      return response(res, 404, false, "", "factura no encontrada");
    }

    await facturaModel.deleteOne();
    response(res, 200, true, "", "factura eliminada");

    const restaurarStock = stock + factura.quantity;
    await productModel.updateOne({ stock: restaurarStock });
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

facturaCtrl.updateFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await facturaModel.findById(id);
    const product = await productModel.findOne({ product: id });
    const total=factura.total
    const stock = product.stock;
    const price = product.price;
    const quantity = factura.quantity;

    if (!factura) {
      return response(res, 404, false, "", "factura no encontrado");
    }
    if (factura.quantity > stock) {
      return response(
        res,
        409,
        false,
        "",
        `la cantidad solicitada no se encuentra disponible en este momento,el stock disponible es de : ${stock} `
      );
    }

    const setQuantity = req.body.quantity * 2;
    const Total2 = price * quantity;
    const setTotal = total+Total2

    await facturaModel
      .updateOne({
        ...req.body,
        user: req.userId,
        total:setTotal,
        quantity: setQuantity,
      })
      .populate("user", { email: 1, name: 1 });
    response(res, 200, true, "", "factura actualizada");

    const restarStock = stock - factura.quantity;

    await productModel.updateOne({ stock: restarStock });
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default facturaCtrl;
