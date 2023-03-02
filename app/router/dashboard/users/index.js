const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'school_website'
});

const grouplabel = {
    ["دانش اموز"]: "student",
    ["معلم"]: "teacher",
    ["معاون"]: "manager",
}

router.get('/dashboard/users/list', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                if (req.query.group) {
                    connection.query('SELECT * FROM users WHERE `group` = ?', [req.query.group], function(err, res2) {
                        return res.render('./dashboard/users/list', {userinfo: userinfo, users: res2})
                    });
                } else {
                    connection.query('SELECT * FROM users', function(err, res2) {
                        return res.render('./dashboard/users/list', {userinfo: userinfo, users: res2})
                    });
                }
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
})

router.get('/dashboard/users/new', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                    return res.render('./dashboard/users/new', {userinfo: userinfo})
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
})

router.get('/dashboard/users/edit', (req, res) => {
    if (req.query.nationalID) {
        if (req.signedCookies.remember_token) {
            connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
                userinfo = res2[0]
                if (userinfo == null) { return res.redirect('/auth/login') }
                if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                    connection.query('SELECT * FROM users WHERE nationalID = ?', [req.query.nationalID], function(err, res2) {
                        return res.render('./dashboard/users/edit', {userinfo: userinfo, user: res2[0]})
                    });
                }
            });
        } else {
            return res.redirect('/auth/login')
        }
    } else {
        return res.redirect('/dashboard/users/list')
    }
})

router.post('/dashboard/users/edit', function (req, res) {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                if (!req.query.new) {
                    if (req.query.nationalID) {
                        connection.query(`UPDATE users SET nationalID = '${req.body.nationalID}', nationalSerial = '${req.body.nationalSerial}', username = '${req.body.username}', \`group\` = '${grouplabel[req.body.group]}' WHERE nationalID = '${req.query.nationalID}'`)
                        return res.redirect('/dashboard/users/list')
                    } else {
                        return res.redirect('/dashboard/users/list')
                    }
                } else {
                    connection.query("INSERT INTO users (nationalID,nationalSerial,username,`group`) VALUES (?,?,?,?);", [req.body.nationalID, req.body.nationalSerial ,req.body.username ,grouplabel[req.body.group]], function (err, rese) {
                        return res.redirect('/dashboard/users/list')
                    })
                }
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});

router.post('/dashboard/users/delete', function (req, res) {
    if (req.query.nationalID) {
        if (req.signedCookies.remember_token) {
            connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
                userinfo = res2[0]
                if (userinfo == null) { return res.redirect('/auth/login') }
                if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                    if (req.query.nationalID) {
                        connection.query("DELETE FROM users WHERE nationalID = ?;", [req.query.nationalID])
                            return res.redirect('/dashboard/users/list')
                    } else {
                        return res.redirect('/dashboard/users/list')
                    }
                }
            });
        } else {
            return res.redirect('/auth/login')
        }
    } else {
        return res.redirect('/dashboard/users/list')
    }
});

router.get('/dashboard/homework', function (req, res) {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                return res.json(true)
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});

module.exports = router