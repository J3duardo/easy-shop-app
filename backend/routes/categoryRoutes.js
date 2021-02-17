const express = require("express");
const {check, validationResult} = require("express-validator");
const Category = require("../models/categoryModel");
const router = express.Router();

/*------------------------------------------*/
// Consultar todas las categorías existentes
/*------------------------------------------*/
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      status: "success",
      data: categories
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
});

/*---------------------------------*/
// Consultar una categoría por su id
/*---------------------------------*/
router.get("/:categoryId", async (req, res) => {
  try {
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);

    if(!category) {
      return res.status(404).json({
        status: "failed",
        msg: "Category not found or deleted"
      })
    }

    res.json({
      status: "success",
      data: category
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
})


/*-----------------*/
// Crear categorias
/*-----------------*/
router.post("/", [
  check("name", "The nameof the category is required").not().isEmpty(),
  check("name", "The name of the category must be between 4 and 50 characters").isLength({min: 4, max: 50})
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
    const {name, icon, color}= req.body;
    const category = new Category({name, icon, color});

    await category.save();

    res.json({
      status: "success",
      data: category
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
});


/*-------------------*/
// Eliminar categorías
/*-------------------*/
router.delete("/:categoryId", async (req, res) => {
  try {
    const {categoryId} = req.params;
    const category = await Category.findByIdAndDelete(categoryId);

    if(!category) {
      return res.status(404).json({
        status: "failed",
        msg: "Category not found or deleted"
      })
    }

    res.json({
      status: "success",
      data: category
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
});


/*-------------------------------*/
// Editar (actualizar) categorías
/*-------------------------------*/
router.patch("/:categoryId", async (req, res) => {
  try {
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);

    if(!category) {
      return res.status(404).json({
        status: "failed",
        msg: "Category not found or deleted"
      })
    }

    for(let key in req.body) {
      categoryId[key] = req.body[key]
    }

    await category.save();

    res.json({
      status: "success",
      data: category
    })
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
});

module.exports = router;