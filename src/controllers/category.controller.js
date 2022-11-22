import {
  eliminarImagenCloudinary,
  subirImagenACloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/response.js";
import { categoryModel } from "../model/category.js";
import { productModel } from "../model/product.js";

const categoryCtrl = {};

categoryCtrl.listarCategorias = async (req, res) => {
  try {
    const categorias = await categoryModel.find();

    response(res, 200, true, categorias, "lista de categorias");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.listarCateById = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await categoryModel.findById(id);
    if (!categoria) {
      return response(res, 404, false, "", "categoria no encontrado");
    }
    response(res, 200, true, categoria, "categoria encontrada");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.guardarCategoria = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategoria = new categoryModel({
      name,
      description,
      user: req.userId,
      category: req._id,
    });

    if (req.file) {
      const { secure_url, public_id } = await subirImagenACloudinary(req.file);
      newCategoria.setImg({ secure_url, public_id });
    }

    await categoryModel.create(newCategoria);

    response(res, 201, true, newCategoria, "categoria creada");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoryModel.findById(id);
    const products = await productModel.findOne({ products: id });

    if (products) {
      return response(
        res,
        409,
        false,
        "",
        "la categoria no pudo ser eliminada ya que tiene productos asociados"
      );
    }

    if (!categoria) {
      return response(res, 404, false, "", "categoria no encontrado");
    }
    if (categoria.public_id) {
      await eliminarImagenCloudinary(categoria.public_id);
    }

    await categoryModel.deleteOne();

    response(res, 200, true, "", "categoria eliminada");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoryModel.findById(id);
    if (!categoria) {
      return response(res, 404, false, "", "categoria no encontrado");
    }
    if (req.file) {
      if (categoria.public_id) {
        await eliminarImagenCloudinary(categoria.public_id);
      }
      const { secure_url, public_id } = await subirImagenACloudinary(req.file);
      categoria.setImg({ secure_url, public_id });
      await categoria.save();
    }

    await categoryModel.updateOne(req.body);
    response(res, 200, true, "", "categoria actualizada");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default categoryCtrl;
