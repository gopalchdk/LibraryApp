const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 3000;

const nav = [
    {
        link: '/books',
        name: 'Books'
    }, {
        link: '/authors',
        name: 'Authors'
    }
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret:'library'}));
require('./src/config/passport.js')(app);
const bookRouter = require('./src/routes/bookroute')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth',authRouter);

app.get('/', (req, res) => {
    res.render('index', {
        title: "Library app",
        nav
    });
});

app.listen(port, () => {
    debug(`listening on port ${chalk.green(port)}`);
});
