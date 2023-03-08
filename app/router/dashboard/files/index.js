const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'school_website'
});
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = './app/public/assets/img/uploads';

// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const folderPath = uploadDir + '/' + req.query.folder;
        fs.mkdir(folderPath, { recursive: true }, function(err) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, folderPath);
            }
        });
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Init upload
const upload = multer({
    storage: storage
}).single('file');

// Route for handling file upload
router.post('/dashboard/upload', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                upload(req, res, (err) => {
                    if (err) {
                        res.send(err);
                    } else {
                        if (req.file == undefined) {
                            res.send('Error: No file selected');
                        } else {
                            res.redirect('/dashboard/files/'+ req.query.folder);
                        }
                    }
                });
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});

router.get('/dashboard/files/new', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                res.render('./dashboard/files/new', {
                  userinfo: userinfo
                });
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});


// GET /dashboard/files/
router.get('/dashboard/files', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
            if (userinfo.group != 'manager') { return res.redirect('/dashboard/files/'+userinfo.nationalID) }
                // Get the list of files in the upload directory
                const files = fs.readdirSync(uploadDir);
                
                // Generate the table rows
                let tableRows = '';
                
                files.forEach(file => {
                  const filePath = path.join(uploadDir, file);
                  const fileStat = fs.statSync(filePath);
                
                  let openFolderButton = '';
                  if (fileStat.isDirectory()) {
                    openFolderButton = `<a href="/dashboard/files/${filePath.replace('app\\public\\assets\\img\\uploads\\', '')}"><button class="btn btn-primary">باز کردن فایل</button></a>`;
                  }
              
                  tableRows += `
                    <tr>
                      <td>${file}</td>
                      <td>${fileStat.birthtime}</td>
                      <td>${openFolderButton}</td>
                    </tr>
                  `;
                });
            
                // Render the page with the table
                res.render('./dashboard/files/files', {
                  userinfo: userinfo,
                  tableRows: tableRows
                });
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});
router.get('/dashboard/files/:folderName', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                const folderName = req.params.folderName; // Get the folder name from the route parameter
              
                // Create the path to the folder
                const folderPath = path.join(uploadDir, folderName);
                
                // Get the list of files in the upload directory
                const files = fs.readdirSync(folderPath);
                
                // Generate the table rows
                let tableRows = '';
                
                files.forEach(file => {
                  const filePath = path.join(folderPath, file);
                  const fileStat = fs.statSync(filePath);
                
                  tableRows += `
                    <tr>
                      <td>${file} (link : ${filePath})</td>
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
                    ">خذف</button></td>
                    </tr>
                  `;
                });
            
                // Render the page with the table
                res.render('./dashboard/files/files', {
                    userinfo: userinfo,
                    tableRows: tableRows
                });
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});
  
// POST /dashboard/files/delete
router.post('/dashboard/files/delete', (req, res) => {
    if (req.signedCookies.remember_token) {
        connection.query("SELECT * FROM users WHERE remember_token = ?;", [req.signedCookies.remember_token], function (err, res2) {
            userinfo = res2[0]
            if (userinfo == null) { return res.redirect('/auth/login') }
            if (userinfo.remember_token !== req.signedCookies.remember_token) { return res.redirect('/auth/login') } else {
                // Get the file name from the request body
                const fileName = req.body.fileName;
                // Delete the file
                const filePath = path.join(uploadDir, fileName);
              
                fs.unlinkSync(filePath);
              
                // Send JSON response
                res.json({ success: true, message: 'File Ba Movafaghiat Pak Shod!' });
            }
        });
    } else {
        return res.redirect('/auth/login')
    }
});


module.exports = router