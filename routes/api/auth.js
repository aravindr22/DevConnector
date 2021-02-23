const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @route       GET api/auth
// @desc        Auth route to verigy jwt
// @access      Public
router.get("/" , auth, async (req, res) => {
    try {   
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg: "Server error"
        });
    }
});

module.exports = router;