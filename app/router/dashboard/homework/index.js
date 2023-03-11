const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'school_website'
});


const makeid = function (lengthh) {
  let length = lengthh
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
  }
  return "homework_" + result;
}

router.get('/dashboard/homework', function (req, res) {
    res.redirect('/dashboard/homework/list')
});

router.get('/dashboard/homework/list', function (req, res) {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                if (userinfo.type === null) {
                  connection.query('SELECT * FROM homeworks', function(err, res2) {
                    res.render('./dashboard/homework/list', {
                      userinfo: userinfo,
                      homeworks: res2
                    });
                  });
                } else {
                  connection.query('SELECT * FROM homeworks WHERE type = ?', [userinfo.type], function(err, res2) {
                    res.render('./dashboard/homework/list', {
                      userinfo: userinfo,
                      homeworks: res2
                    });
                  });
                }                  
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});

router.post('/dashboard/homework/delete', function (req, res) {
  if (req.query.id) {
      if (req.signedCookies.remember_token) {
          connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
              userinfo = res2[0]
              if (userinfo == null) { return res.redirect('/auth/login') }
              if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                  if (req.query.id) {
                      connection.query("DELETE FROM homeworks WHERE id = ?;", [req.query.id])
                          return res.redirect('/dashboard/homework')
                  } else {
                      return res.redirect('/dashboard/homework')
                  }
              }
          });
      } else {
          return res.redirect('/auth/login')
      }
  } else {
      return res.redirect('/dashboard/homework')
  }
});

router.get('/dashboard/homework/new', function (req, res) {
  if (req.signedCookies.remember_token) {
      connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
          userinfo = res2[0]
          if (userinfo == null) { return res.redirect('/auth/login') }
          if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
            res.render('./dashboard/homework/new', {
              userinfo: userinfo
            });
          }
      });
  } else {
      return res.redirect('/auth/login')
  }
});

router.post('/dashboard/homework/edit', function (req, res) {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
              connection.query("INSERT INTO homeworks (id,class,description,type) VALUES (?,?,?,?);", [makeid(5), req.body.class ,req.body.description ,userinfo.type], function (err, rese) {
                  return res.redirect('/dashboard/homework/list')
              })
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});


module.exports = router