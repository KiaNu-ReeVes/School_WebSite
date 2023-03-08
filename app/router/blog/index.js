const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'school_website'
});


router.get('/blog', (req, res) => {
    connection.query('SELECT * FROM blogs', function(err, res2) {
        res.render('blog', {blogs: res2})
    });
})

router.get('/blog/:id', (req, res) => {
    connection.query('SELECT * FROM blogs WHERE id = ?', [req.params.id], function(err, res2) {
        if (res2[0]) {
            res.render('single', {blog: res2[0]})
        } else {
            res.redirect('/blog')
        }
    });
})

router.get('/dashboard/blogs', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
            if (userinfo.group != 'manager') { return res.redirect('/dashboard') }
                connection.query('SELECT * FROM blogs', function(err, res2) {
                    return res.render('./dashboard/blog/all', {userinfo: userinfo, blogs: res2})
                });
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
})

router.get('/dashboard/blogs/edit', (req, res) => {
    if (req.query.id) {
        if (req.signedCookies.remember_token) {
            connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
                userinfo = res2[0]
                if (userinfo == null) { return res.redirect('/auth/login') }
                if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                if (userinfo.group != 'manager') { return res.redirect('/dashboard') }
                    connection.query('SELECT * FROM blogs WHERE id = ?', [req.query.id], function(err, res2) {
                        return res.render('./dashboard/blog/edit', {userinfo: userinfo, blogs: res2[0]})
                    });
                }
            });
        } else {
            return res.redirect('/auth/login')
        }
    } else {
        return res.redirect('/dashboard/blogs')
    }
})

router.post('/dashboard/blogs/edit', function (req, res) {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
            if (userinfo.group != 'manager') { return res.redirect('/dashboard') }
                if (!req.query.new) {
                    if (req.query.id) {
                        connection.query(`UPDATE blogs SET title = '${req.body.title}', about = '${req.body.about}', picture = '${req.body.picture}', id = '${req.body.id}', month = '${req.body.month}', day = '${req.body.day}', bigtext = '${req.body.bigtext}' WHERE id = '${req.query.id}'`)
                        return res.redirect('/dashboard/blogs')
                    } else {
                        return res.redirect('/dashboard/blogs')
                    }
                } else {
                    connection.query("INSERT INTO blogs (title,about,picture,id,month,day,bigtext) VALUES (?,?,?,?,?,?,?);", [req.body.title,req.body.about,req.body.picture,req.body.id,req.body.month,req.body.day,req.body.bigtext], function (err, rese) {
                        return res.redirect('/dashboard/blogs')
                    })
                }
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});

const makeid = function (lengthh) {
    let length = lengthh
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

router.get('/dashboard/blogs/new', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
            if (userinfo.group != 'manager') { return res.redirect('/dashboard') }
                    return res.render('./dashboard/blog/new', {userinfo: userinfo})
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
})

router.post('/dashboard/blogs/delete', function (req, res) {
    if (req.query.id) {
        if (req.signedCookies.remember_token) {
            connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
                userinfo = res2[0]
                if (userinfo == null) { return res.redirect('/auth/login') }
                if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                if (userinfo.group != 'manager') { return res.redirect('/dashboard') }
                    if (req.query.id) {
                        connection.query("DELETE FROM blogs WHERE id = ?;", [req.query.id])
                            return res.redirect('/dashboard/blogs')
                    } else {
                        return res.redirect('/dashboard/blogs')
                    }
                }
            });
        } else {
            return res.redirect('/auth/login')
        }
    } else {
        return res.redirect('/dashboard/blogs')
    }
});

module.exports = router