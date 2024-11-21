const User = require("../models/user.model.js");
const md5 = require("md5");

module.exports.register = async (req, res) => {

    req.body.password = md5(req.body.password);
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
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

module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        return res.json({
            code: 400,
            message: "Email is not exist"
        });
    }

    if (md5(password) !== user.password) {
        return res.json({
            code: 400,
            message: "Password is incorrect"
        })
    }

    const token = user.token;
    res.cookie("token", token);

    return res.json({
        code: 200,
        message: "Login successfully",
        token: token
    });
}