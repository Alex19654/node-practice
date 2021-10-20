const { Router } = require("express");
const router = Router();
const Product = require("../models/product");
const auth = require("../middleware/auth");
const { productValidators} = require("../utils/validators");

router.get("/", async (req, res) => {

  try {
    const products = await Product.find().populate("uerId", "email name");
    res.render("products", {
      title: "Products",
      isProducts: true,
      userId: req.user ? req.user._id.toString() : null,
      products,
    });
  } catch(e) {
    console.log(e);
  }
  
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  try{
    const product = await Product.findById(req.params.id);
    
    if(product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/products');
    }
    
    res.render("product-edit", {
      title: `Edit ${product.title}`,
      product,
    });
  } catch(e) {

  }

  
});

router.post("/edit", auth, productValidators, async (req, res) => {
  try{
    const errors = validationResult(req);
    const {id} = req.body;
    
    if(!errors.isEmpty()) {
      return res.status(422).render(`/products/${id}/edit?allow=true`);
    }
    delete req.body.id;
    const product = await Product.findById(id);
    if(product.userId.toString() === req.user._id.toString()) {
      return res.redirect('/products');
    }
    Object.assign(product, req.body);
    await product.save();
    //await Product.findByIdAndUpdate(id, req.body);
    res.redirect("/products");
  } catch(e) {
    console.log(e);
  }
  
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Product.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    });
    res.redirect("/products");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("product", {
      layout: "empty",
      title: `Product ${product.title}`,
      product,
    });
  } catch(e) {
    console.log(e);
  }
  
});

module.exports = router;
