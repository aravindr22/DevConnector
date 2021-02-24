const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route       GET api/profile/me
// @desv        Get current user profile
// @access      Private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id}).populate('user',
        ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({
                msg: 'There is no profile for this user'
            });
        }

        res.json(profile);

    } catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route       POST api/profile/
// @desv        Create or Update user profile
// @access      Private
router.post('/', [
    auth, [
        check('status', 'Status is required')
            .not()
            .isEmpty(),
        check('skills', "Skills is required")
            .not()
            .isEmpty()
        ]
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }  

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            twitter,
            facebook,
            instagram,
            linkedin
        } = req.body;

        //Build Profile object
        const profileFiedls = {};
        profileFiedls.user = req.user.id;
        if(company) profileFiedls.company = company;
        if(website) profileFiedls.website = website;
        if(location) profileFiedls.location = location;
        if(bio) profileFiedls.bio = bio;
        if(status) profileFiedls.status = status;
        if(githubusername) profileFiedls.githubusername = githubusername;
        if(skills){
            profileFiedls.skills = skills.split(',').map(skill => skill.trim());
        }

        //Build Social Object
        profileFiedls.social = {}
        if(youtube) profileFiedls.social.youtube = youtube;
        if(twitter) profileFiedls.social.twitter = twitter;
        if(facebook) profileFiedls.social.facebook = facebook;
        if(linkedin) profileFiedls.social.linkedin = linkedin;
        if(instagram) profileFiedls.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile){
                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id}, 
                    { $set: profileFiedls},
                    { new: true}
                );

                return res.json(profile);
            }

            //create
            profile = new Profile(profileFiedls);
            await profile.save();

            res.json(profile);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route       GET api/profile/
// @desv        Get all profiles
// @access      Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name','avatar']);
        res.json(profiles)
    } catch (error) {
        console.error(error)
        res.status(500).send({
            msg: error.message
        });
    }
});

// @route       GET api/profile/user/:user_id
// @desv        Get profiles by user ID
// @access      Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name','avatar']);
        
        if(!profile){
            return res.status(400).json({ msg: "Profile not Found" });
        }

        res.json(profile)
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(400).json({ msg: "Profile not Found" });
        }
        res.status(500).send({
            msg: error.message
        });
    }
});

module.exports = router;