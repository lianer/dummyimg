var fs = require('fs')
var path = require('path')
var util = require('util')
var express = require('express')
var router = express.Router()
var convert = require('../lib/convert.js')

var CACHE_ROOT = path.join(__dirname, '../cache')

if(!fs.existsSync(CACHE_ROOT)){
	fs.mkdirSync(CACHE_ROOT)
}

/* GET home page. */
router.get('/', function(req, res, next) {
	var host = 'http://' + req.headers['host']
	fs.readFile(path.join(__dirname, '../views/index.html'), function (err, content) {
		var transfer = content.toString().split("${host}").join(host)
		res.header('Content-Type', 'text/html')
		res.send(transfer)
	})
})

router.get('/snippet', function (req, res, next) {
	res.attachment('dummyimg.sublime-snippet')
	fs.createReadStream(path.join(__dirname, '../data/dummyimg.sublime-snippet')).pipe(res)
})

router.get(/^\/(?:(\d{1,4})x(\d{1,4}))\/?/i, function (req, res, next) {
	var width = req.params[0]
	var height = req.params[1]
	var bg = req.query.bg || 'ccc'
	var fg = req.query.fg || '666'

	// 目标文件位置
	var outputPath = path.join(CACHE_ROOT, `${width}x${height}_${bg}_${fg}.png`)

	fs.exists(outputPath, function (exists) {
		// 如果已经存在该文件，则直接响应文件
		if (exists) {
			res.header('Content-Type', 'image/png')
			fs.createReadStream(outputPath).pipe(res)
			return
		}
		convert(width, height, bg, fg, function (err, stdout, stderr, command) {
			if(err){
				console.log(err)
				return next(err)
			}

			// 写入文件到目标位置
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

module.exports = router
