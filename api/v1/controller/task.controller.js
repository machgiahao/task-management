const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination.js")

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        $or: [
            {createdBy: req.user.id},
            {listUser: req.user.id}
        ],
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status
    }

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // End sort

    // Paging
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 2
    },
        req.query,
        countTasks
    );
    // End paging

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);;

    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const tasks = await Task.findOne({
            _id: id,
            deleted: false
        });

        res.json(tasks);

    } catch (error) {
        res.json("Can not find !")
    }
}

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({
            _id: id
        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Update status successfully !" // send MESSAGE to FE to send notification to user
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Task does not exist !" // send MESSAGE to FE to send notification to user
        });
    }
}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const {ids, key, value} = req.body;
        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: {$in: ids}
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Update status successfully !" // send MESSAGE to FE to send notification to user
                });
                break;

            case "delete":
                await Task.updateMany({
                    _id: {$in: ids}
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "Delete task successfully !" // send MESSAGE to FE to send notification to user
                });
                break; 

            default:
                res.json({
                    code: 400,
                    message: "Task does not exist !" // send MESSAGE to FE to send notification to user
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Task does not exist !" // send MESSAGE to FE to send notification to user
        });
    }
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        const data = await Task.create(req.body);
        res.json({
            code: 200,
            message: "Create successfully !", 
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Create fail !" 
        });
    }
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({ _id: id }, req.body);

        res.json({
            code: 200,
            message: "Update task successfully !" // send MESSAGE to FE to send notification to user
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Task does not exist !" // send MESSAGE to FE to send notification to user
        });
    }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.deleteOne({ _id: id });

        res.json({
            code: 200,
            message: "Delete task successfully !" // send MESSAGE to FE to send notification to user
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Task does not exist !" // send MESSAGE to FE to send notification to user
        });
    }
}