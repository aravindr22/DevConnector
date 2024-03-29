const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const { check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

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

// @route       DELETE api/profile
// @desv        Delete profile, user & posts
// @access      Private
router.delete('/', auth, async (req, res) => {
    try {
        //remove users posts
        await Post.deleteMany({user: req.user.id})
        //Remove Profile
        await Profile.findOneAndRemove({user: req.user.id});
        //Remove User
        await User.findOneAndRemove({_id: req.user.id});
        res.json({
            msg: 'User Deleted'
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            msg: error.message
        });
    }
});

// @route       PUT api/profile/experience
// @desv        Add profile experience
// @access      Private
router.put('/experience', [auth, [
    check('title', "Title is required")
        .not()
        .isEmpty(),
    check('company', "Company is required")
        .not()
        .isEmpty(),
    check('from', "From date is required")
        .not()
        .isEmpty()
        
] ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newWxep = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newWxep);
        await profile.save();

        res.send(profile);
    } catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});

// @route       DELETE api/profile/experience/:exp_id
// @desv        Remove profile experience
// @access      Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get Remove Index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        
        profile.experience.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);

    } catch(errors) {
        console.error(errors.message);
        res.status(500).send('Server Error');
    }
});

// @route       PUT api/profile/education
// @desv        Add profile education
// @access      Private
router.put('/education', [auth, [
    check('school', "School is required")
        .not()
        .isEmpty(),
    check('degree', "Degree is required")
        .not()
        .isEmpty(),
    check('from', "From date is required")
        .not()
        .isEmpty(),
    check('fieldofstudy', "Field of Study is required")
        .not()
        .isEmpty()
        
] ], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(newEdu);
        await profile.save();

        res.send(profile);
    } catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});

// @route       DELETE api/profile/education/:edu_id
// @desv        Remove profile education
// @access      Private
router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get Remove Index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        
        profile.education.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);

    } catch(errors) {
        console.error(errors.message);
        res.status(500).send('Server Error');
    }
});

// @route       GET api/profile/github/:username
// @desv        Get User repos from github
// @access      Public
router.get("/github/:username", (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&
            client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        };

        request(options, (err, response, body) => {
            if(err) console.error(error);

            if(response.statusCode !== 200){
                return res.status(404).json({
                    msg: "No Github profile Found"
                });
            }

            res.json(JSON.parse(body));
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;