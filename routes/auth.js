const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const {validationResult} = require('express-validator');
const bcrypt = require("bcryptjs");
const mailgun = require("mailgun-js");
const keys = require("../keys/index");
const registration = require("../emails/registration");
const crypto = require("crypto");
const {registerValidators} = require('../utils/validators');
const resetEmail = require("../emails/reset");

const mgInstance = mailgun({apiKey: keys.API_KEY_MG, domain: keys.DOMAIN}); // mailgun setting instance

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Authorization",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const theSame = await bcrypt.compare(password, candidate.password);

      if (theSame) {
        const user = await User.findById("60fbf60a3d7fe52a9e9316c0");
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Wrong password");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "Such user is not registrated");
      res.redirect("/auth/login#login");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hashPassword,
        cart: { items: [] },
      });
      await user.save();
      res.redirect("/auth/login#login");
      await mgInstance.messages().send(registration(user.email));
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.get("/reset", (req, res) => {
  res.render("auth/reset", {
    title: "Forgot password",
    error: req.flash("error"),
  });
});

router.get("/password/:token", async (req, res) => {
  if (!req.params.token) {
    return res.redirect("/auth/login");
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect("/auth/login");
    } else {
      res.render("auth/password", {
        title: "Change password",
        error: req.flash("error"),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Something is wrong, try again later.");
        return res.redirect("/auth/reset");
      }

      const token = buffer.toString("hex");

      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await mgInstance.messages().send(resetEmail(candidate.email, token));
        res.redirect("/auth/login");
      } else {
        req.flash("error", "There is not such email.");
        return res.redirect("/auth/reset");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/password", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect("/auth/login");
    } else {
      req.flash("loginError", "Token lifetime is ended");
      res.redirect("/auth/login");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
