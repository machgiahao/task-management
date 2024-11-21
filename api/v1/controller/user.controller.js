const User = require("../models/user.model.js");
const ForgotPassword = require("../models/forgot-password.model.js")
const md5 = require("md5");
const generateHelper = require("../../../helpers/generate.js")
const mailHelper = require("../../../helpers/sendMails.helper.js")

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

module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

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

    const otp = generateHelper.generateRandomNumber(8);
    const timeExpire = 5;

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire * 60
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const from = process.env.MAIL_FROM_ADDRESS;
    await mailHelper.sendMail(from, email, "Your OTP code", `<p>Your OTP code is: <b>${otp}</b></p>`);

    return res.json({
        code: 200,
        message: "OTP has been send successfully !"
    });
}

module.exports.otpPassword = async (req, res) => {

    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        return res.json({
            code: 400,
            message: "OTP is not valid !",
        })
    }

    const user = await User.findOne({
        email: email
    })

    const token = user.token;
    res.cookie("token", token);

    return res.json({
        code: 200,
        message: "Authentication successfully",
        token: token
    })

}

module.exports.reset = async (req, res) => {

    const token = req.cookies.token;
    const password = req.body.password;

    const user = await User.findOne({
        token: token
    })

    if (md5(password) === user.password) {
        return res.json({
            code: 400,
            message: "Please enter a new password that is different from the old password.",
        })
    }

    await User.updateOne({
        token: token
    }, {
        password: md5(password)
    })

    return res.json({
        code: 200,
        message: "Reset password successfully",
        token: token
    })

}