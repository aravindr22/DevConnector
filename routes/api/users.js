const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

// @route       POST api/users
// @desc        Register User
// @access      Public
router.post("/" , [
    check('name', 'Name is Required')
        .not()
        .isEmpty(),
    check('email', 'Please include valid email')
        .isEmail(),
    check('password', 'Please enter a password with minmum 6 or more characters')
        .isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }
    res.send('asd')
});

module.exports = router;