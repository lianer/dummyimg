var fs = require('fs')
var path = require('path')
var gm = require('gm').subClass({
	imageMagick: true,
	appPath: 'D:/ImageMagick-7.0.3-Q16/',
})

var width = 750
var height = 88

// 一个英文字母的宽度与字号的比值
var fontClientWidthRatio = 0.63
// 一个英文字母的高度与字号的比值
var fontClientHeightRatio = 1

// 描述文字相对宽度
var textRelativeWidth = ((width.toFixed() + height.toFixed()).length + 1) * fontClientWidthRatio
// 描述文字相对高度
var textRelativeHeight = fontClientHeightRatio
// 描述文字宽高相对比
var textRelativeRatio = textRelativeWidth / textRelativeHeight
// 画布宽高比
var canvasRatio = width / height

var fontSize = 100
var fontScale = 0.5
if (canvasRatio > textRelativeRatio) {
	// 如果画布宽高比更大，形状更扁，则按画布高为基准计算字号
	fontSize = height / textRelativeHeight
} else {
	// 否则按画布宽为基准计算字号
	fontSize = width / textRelativeWidth
}
fontSize = fontSize * fontScale

gm(width, height, '#ccc')
	// Center the text
	.gravity('Center')
	// Background colour
	.fill('#666')
	// Scale font-size according to image dimensions
	.pointSize(fontSize)
	// 描边
	.stroke("#666")
	// 字体字号
	.font(path.join(__dirname, "../data/font/mplus-1c-light.ttf"))
	// 绘制文字
	.drawText(0, 0, `${width}X${height}`)
	// 写入文件
	.write('a.png', function (err, stdout, stderr, command) {
		if(err){
			throw err
		}
		console.log(command)
	})
	// 创建流
	// .stream('png', function (err, stdout, stderr) {
	// 	if(err){
	// 		throw err
	// 	}
	// 	var writeStream = fs.createWriteStream('a.png')
	// 	stdout.pipe(writeStream)
	// 	stderr.pipe(process.stdout)
	// })
