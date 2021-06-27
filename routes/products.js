const { Router } = require("express");
const router = Router();
const Product = require("../models/product");

router.get("/", async (req, res) => {
  const products = await Product.getAll();
  console.log(products);
  res.render("products", {
    title: "Products",
    isProducts: true,
    products,
  });
});

module.exports = router;
