"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require('sequelize');
exports.sequelize = new Sequelize('postgres://localhost:5433/library');
