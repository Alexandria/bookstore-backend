import express from 'express'
export function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const bearerHeader = req.headers['authorization']
    //chk if bearer if undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space 
        const bearer = bearerHeader.split(' ')
        //get token from array
        const bearrerToken = bearer[1]
        //set the token 
        req.headers['authorization'] = bearrerToken
        // next middelware
        next()
    } else {
        //forbidden
        res.sendStatus(403)
    }
}