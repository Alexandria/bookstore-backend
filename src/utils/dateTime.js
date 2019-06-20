"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.today = new Date();
exports.date = exports.today.getFullYear() + '-' + (exports.today.getMonth() + 1) + '-' + exports.today.getDate();
exports.time = exports.today.getHours() + ":" + exports.today.getMinutes() + ":" + exports.today.getSeconds();
exports.curDateTime = exports.date + ' ' + exports.time;
