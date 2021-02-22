const express = require("express");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const checkUserRole = require("../middlewares/checkRole");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/*----------------------------------------*/
// Consultar todos los productos existentes
/*----------------------------------------*/
router.get("/", async (req, res) => {
  try {
    const {category} = req.query;
    let filter = {};

    if(category) {
      filter = {category}
    }

    const products = await Product.find(filter).sort({createdAt: -1}).populate("category");

    res.json({
      status: "success",
      data: products
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
});


/*--------------------------------*/
// Consultar un producto por su id
/*--------------------------------*/
router.get("/details/:productId", async (req, res) => {
  try {
    const {productId} = req.params;
    const product = await Product.findById(productId).populate("category");

    if(!product) {
      return res.status(404).json({
        status: "failed",
        msg: "Product not found or deleted"
      })
    }

    res.json({
      status: "success",
      data: product
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
});


/*----------------*/
// Crear productos
/*----------------*/
router.post("/", checkUserRole, (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (error, fields, files) => {
    if(error) {
      return res.status(400).json({
        status: "failed",
        msg: "Error processing the product data. Please, try again."
      })
    }

    if(!files.image) {
      return res.status(400).json({
        status: "failed",
        msg: "The product image is required."
      })
    }

    if(!files.image.type.includes("jpg") && !files.image.type.includes("jpeg") && !files.image.type.includes("png")) {
      return res.status(400).json({
        status: "failed",
        msg: "The image must be .jpg, .jpeg or .png."
      })
    }

    if(files.image.size > 2000000) {
      return res.status(400).json({
        status: "failed",
        msg: "Image size cannot be larger than 2mb"
      })
    }

    try {
      const {name, description, richDescription, brand, price, category, countInStock, rating, numReviews, isFeatured} = fields;

      // Validar la data requerida del formulario
      const fieldsValidator = () => {
        if(!name) {
          return {
            isValid: false,
            msg: "Product name is required"
          }
        }

        if(name.length < 4 || name.length > 50) {
          return {
            isValid: false,
            msg: "Product name must be between 4 and 50 caracters"
          }
        }

        if(!countInStock) {
          return {
            isValid: false,
            msg: "You must specify the quantity in the stock for the product"
          }
        }

        if(countInStock > 255) {
          return {
            isValid: false,
            msg: "The maximum quantity is 255"
          }
        }

        return {
          isValid: true,
          msg: null
        }
      }

      if(!fieldsValidator().isValid) {
        return res.status(400).json({
          status: "failed",
          msg: fieldsValidator().msg
        })
      }
  
      // Chequear si la categoría especificada existe en la base de datos
      const checkCategory = await Category.findById(category);
  
      if(!checkCategory) {
        return res.status(404).json({
          status: "failed",
          msg: "Product category not found or deleted"
        })
      }

      // Generar una instancia del producto
      const product = new Product({
        name, description, richDescription, brand, price, category, countInStock, rating, numReviews, isFeatured
      });

      // Subir la imagen a Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(files.image.path, {folder: `easyshop/product-image/${brand}`});
      product.image = uploadResponse.url;
      product.imageId = uploadResponse.public_id;
  
      // Enviar el producto a la base de datos
      await product.save();
  
      res.json({
        status: "success",
        data: product
      })
      
    } catch (error) {
      res.status(500).json({
        status: "failed",
        msg: `Error: ${error.message}`,
        error
      })
    }
  })
});


/*------------------*/
// Eliminar productos
/*------------------*/
router.delete("/:productId", checkUserRole, async (req, res) => {
  try {
    const {productId} = req.params;
    const product = await Product.findById(productId);

    // Chequear si el producto existe en la base de  datos
    if(!product) {
      return res.status(404).json({
        status: "failed",
        msg: "Product not found or already deleted"
      })
    }

    // Eliminar el producto dela base de datos
    await product.delete();

    // Eliminar la imagen del producto de Cloudinary
    await cloudinary.uploader.destroy(product.imageId, {invalidate: true});

    res.json({
      status: "success",
      data: product
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`,
      error
    })
  }
});


/*-------------------------------*/
// Editar (actualizar) productos
/*-------------------------------*/
router.patch("/:productId", checkUserRole, async (req, res) => {
  try {
    const {category} = req.body;
    const checkCategory = await Category.findById(category);

    if(category && !checkCategory) {
      return res.status(404).json({
        status: "failed",
        msg: "Product category not found or deleted"
      })
    }

    const {productId} = req.params;
    const product = await Product.findById(productId);

    if(!product) {
      return res.status(404).json({
        status: "failed",
        msg: "Product not found or deleted"
      })
    }

    // Actualizar cada propiedad del producto con las propiedades presentes en el body del request
    for(let key in req.body) {
      product[key] = req.body[key]
    }

    // Guardar el producto actualizado
    await product.save();
    
    res.json({
      status: "success",
      data: product
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
});


/*------------------------------------------*/
// Subir la galería de imágenes del producto
/*------------------------------------------*/
// router.patch("/product-gallery/:productId", checkUserRole, upload.array("images", 10), async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId);

//     if(!product) {
//       return res.status(404).json({status: "failed", msg: "Product not found or deleted"})
//     }

//     const imagePaths = [];
//     const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

//     req.files.forEach(file => {
//       imagePaths.push(`${basePath}/${file.filename}`)
//     });

//     product.images = imagePaths;
//     await product.save();

//     res.json({
//       status: "success",
//       msg: `Product "${product.name}" images uploaded successfully`,
//       data: product
//     })
    
//   } catch (error) {
//     res.status(500).json({
//       status: "failed",
//       msg: `Error: ${error.message}`
//     })
//   }
// })


/*-----------------------------*/
// Consultar productos featured
/*-----------------------------*/
router.get("/featured", async (req, res) => {
  try {
    const {count} = req.query;

    let query = null;
    if(!count) {
      query = Product.find({isFeatured: true}).sort({createdAt: -1}).populate("category")
    } else {
      query = Product.find({isFeatured: true}).sort({createdAt: -1}).limit(+count).populate("category")
    }

    const featured = await query;

    res.json({
      status: "success",
      data: featured
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
})

module.exports = router;