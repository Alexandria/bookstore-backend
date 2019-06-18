import express from 'express'
import bcrypt, { hash } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { table, client } from '../index'
import cors from 'cors'

export const router = express.Router()

router.use(cors({
    credentials: true

}))

router.use(express.json())

router.get('/', (req, res) => {
    console.log(req.headers['authorization'])
    res.json({
        message: '🗝'
    })
})
// Users can sign up for to the app with a unique email
// Users cannot sign up for to the app with a duplicate email
// Users can login to the app with valid email / password
// Users cannot login to the app with a blank or missing email
// Users cannot login to the app with a blank or incorrect password

function validUser(user: { email: string, password: string }) {
    if (user) {
        const validEmail = user.email && user.email.trim() != ''
        const validPassword = user.password && user.password.trim() != ''

        console.log(`User: ${user}. validEmail: ${user.email}, validPass: ${user.password}`)
        return validEmail && validPassword
    }
    return false
}

router.post('/login', async function (req, res, next) {
    if (validUser(req.body)) {
        //Verify that the email address is valid
        await table
        const sql = 'select * from users where email = $1'
        const params = [req.body.email]

        const result = await client.query(sql, params)
        console.log("Result", result.rows[0])
        const { rows } = result
        console.log(result)
        if (rows[0]) {
            //if email is valid hash the incomming password the user entered
            //Use the compare function from bcrupt to compare user entered pw with one in the data base
            const isPasswordMatch = await bcrypt.compare(req.body.password, rows[0].password)
            // setting JWT
            if (isPasswordMatch) {
                // set token!
                const token = jwt.sign({
                    email: rows[0].email,
                    userId: rows[0].user_id
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
                res.status(401).json({
                    message: 'Authorization Faild ⛔️'
                })
            }


        } else {
            res.status(401).json({
                message: 'Authorization Faild ⛔️'
            })
        }

        //set a cookie
    } else {
        res.status(401).json({
            message: 'Authorization Faild ⛔️'
        })
    }
})

router.post('/signup', (req, res, next) => {
    console.log(`Request Body: ${req.body}`)
    if (validUser(req.body)) {
        table
            .then(() => {
                const sql = 'select * from users where email = $1'
                const params = [req.body.email]
                return client.query(sql, params)
            }).then(result => {
                if (result.rows.length <= 0) {
                    //hash the password
                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            const sql = 'insert into users(email, password)values($1,$2)'
                            const params = [req.body.email, hash]
                            return client.query(sql, params)
                        }).catch(errors => console.log(errors))
                    res.json({
                        message: '✅'
                    })
                } else {
                    // else, This email is already taken
                    res.json({
                        message: 'Email is already registered'
                    })
                }
            }).catch(error => {
                console.log(error)
            })
        console.log(`Req body: ${req.body}`)

    } else {
        next(new Error('Invalid Information Provided'))
    }
})