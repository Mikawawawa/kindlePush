const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multiparty = require('connect-multiparty');
const urllog = require("./midware/urllog")
const router = require('./route');

const domin = '/'

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(urllog)

app.use(multiparty({
    uploadDir: './public/upload',
    keepExtensions: true
}));
app.use(`${domin}file`, router);

app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    let status = err.message == "Not Found" ? 404 : 500
    res.status(status);
    res.send({
        code: status,
        info: err.message
    })
});

const server = app.listen(8202, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('HTTP:start listening at http://%s:%s', host, port);
});