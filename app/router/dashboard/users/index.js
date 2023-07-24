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

const grouplabel = {
  ["دانش اموز"]: "student",
  ["معلم"]: "teacher",
  ["معاون"]: "manager",
};

router.get("/dashboard/users/list", (req, res) => {
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
          if (userinfo.group != "manager") {
            return res.redirect("/dashboard");
          }
          if (req.query.group) {
            connection.query(
              "SELECT * FROM users WHERE `group` = ?",
              [req.query.group],
              function (err, res2) {
                return res.render("./dashboard/users/list", {
                  userinfo: userinfo,
                  users: res2,
                });
              }
            );
          } else {
            connection.query("SELECT * FROM users", function (err, res2) {
              return res.render("./dashboard/users/list", {
                userinfo: userinfo,
                users: res2,
              });
            });
          }
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.get("/dashboard/users/new", (req, res) => {
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
          if (userinfo.group != "manager") {
            return res.redirect("/dashboard");
          }
          return res.render("./dashboard/users/new", { userinfo: userinfo });
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.get("/dashboard/users/edit", (req, res) => {
  if (req.query.nationalID) {
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
              "SELECT * FROM users WHERE nationalID = ?",
              [req.query.nationalID],
              function (err, res2) {
                return res.render("./dashboard/users/edit", {
                  userinfo: userinfo,
                  user: res2[0],
                });
              }
            );
          }
        }
      );
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    return res.redirect("/dashboard/users/list");
  }
});

router.post("/dashboard/users/edit", function (req, res) {
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
          if (userinfo.group != "manager") {
            return res.redirect("/dashboard");
          }
          if (!req.query.new) {
            if (req.query.nationalID) {
              var classValue = "";
              var typeValue = "";
              if (grouplabel[req.body.group] == "student") {
                var classValue = req.body.class || "";
              } else {
                var classValue = "";
              }
              if (grouplabel[req.body.group] == "teacher") {
                var typeValue = req.body.type || "";
              } else {
                var typeValue = "";
              }

              connection.query(
                `UPDATE users SET nationalID = '${
                  req.body.nationalID
                }', nationalSerial = '${
                  req.body.nationalSerial
                }', username = '${req.body.username}', \`group\` = '${
                  grouplabel[req.body.group]
                }', class = '${classValue}', type = '${typeValue}' WHERE nationalID = '${
                  req.query.nationalID
                }'`
              );
              return res.redirect("/dashboard/users/list");
            } else {
              return res.redirect("/dashboard/users/list");
            }
          } else {
            if (grouplabel[req.body.group] == "student") {
              var classValue = req.body.class || "";
            } else {
              var classValue = "";
            }
            if (grouplabel[req.body.group] == "teacher") {
              var typeValue = req.body.type || "";
            } else {
              var typeValue = "";
            }

            connection.query(
              "INSERT INTO users (nationalID,nationalSerial,username,`group`, class, type) VALUES (?,?,?,?,?,?);",
              [
                req.body.nationalID,
                req.body.nationalSerial,
                req.body.username,
                grouplabel[req.body.group],
                classValue,
                typeValue,
              ],
              function (err, rese) {
                return res.redirect("/dashboard/users/list");
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

router.post("/dashboard/users/delete", function (req, res) {
  if (req.query.nationalID) {
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
            if (req.query.nationalID) {
              connection.query("DELETE FROM users WHERE nationalID = ?;", [
                req.query.nationalID,
              ]);
              return res.redirect("/dashboard/users/list");
            } else {
              return res.redirect("/dashboard/users/list");
            }
          }
        }
      );
    } else {
      return res.redirect("/auth/login");
    }
  } else {
    return res.redirect("/dashboard/users/list");
  }
});

module.exports = router;
