"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyToken(req, res, next) {
    var bearerHeader = req.headers['authorization'];
    //chk if bearer if undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space 
        var bearer = bearerHeader.split(' ');
        //get token from array
        var bearrerToken = bearer[1];
        //set the token 
        req.headers['authorization'] = bearrerToken;
        // next middelware
        next();
    }
    else {
        //forbidden
        res.sendStatus(403);
    }
}
exports.verifyToken = verifyToken;
