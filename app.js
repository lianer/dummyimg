var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', require('./routes/index'))

// catch 404
app.use(function(req, res, next) {
	var err = new Error('Not Found')
	err.status = 404
	res.redirect('/')
})

// catch error
app.use(function(err, req, res, next) {
	console.log(err)
	res.status(err.status || 500)
	res.end('error')
})

module.exports = app
