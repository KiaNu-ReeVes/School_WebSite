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
                connection.query('SELECT * FROM blogs', function(err, res2) {
                    connection.query('SELECT * FROM users WHERE `group` = ?', ['student'], function(err, res3) {
                        connection.query('SELECT * FROM users WHERE `group` = ?;', ['teacher'], function(err, res4) {
                            connection.query('SELECT * FROM users WHERE `group` = ?;', ['manager'], function(err, res5) {
                                return res.render('./dashboard/index', {userinfo: userinfo, blogs: res2, students: res3, teachers: res4, managers: res5})
                            });
                        });
                    });
                });
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
})

router.use(require('./users/index'))

module.exports = router