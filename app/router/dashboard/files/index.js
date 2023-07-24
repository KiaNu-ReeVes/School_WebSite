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
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = "./app/public/assets/img/uploads";

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = uploadDir + "/" + req.query.folder;
    fs.mkdir(folderPath, { recursive: true }, function (err) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, folderPath);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("file");

router.post("/dashboard/upload", (req, res) => {
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
          upload(req, res, (err) => {
            if (err) {
              res.send(err);
            } else {
              if (req.file == undefined) {
                res.send("Error: No file selected");
              } else {
                res.redirect("/dashboard/files/new");
              }
            }
          });
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.get("/dashboard/files/new", (req, res) => {
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
          res.render("./dashboard/files/new", {
            userinfo: userinfo,
          });
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.get("/dashboard/files", (req, res) => {
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
            return res.redirect("/dashboard/files/" + userinfo.nationalID);
          }

          const files = fs.readdirSync(uploadDir);

          let tableRows = "";

          files.forEach((file) => {
            const filePath = path.join(uploadDir, file);
            const fileStat = fs.statSync(filePath);

            let openFolderButton = "";
            if (fileStat.isDirectory()) {
              openFolderButton = `<a href="/dashboard/files/${filePath.replace(
                "app\\public\\assets\\img\\uploads\\",
                ""
              )}"><button class="btn btn-primary">باز کردن فایل</button></a>`;
            }

            tableRows += `
                    <tr>
                      <td>${file}</td>
                      <td>${filePath.replace(
                        "app\\public",
                        "http://localhost:3000"
                      )}</td>
                      <td>${fileStat.birthtime}</td>
                      <td>${openFolderButton}</td>
                    </tr>
                  `;
          });

          res.render("./dashboard/files/files", {
            userinfo: userinfo,
            tableRows: tableRows,
          });
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.get("/dashboard/files/:folderName", (req, res) => {
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
          const folderName = req.params.folderName;

          const folderPath = path.join(uploadDir, folderName);
          fs.mkdir(folderPath, { recursive: true }, function (err) {
            if (err) {
              console.error(err);
            }
          });

          const files = fs.readdirSync(folderPath);

          let tableRows = "";

          files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            const fileStat = fs.statSync(filePath);

            tableRows += `
                    <tr>
                      <td>${file}</td>
                      <td>${filePath.replace(
                        "app\\public",
                        "http://localhost:3000"
                      )}</td>
                      <td>${fileStat.birthtime}</td>
                      <td><button class="btn btn-danger" onclick="
                      $.post('/dashboard/files/delete', { fileName: '${folderName}/${file}' })
                      .done(function(response) {
                        if (response.success) {
                          alert(response.message);
                          location.reload();
                        } else {
                          alert('Error: ' + response.message);
                        }
                      })
                      .fail(function(jqXHR, textStatus, errorThrown) {
                        alert('Error: ' + errorThrown);
                      });
                    ">حذف</button></td>
                    </tr>
                  `;
          });

          res.render("./dashboard/files/files", {
            userinfo: userinfo,
            tableRows: tableRows,
          });
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

router.post("/dashboard/files/delete", (req, res) => {
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
          const fileName = req.body.fileName;

          const filePath = path.join(uploadDir, fileName);

          fs.unlinkSync(filePath);

          res.json({ success: true, message: "File Ba Movafaghiat Pak Shod!" });
        }
      }
    );
  } else {
    return res.redirect("/auth/login");
  }
});

module.exports = router;
