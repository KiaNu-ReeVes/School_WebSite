const express = require('express');
var flash = require('connect-flash');
var session = require('express-session');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = class Application {
    constructor() {
        this.websiteConfig();
        this.folderConfig();
        this.serverListen();
    }
    websiteConfig() {
        app.use(express.static(__dirname + '/public'))
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, 'resources/views'))
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())
        app.set('trust proxy', 1)
        app.use(cookieParser('MY SECRET'))
        app.use(session({
          secret: 'woot',
          resave: true,
          saveUninitialized: true,
          cookie: { secure: true, maxAge: 60000 }
        }))
        app.use(flash());
    
    
        app.get('/', (req, res) => {
            res.render('index')
        })

        app.get('/about', (req, res) => {
            res.render('about')
        })

        app.get('/contact', (req, res) => {
            res.render('contact')
        })
    
    }
    folderConfig() {
        app.use(require('./router/auth/index'))
        app.use(require('./router/blog/index'))
        app.use(require('./router/dashboard/index'))
    }
    serverListen() {
        app.use(function(req, res){
            // res.status(404).render('404');
            res.send('<a href="/"><h1>Back</h1></a>')
        });  

        app.listen(3000, (err) => {
            if(err) console.log(err)
            console.log(`WebSite Loaded\nPort : 3000`)
        })
    }
}