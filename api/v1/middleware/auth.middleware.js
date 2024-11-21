const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];

        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password -token")

        if(!res) {
            return res.json({
                code: 400,
                message: "Token is not valid !"
            })
        }    
        req.user = user;

        next();
    } else {
        return res.json({
            code: 400,
            message: "You are not authenticated !"
        })
    }


    
}