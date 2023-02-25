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
            res.redirect('/404')
        }
    });
})

router.post('/blog', function (req, res) {
    connection.query(`UPDATE blogs SET bigtext = '${req.body.text2}' WHERE id = '123'`)
});

module.exports = router