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

router.get("/dashboard", (req, res) => {
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
          connection.query("SELECT * FROM blogs", function (err, res2) {
            connection.query(
              "SELECT * FROM users WHERE `group` = ?",
              ["student"],
              function (err, res3) {
                connection.query(
                  "SELECT * FROM users WHERE `group` = ?;",
                  ["teacher"],
                  function (err, res4) {
                    connection.query(
                      "SELECT * FROM users WHERE `group` = ?;",
                      ["manager"],
                      function (err, res5) {
                        if (userinfo.class != "") {
                          connection.query(
                            "SELECT * FROM homeworks WHERE class = ?",
                            [userinfo.class],
                            function (err, res6) {
                              return res.render("./dashboard/index", {
                                userinfo: userinfo,
                                blogs: res2,
                                students: res3,
                                teachers: res4,
                                managers: res5,
                                homeworks: res6,
                              });
                            }
                          );
                        } else if (userinfo.type != "") {
                          connection.query(
                            "SELECT * FROM homeworks WHERE type = ?",
                            [userinfo.type],
                            function (err, res6) {
                              return res.render("./dashboard/index", {
                                userinfo: userinfo,
                                blogs: res2,
                                students: res3,
                                teachers: res4,
                                managers: res5,
                                homeworks: res6,
                              });
                            }
                          );
                        } else {
                          connection.query(
                            "SELECT * FROM homeworks",
                            function (err, res6) {
                              return res.render("./dashboard/index", {
                                userinfo: userinfo,
                                blogs: res2,
                                students: res3,
                                teachers: res4,
                                managers: res5,
                                homeworks: res6,
                              });
                            }
                          );
                        }
                      }
                    );
                  }
                );
              }
            );
          });
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.use(require("./users/index"));
router.use(require("./homework/index"));
router.use(require("./files/index"));
router.use(require("./exam/index"));

module.exports = router;
