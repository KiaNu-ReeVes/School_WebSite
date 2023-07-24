const express = require("express");
const router = express.Router();
const blockchain = require("kiansql_blockchain");
const connection = blockchain.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

router.get("/dashboard/exam", function (req, res) {
  res.redirect("/dashboard/exam/list");
});

router.get("/dashboard/exam/list", function (req, res) {
  if (req.signedCookies.remember_token) {
    connection.query(
      "SELECT * FROM users WHERE remember_token = ?;",
      [req.signedCookies.remember_token],
      function (err, res2) {
        userinfo = res2[0];
        if (userinfo == null) {
          return res.redirect("/auth/login");
        }
        if (userinfo.remember_token !== req.signedCookies.remember_token) {
          return res.redirect("/auth/login");
        } else {
          if (userinfo.group != "student") {
            connection.query(
              "SELECT * FROM exam;",
              [req.signedCookies.remember_token],
              function (err, res2) {
                res.render("./dashboard/exam/list", {
                  userinfo: userinfo,
                  exams: res2,
                });
              }
            );
          } else {
            connection.query(
              "SELECT * FROM exam WHERE class = ?;",
              [userinfo.class],
              function (err, res2) {
                res.render("./dashboard/exam/list", {
                  userinfo: userinfo,
                  exams: res2,
                });
              }
            );
          }
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.post("/dashboard/exam/delete", function (req, res) {
  if (req.query.id) {
    if (req.signedCookies.remember_token) {
      connection.query(
        "SELECT * FROM users WHERE remember_token = ?;",
        [req.signedCookies.remember_token],
        function (err, res2) {
          userinfo = res2[0];
          if (userinfo == null) {
            return res.redirect("/auth/login");
          }
          if (userinfo.remember_token !== req.signedCookies.remember_token) {
            return res.redirect("/auth/login");
          } else {
            if (userinfo.group != "student") {
              if (req.query.id) {
                connection.query("DELETE FROM exam WHERE id = ?;", [
                  req.query.id,
                ]);
                return res.redirect("/dashboard/exam");
              } else {
                return res.redirect("/dashboard/exam");
              }
            }
          }
        }
      );
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    return res.redirect("/dashboard/exam");
  }
});

router.get("/dashboard/exam/new", function (req, res) {
  if (req.signedCookies.remember_token) {
    connection.query(
      "SELECT * FROM users WHERE remember_token = ?;",
      [req.signedCookies.remember_token],
      function (err, res2) {
        userinfo = res2[0];
        if (userinfo == null) {
          return res.redirect("/auth/login");
        }
        if (userinfo.remember_token !== req.signedCookies.remember_token) {
          return res.redirect("/auth/login");
        } else {
          res.render("./dashboard/exam/new", {
            userinfo: userinfo,
          });
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.post("/dashboard/exam/edit", function (req, res) {
  if (req.signedCookies.remember_token) {
    connection.query(
      "SELECT * FROM users WHERE remember_token = ?;",
      [req.signedCookies.remember_token],
      function (err, rows) {
        if (err) {
          console.log(err);
          return res.redirect("/auth/login");
        }

        if (rows.length === 0) {
          return res.redirect("/auth/login");
        }

        const userinfo = rows[0];

        if (userinfo.remember_token !== req.signedCookies.remember_token) {
          return res.redirect("/auth/login");
        }

        const classValue = req.body.class;
        const teacherValue = userinfo.username;
        const longtextValue = req.body.bigtext;

        connection.query(
          "INSERT INTO exam (class, teacher, longtsdext) VALUES (?, ?, ?);",
          [classValue, teacherValue, longtextValue],
          function (err, result) {
            if (err) {
              console.log(err);
              return res.redirect("/dashboard/exam/list");
            }

            return res.redirect("/dashboard/exam/list");
          }
        );
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.get("/dashboard/exam/participation", function (req, res) {
  const query = req.query.id;
  if (!query) return res.redirect("/dashboard/exam");
  if (req.signedCookies.remember_token) {
    connection.query(
      "SELECT * FROM users WHERE remember_token = ?;",
      [req.signedCookies.remember_token],
      function (err, res2) {
        userinfo = res2[0];
        if (userinfo == null) {
          return res.redirect("/auth/login");
        }
        if (userinfo.remember_token !== req.signedCookies.remember_token) {
          return res.redirect("/auth/login");
        } else {
          connection.query(
            "SELECT * FROM exam WHERE id = ?;",
            [query],
            function (err, rows) {
              console.log(rows);
              res.render("./dashboard/exam/exam", {
                userinfo: userinfo,
                exam: rows[0],
              });
            }
          );
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

module.exports = router;
