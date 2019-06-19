import express from 'express'
import bcrypt, { hash } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { table, client } from '../index'
import cors from 'cors'
import { User } from '../database/models/user'
import { validUser } from '../utils/validUser'

export const router = express.Router()

router.use(cors({
    credentials: true

}))

router.use(express.json())

router.get('/', (req, res) => {
    res.json({
        message: '🗝'
    })
})
// Users can sign up for to the app with a unique email
// Users cannot sign up for to the app with a duplicate email
// Users can login to the app with valid email / password
// Users cannot login to the app with a blank or missing email
// Users cannot login to the app with a blank or incorrect password

router.post('/login', (req, res) => {
    if (validUser(req.body)) {
        User.findAll({
            where: {
                email: req.body.email
            }
        }).then(result => {
            if (result.length != 0) {
                bcrypt.compare(req.body.password, result[0].password)
                    .then(isPassword => {
                        if (isPassword) {
                            const token = jwt.sign({
                                email: result[0].email,
                                userId: result[0].user_id
                            }, 'secret',
                                {
                                    expiresIn: '30s'
                                }
                            )

                            res.json({
                                token,
                                message: 'logged in 🔓'
                            })


                        } else {
                            //failed to log in
                            res.status(401).json({
                                message: 'Invalid Login'
                            })
                        }
                    }).catch(err => console.log(err))
            } else {
                res.status(401).json({
                    message: 'Invalid Login'
                })
            }
        })
    } else {
        res.status(401).json({
            message: 'Authorization Faild ⛔️'
        })
    }
})

router.post('/signup', (req, res, next) => {
    if (validUser(req.body)) {
        User.findAll({
            where: {
                email: req.body.email
            }
        }).then((result) => {
            if (result.length == 0) {
                console.log('Hashing password .....')
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        User.create({
                            email: req.body.email,
                            password: hash
                        }).then(() => {
                            res.json({
                                message: '✅ User was created!'
                            })
                        }).catch(errors => console.log(errors))
                    })
            } else {
                console.log('Result is is truthy ', result)
                res.status(401).json({
                    message: 'Email  is already in use.'
                })
            }
        }).catch(err => console.log(err))

    } else {
        res.status(401).json({
            message: 'Authorization Faild: Invalid information ⛔️'
        })
    }

})

