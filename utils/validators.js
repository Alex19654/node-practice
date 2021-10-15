const {body} = require('express-validator');

exports.registerValidators = [
   body('email', 'Enter correct email').isEmail(),
   body('password', 'Password is wrong').isLength({min: 6, max: 56}).isAlphanumeric(),
   body('confirm').custom((value, {req}) => {
      if(value !== req.body.password) {
         throw new Error('Passwords should be the same')
      }
      return true;
   }),
   body('name', 'Name length should be more than 3 symbols').isLength({min: 3})
]