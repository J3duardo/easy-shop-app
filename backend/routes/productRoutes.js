const express = require("express");
const {check, validationResult} = require("express-validator");
const multer = require("multer");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const checkUserRole = require("../middlewares/checkRole");
const router = express.Router();

/*------------------------*/
// Configuración de multer
/*------------------------*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = null;
    const fileTypeCheck = file.mimetype.includes("jpg") || file.mimetype.includes("jpeg") || file.mimetype.includes("png");

    if(!fileTypeCheck) {
      error = "Invalid file type. File must be an image either .jpg or .jpeg or .png"
    }

    cb(error, "public/uploads");
  },
  filename: (req, file, cb) => {
    // Eliminar la extensión del nombre original
    const filenameArr = file.originalname.split(".");
    filenameArr.splice(filenameArr.length - 1, 1);
    // Reemplazar los espacios del nombre del archivo por guiones
    const filename = filenameArr[0].split(" ").join("-").toLowerCase();
    // Extraer la extensión del archivo
    const extension = file.mimetype.split("/")[1];
    cb(null, `${filename}-${Date.now()}.${extension}`)
  }
});

const upload = multer({storage});

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
router.post("/", checkUserRole, upload.single("image"), [
  check("name", "Product name is required").not().isEmpty(),
  check("name", "Product name must be between 4 and 50 caracters").isLength({min: 4, max: 50}),
  check("category", "Product category not found").isMongoId(),
  check("countInStock", "You must specify the quantity in the stock for the product").not().isEmpty(),
  check("countInStock", "The maximum quantity is 255").isInt({max: 255})
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const message = errors.array({onlyFirstError: true})
    return res.status(400).json({
      status: "failed",
      msg: message[0].msg
    })
  }

  try {
    if(!req.file) {
      return res.status(400).json({
        status: "failed",
        msg: "The product image is required"
      })
    }

    const filename = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/upload`

    const {name, description, richDescription, images, brand, price, category, countInStock, rating, numReviews, isFeatured} = req.body;

    const checkCategory = await Category.findById(category);

    if(!checkCategory) {
      return res.status(404).json({
        status: "failed",
        msg: "Product category not found or deleted"
      })
    }

    const product = new Product({
      name, description, richDescription, image: `${basePath}/${filename}`, images, brand, price, category, countInStock, rating, numReviews, isFeatured
    });

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


/*------------------*/
// Eliminar productos
/*------------------*/
router.delete("/:productId", checkUserRole, async (req, res) => {
  try {
    const {productId} = req.params;
    const product = await Category.findByIdAndDelete(productId);

    if(!product) {
      return res.status(404).json({
        status: "failed",
        msg: "Product not found or already deleted"
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
router.patch("/product-gallery/:productId", checkUserRole, upload.array("images", 10), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if(!product) {
      return res.status(404).json({status: "failed", msg: "Product not found or deleted"})
    }

    const imagePaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;

    req.files.forEach(file => {
      imagePaths.push(`${basePath}/${file.filename}`)
    });

    product.images = imagePaths;
    await product.save();

    res.json({
      status: "success",
      msg: `Product "${product.name}" images uploaded successfully`,
      data: product
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
})


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