const { Router } = require("express");
const router = Router();
const Product = require("../models/product");

router.get("/", (req, res) => {
  res.render("add", {
    title: "Add product",
    isAdd: true,
  });
});

router.post("/", async (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    image: req.body.image,
    userId: req.user,
  });

  try {
    await product.save();
    res.redirect("/products");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
