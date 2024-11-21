const User = require("../models/user.model.js");
const md5 = require("md5");

module.exports.register = async (req, res) => {

    req.body.password = md5(req.body.password);
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(existEmail) { 
        res.json({
            code: 400,
            message: "Email already exist"
        });
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        });

        user.save();

        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Register an account successfully",
            token: token
        })
    }
}

