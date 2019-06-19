"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SequelizeData = require('sequelize');
var sequelize_1 = require("../sequelize");
var User = sequelize_1.sequelize.define('user', {
    user_id: {
        type: SequelizeData.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: SequelizeData.String,
        allowNull: false
    },
    password: {
        type: SequelizeData.String,
        allowNull: false
    }
});
module.exports = User;
