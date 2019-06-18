"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var auth_1 = require("./auth");
var pg_1 = require("pg");
var cors_1 = __importDefault(require("cors"));
var sequelize_1 = require("../src/database/sequelize");
// reads the contents of .env and merges that with the pre exsiting environment varibles
dotenv_1.default.config();
// default defined environment varibles 
var PORT = process.env.PORT;
exports.app = express_1.default();
var config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
};
exports.client = new pg_1.Client(config);
exports.table = exports.client.connect();
exports.app.use('/auth', auth_1.router);
exports.app.use(cors_1.default({
    credentials: true
}));
exports.app.use(express_1.default.json());
exports.app.get('/', function (req, res) {
    exports.table
        .then(function () {
        return exports.client.query('select * from books');
    }).then(function (result) {
        res.json(result.rows.map(function (row) {
            return row;
        }));
    }).catch(function (error) {
        console.log(error);
    });
});
exports.app.listen(PORT, function () {
    console.log("Shhhh you are now in library port " + PORT);
});
sequelize_1.sequelize.sync();
// sequelize.sync()
//     .then((result: any) => {
//         app.listen(PORT, () => {
//             console.log(`Shhhh you are now in library port ${PORT}`)
//         })
//         console.log(result)
//     }).catch((err: string) => {
//         console.log('Sync Error :', err)
//     })
