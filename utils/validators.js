const {body} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
   body('email', 'Enter correct email').isEmail()
   .custom( async (value, {req}) => {
      try {
         const user = await User.findOne({ email: value });
         if(user) {
            return Promise.reject('Such email exists in DB')
         }
      } catch(e) {
         console.log(e);
      }
   })
   .normalizeEmail(),
   body('password', 'Password is wrong').isLength({min: 6, max: 56})
   .isAlphanumeric()
   .trim(),
   body('confirm').custom((value, {req}) => {
      if(value !== req.body.password) {
         throw new Error('Passwords should be the same')
      }
      return true;
   })
   .trim(),
   body('name', 'Name length should be more than 3 symbols').isLength({min: 3}).trim()
];

exports.loginValidators = [];

exports.productValidators = [
   body('title', 'Min length is 3 symbols').isLength({min: 3}).trim(),
   body('price', 'Enter correct price').isNumeric(),
   body('img', 'Enter correct url of image').isURL()
]