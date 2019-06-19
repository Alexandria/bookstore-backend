"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = __importStar(require("jsonwebtoken"));
//https://www.youtube.com/watch?v=8Ip0pcwbWYM&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=13
exports.check_auth = function (req, res, next) {
    try {
        var token = (req.headers.authorization !== undefined) ? req.headers.authorization.split(" ")[1] : " ";
        console.log('token: ', token);
        console.log('headers', req.headers.authorization);
        var decoded = jwt.verify(token, "secret");
        console.log('decoded: ', decoded);
        next();
    }
    catch (error) {
        res.status(401).json({
            message: 'Authorization Faild ⛔️ at token'
        });
    }
};
