const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'school_website'
});


router.get('/dashboard', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                return res.render('./dashboard/index', {userinfo: userinfo})
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
})

module.exports = router