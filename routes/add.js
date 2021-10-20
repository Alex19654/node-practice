const { Router } = require("express");
const router = Router();
const {validationResult} = require('express-validator');
const Product = require("../models/product");
const auth = require("../middleware/auth");
const { productValidators } = require("../utils/validators");

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "Add product",
    isAdd: true,
  });
});

router.post("/", auth, productValidators, async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: "Add product",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
      }
    })
  }

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    image: req.body.image,
    userId: req.session.user,
  });

  try {
    await product.save();
    res.redirect("/products");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
