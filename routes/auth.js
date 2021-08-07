const {Router} = require("express");
const router = Router();
const User = require("../models/user");

router.get("/login", async (req, res) => {
   res.render("auth/login", {
      title: "Authorization",
      isLogin: true
   })
})

router.post("/login", async (req,res) => {
   const user = await User.findById("60fbf60a3d7fe52a9e9316c0");
   req.session.user = user;
   req.session.isAuthenticated = true;
   req.session.save((err) => {
      if(err) {
         throw err;
      }
      res.redirect("/");
   });
})

router.get("/logout", async (req, res) => {
   req.session.destroy(() => {
      res.redirect("/auth/login#login");
   })
})

module.exports = router;