"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jwt = __importStar(require("jsonwebtoken"));
var index_1 = require("../index");
var cors_1 = __importDefault(require("cors"));
exports.router = express_1.default.Router();
exports.router.use(cors_1.default({
    credentials: true
}));
exports.router.use(express_1.default.json());
exports.router.get('/', function (req, res) {
    console.log(req.headers['authorization']);
    res.json({
        message: '🗝'
    });
});
// Users can sign up for to the app with a unique email
// Users cannot sign up for to the app with a duplicate email
// Users can login to the app with valid email / password
// Users cannot login to the app with a blank or missing email
// Users cannot login to the app with a blank or incorrect password
function validUser(user) {
    if (user) {
        var validEmail = user.email && user.email.trim() != '';
        var validPassword = user.password && user.password.trim() != '';
        console.log("User: " + user + ". validEmail: " + user.email + ", validPass: " + user.password);
        return validEmail && validPassword;
    }
    return false;
}
exports.router.post('/login', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, params, result, rows, isPasswordMatch, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!validUser(req.body)) return [3 /*break*/, 6];
                    //Verify that the email address is valid
                    return [4 /*yield*/, index_1.table];
                case 1:
                    //Verify that the email address is valid
                    _a.sent();
                    sql = 'select * from users where email = $1';
                    params = [req.body.email];
                    return [4 /*yield*/, index_1.client.query(sql, params)];
                case 2:
                    result = _a.sent();
                    console.log("Result", result.rows[0]);
                    rows = result.rows;
                    console.log(result);
                    if (!rows[0]) return [3 /*break*/, 4];
                    return [4 /*yield*/, bcrypt_1.default.compare(req.body.password, rows[0].password)
                        // setting JWT
                    ];
                case 3:
                    isPasswordMatch = _a.sent();
                    // setting JWT
                    if (isPasswordMatch) {
                        token = jwt.sign({
                            email: rows[0].email,
                            userId: rows[0].user_id
                        }, 'secret', {
                            expiresIn: '30s'
                        });
                        res.json({
                            token: token,
                            message: 'logged in 🔓'
                        });
                    }
                    else {
                        res.status(401).json({
                            message: 'Authorization Faild ⛔️'
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    res.status(401).json({
                        message: 'Authorization Faild ⛔️'
                    });
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    res.status(401).json({
                        message: 'Authorization Faild ⛔️'
                    });
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
});
exports.router.post('/signup', function (req, res, next) {
    console.log("Request Body: " + req.body);
    if (validUser(req.body)) {
        index_1.table
            .then(function () {
            var sql = 'select * from users where email = $1';
            var params = [req.body.email];
            return index_1.client.query(sql, params);
        }).then(function (result) {
            if (result.rows.length <= 0) {
                //hash the password
                bcrypt_1.default.hash(req.body.password, 10)
                    .then(function (hash) {
                    var sql = 'insert into users(email, password)values($1,$2)';
                    var params = [req.body.email, hash];
                    return index_1.client.query(sql, params);
                }).catch(function (errors) { return console.log(errors); });
                res.json({
                    message: '✅'
                });
            }
            else {
                // else, This email is already taken
                res.json({
                    message: 'Email is already registered'
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
        console.log("Req body: " + req.body);
    }
    else {
        next(new Error('Invalid Information Provided'));
    }
});
