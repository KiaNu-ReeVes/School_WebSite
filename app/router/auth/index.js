const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'school_website'
});
const registerValidator = require('../registerValidator')
const {
    validationResult
} = require('express-validator')


const makeid = function (lengthh) {
    let length = lengthh
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return "Samen_" + result;
}

router.get('/auth', (req, res) => {
    res.redirect('/auth/register')
})


router.get('/auth/register', (req, res) => {
    res.render('./auth/register', {messages: []})
})

router.get('/auth/login', (req, res) => {
    res.render('./auth/login', {messages: []})
})

router.post('/auth/register', registerValidator.handle(), function (req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.array();
        const messages = [];
        errors.forEach(err => messages.push(err.msg))
        return res.render('./auth/register', {
            messages: messages
        })
    }
    connection.query("SELECT * FROM users WHERE nationalID = ?", [req.body.nationalID], function (err, resallacc) {
        if (resallacc[0] == undefined) {
            connection.query("INSERT INTO users (nationalID,nationalSerial) VALUES (?,?);", [req.body.nationalID, req.body.nationalSerial], function (err, rese) {
                if (err) return res.render('./auth/register', {
                    messages: ['مشکلی به وجود امده است لطفا بعدا تلاش کنید']
                })
                return res.redirect('/auth/login')
            })
        } else {
            return res.render('./auth/register', {
                messages: ['کد ملی در سیستم وجود دارد']
            })
        }
    });
});

router.post('/auth/login', function (req, res) {
    connection.query("SELECT * FROM users WHERE nationalID = ?;", [req.body.nationalID], function (err, res2) {
        userinfo = res2[0]
        if (userinfo == null) {
            return res.render('./auth/login', {
                messages: ['کد ملی در سیستم وجود دارد']
            })
        } else {
            if (userinfo.nationalSerial === req.body.nationalSerial) {
                if (req.body.rememberme) {
                    const Token = makeid(15);
                    res.cookie('remember_token', Token, {
                        maxAge: 1000 * 60 * 60 * 24 * 6,
                        httpOnly: true,
                        signed: true
                    });
                    connection.query(`UPDATE users SET remember_token = '${Token}' WHERE nationalID = '${req.body.nationalID}'`)
                    userinfo.remember_token = Token
                } else {
                    const Token = makeid(15);
                    res.cookie('remember_token', Token, {
                        maxAge: 5000 * 60,
                        httpOnly: true,
                        signed: true
                    });
                    connection.query(`UPDATE users SET remember_token = '${Token}' WHERE nationalID = '${req.body.nationalID}'`)
                    userinfo.remember_token = Token
                }
                return res.redirect('/dashboard')
            } else {
                return res.render('./auth/login', {
                    messages: ['سریال شناسنامه اشتباه است']
                })
            }
        }
    });
});

router.post('/auth/exit', (req, res) => {
    res.cookie('remember_token', '', {expires: new Date(1), path: '/' });
    res.clearCookie('remember_token', { path: '/' });
    
    res.json({ success: true, message: 'Shoma Az System Kharej Shodid!' });
});


module.exports = router