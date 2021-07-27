const { Router } = require("express");
const router = Router();
const Product = require("../models/product");

/* Helper function for mapping cart items */
function mapCartItems(cart) {
  return cart.items.map((prd) => ({
    ...prd.productId._doc,
    count: prd.count,
  }));
}

/* Helper function for computing the price */
function computePrice(products) {
  return products.reduce((total, product) => {
    return (total += product.price * product.count);
  }, 0);
}

router.post("/add", async (req, res) => {
  const product = await Product.findById(req.body.id);
  await req.user.addToCard(product);
  res.redirect("/card");
});

router.delete("/remove/:id", async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.productId").execPopulate();
  const products = mapCartItems(user.cart);
  const cart = {
    products,
    price: computePrice(products),
  };
  res.status(200).json(card);
});

router.get("/", async (req, res) => {
  const user = await req.user.populate("cart.items.productId").execPopulate();

  const products = mapCartItems(user.cart);

  res.render("card", {
    title: "Basket",
    isCard: true,
    products: products,
    price: computePrice(products),
  });
});

module.exports = router;
