const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');

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
    ], async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {name, email, password} = req.body;

        try {
            //See if user exits
            let user = await User.findOne({ email });

            if(user){
                return res.status(400).json({
                    errors: [{
                        msg: "User Already Exists"
                    }]
                });
            }

            //Get users Gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'identicon' 
                
            });

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //Encrypt Password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            
            await user.save();

            //Return JWT
            res.send('User Registerd');
        } catch(err){
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;