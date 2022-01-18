const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const { sequelize } = require('./models');
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

const app = express();

//Console output the various info regarding dev environment : HTTP method, address, status code, response time
app.use(morgan('dev'));
//Acts as router to present static files
app.use(express.static(path.join(__dirname, 'public')));
//Parses incoming requests with json type and is based on body parser
app.use(express.json());
//Parses incoming requests with urlencoded payloads and is based on body parser
app.use(express.urlencoded({extended : false}));

//Set port
app.set('port', process.env.PORT || 8080);
//Set template engine for html
app.set('view engine', 'html');
nunjucks.configure('views', {
    express : app,
    //When watch : true -> renders template engine again when html file changes
    watch: true,
});

//Set route path
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

//Use sequelize to connect express app and MySQL
sequelize.sync({force: false})
    .then(() => {
        console.log('Connected Database');
    })
    .catch((err) => {
        console.log(err);
    });

//Error handling middleware
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} Router does not exist`);
    error.status = 404;
    next(error);
});
//Render error.html file when error caused
//Pass the res.locals.message and res.locals.error variable together to be used by the nunjucks file
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

//Connect to port
app.listen(app.get('port'), () => {
    console.log('Connected on port', app.get('port'));
});