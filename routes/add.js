const { Router } = require("express");
const router = Router();
const Product = require("../models/product");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  res.render("add", {
    title: "Add product",
    isAdd: true,
  });
});

router.post("/", auth, async (req, res) => {
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
