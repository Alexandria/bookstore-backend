import express from 'express'
import dotenv from 'dotenv'
import { router } from './auth'
import { verifyToken } from './middleware/verifyToken'
import { Client, ConnectionConfig } from 'pg'
import cors from 'cors'
import { User } from './database/models/user'
import { Book } from './database/models/book'
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

app.use('/auth', router)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)

})

app.use(cors({
    credentials: true

}))
app.use(express.json())

app.get('/', (req, res) => {
    Book.findAll()
        .then((result) => {
            res.status(200).json(result)
        }).catch(err => {
            console.log(err)
        })
})

app.get('/users', (req, res) => {
    User.findAll()
        .then((result) => {
            res.status(200).json(result)
        }).catch(err => {
            console.log(err)
        })
})

app.get('/edit/:id', (req, res) => {
    Book.findAll({
        where: {
            book_id: req.params.id
        }
    }).then((result) => {
        res.status(200).json(result[0])
    }).catch(err => console.log(err))


})


app.post('/checkin', verifyToken, (req, res) => {
    Book.create({
        title: req.body.title,
        author: req.body.author
    }).then(() => {
        res.sendStatus(200)
    }).catch((err: string) => {
        console.log('Checkin Book Error: ', err)
    })

})

app.delete('/delete/:id', (req, res) => {
    Book.destroy({
        where: {
            book_id: req.params.id
        }
    }).then(() => {
        res.status(200)
    }).catch(err => console.log(err))
})

app.put('/edit/:id', (req, res) => {
    Book.update({
        title: req.body.title,
        author: req.body.author
    }, {
            where: {
                book_id: req.params.id
            }
        })

        .then(() => res.sendStatus(200))
})

// sequelize.sync()
//     .then((result: any) => {
//         app.listen(PORT, () => {
//             console.log(`listening on port ${PORT}`)

//         })
//     }).catch((err: string) => {
//         console.log('Sync', err)
//     })


//error handler
app.use(function (err: Error
    , req: express.Request, res: express.Response
    , next: express.NextFunction) {

    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    })


})

