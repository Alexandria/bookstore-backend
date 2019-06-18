import express from 'express'
import dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'
import { router } from './auth'
import { check_auth } from './middleware/check-auth'
//https://node-postgres.com/
import { Client, ConnectionConfig } from 'pg'
import { verify } from 'crypto';
import { request } from 'http';
import { ErrorInfo } from 'react';
import cors from 'cors'

// reads the contents of .env and merges that with the pre exsiting environment varibles
dotenv.config()

// default defined environment varibles 
const PORT = process.env.PORT

export const app = express()

type Row = { book_id: number, title: string, author: string }

const config: ConnectionConfig = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
}


export const client = new Client(config)
export const table = client.connect()

//my Routers
app.use('/auth', router)

//middleware
// https://enable-cors.org/server_expressjs.html

// set to true to pass headers
app.use(cors({
    credentials: true

}))
app.use(express.json())



app.listen(PORT, () => {
    console.log(`Shhhh you are now in library port ${PORT}`)
})

app.get('/', (req, res) => {
    table
        .then(() => {
            return client.query('select * from books')
        }).then((result) => {
            res.json(result.rows.map((row: Row) => {
                return row
            }))
        }).catch(error => {
            console.log(error)
        })


})

app.get('/edit/:id', (req, res) => {
    table
        .then(() => {
            const sql = 'select * from books where book_id = $1'
            const params = [req.params.id]
            return client.query(sql, params)
        }).then((result) => {
            res.send(result.rows[0])
        }).catch((error) => {
            console.log("Modify Error backend:", error)
        })


})

app.post('/checkin', check_auth, (req, res) => {

    //connect to the database
    table
        .then(() => {
            //run querry
            const sql = 'insert into books (title, author) values($1,$2)'
            const params = [req.body.title, req.body.author]
            res.send("Added Book")
            return client.query(sql, params)
        })
        .then((result) => {
            //then rediret to list
            console.log(`Book ${req.body.title} was added to the database`)
        }).catch(error => {
            console.log(error)
        })



})
app.post('/test/post', verifyToken, (req, res) => {
    if (req.headers['authorization']) {

        jwt.verify(req.headers['authorization'], 'secretkey', function (err: jwt.VerifyErrors, authdata: string | object) {
            if (err) {
                res.sendStatus(403)
            } else {
                res.json({
                    message: 'Post Created',
                    authdata
                })
                res.sendStatus(200)
            }
        })
    } else {
        res.sendStatus(403)
    }



})

app.post('/login', (req, res) => {
    // Mock user
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    table
        .then(() => {
            const sql = 'select * from users where email = $1 and password = $2'
            const params = [user.email, user.password]
            return client.query(sql, params)
        }).then(result => {
            console.log(`Result ${result.rows[0].email}`)
            if (result.rows.length > 0 && result.rows.length != null) {
                //check to make sure that they match user
                if (user.email === result.rows[0].email && user.password === result.rows[0].password) {
                    //This user gets a token!
                    console.log('Compelte Match')
                    jwt.sign({ user }, 'secretkey', (error: Error, token: string) => {
                        res.json({ token })
                    })
                }
                res.sendStatus(200)
            } else {
                console.log('Not a match')
                res.send('There was not a match')
            }
        }).catch(err => {
            console.log(err)
        })


})

app.delete('/delete/:id', (req, res) => {
    table
        .then(() => {
            const sql = 'delete from books where book_id = $1'
            const params = [req.params.id]
            return client.query(sql, params)
        })
        .then(() => {
            res.send(`Book id: ${req.params.id} was deleted`)
            console.log(`Book id: ${req.params.id} was deleted`)
        }).catch((error) => {
            console.log(error)
        })
})

app.put('/edit/:id', (req, res) => {
    table
        .then(() => {
            const sql = 'update books set title = $1, author=$2 where book_id = $3'
            const params = [req.body.title, req.body.author, req.params.id]
            return client.query(sql, params)
        }).then(() => {
            res.send(`Book id: ${req.params.id} was modified!`)
            console.log(`Book id: ${req.params.id} was modified`)
        }).catch(err => { console.log(err) })

})

//token format
//authorization: bearer <access_token>


//vrifyTkn
function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
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


//error handler
app.use(function (err: Error
    , req: express.Request, res: express.Response
    , next: express.NextFunction) {

    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    })


})
