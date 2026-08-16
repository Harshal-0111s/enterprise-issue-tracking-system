const User = require("../models/userModel");


/* =========================
   GET PROFILE
========================= */

const getProfile = (req, res) => {

    return res.status(200).json({

        success: true,

        message: "Profile fetched successfully.",

        user: req.user

    });

};


/* =========================
   GET ALL USERS
========================= */

const getAllUsers = (req, res) => {

    User.getAllUsers((err, result) => {

        if (err) {

            console.error("Get Users Error:", err);

            return res.status(500).json({

                success: false,

                message: "Unable to fetch users.",

                error: err.message

            });

        }

        return res.status(200).json({

            success: true,

            users: result

        });

    });

};


/* =========================
   GET SUPPORT AGENTS
========================= */

const getAgents = (req, res) => {

    User.getAgents((err, result) => {

        if (err) {

            console.error("Get Agents Error:", err);

            return res.status(500).json({

                success: false,

                message: "Unable to fetch support agents.",

                error: err.message

            });

        }

        return res.status(200).json({

            success: true,

            agents: result

        });

    });

};


module.exports = {

    getProfile,
    getAllUsers,
    getAgents

};
