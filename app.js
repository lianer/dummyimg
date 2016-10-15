var fs = require('fs')
var path = require('path')
var restify = require('restify')
var server = restify.createServer({
	name: 'restify',
	version: '1.0.0'
})
var convert = require('./convert.js')

server.use(restify.queryParser())

server.use(function (req, res, next) {
	res.header('X-Powerd-By', 'restify')
	next()
})

server.get('/', function (req, res, next) {
	// 尺寸必须是字符串
	var width = '750'
	var height = '320'
	var bg = 'ccc'
	var fg = '666'

	var outputPath = path.join(__dirname, `./cache/${width}x${height}_${bg}_${fg}.png`)
	fs.exists(outputPath, function (exists) {
		if (exists) {
			res.header('Content-Type', 'image/png')
			fs.createReadStream(outputPath).pipe(res)
			// res.send()
			return
		}
		convert(width, height, bg, fg, function (err, stdout, stderr, command) {
			if(err){
				return next(err)
			}

			var cacheStream = fs.createWriteStream(outputPath)
			stdout.pipe(cacheStream)

			res.header('Content-Type', 'image/png')
			// Pipe image data stream to the response
			stdout.pipe(res)

			// Pipe any stdout data to the process.stdout
			// so that it can be retrieved in the logs
			stderr.pipe(process.stdout)
		})
	})
})

server.get(/^\/(?:(\d{1,4})x(\d{1,4}))\/?/i, function (req, res, next) {
	var width = req.params[0]
	var height = req.params[1]
	var bg = req.params.bg || 'ccc'
	var fg = req.params.fg || '666'

	var outputPath = path.join(__dirname, `./cache/${width}x${height}_${bg}_${fg}.png`)

	fs.exists(outputPath, function (exists) {
		if (exists) {
			res.header('Content-Type', 'image/png')
			fs.createReadStream(outputPath).pipe(res)
			return
		}
		convert(width, height, bg, fg, function (err, stdout, stderr, command) {
			if(err){
				return next(err)
			}

			var cacheStream = fs.createWriteStream(outputPath)
			stdout.pipe(cacheStream)

			res.header('Content-Type', 'image/png')
			// Pipe image data stream to the response
			stdout.pipe(res)

			// Pipe any stdout data to the process.stdout
			// so that it can be retrieved in the logs
			stderr.pipe(process.stdout)
		})
	})
})

server.on('uncaughtException', function (req, res, route, err) {
	console.log(err)
	res.send(new restify.InternalError('未知错误'))
})

server.listen(process.env.PORT || '4006', function () {
	console.log(`server listen at`, server.name, server.url)
})
