var fs = require('fs')
var path = require('path')
var config = require('../dimg-config.js')
var gm = require('gm').subClass({
	imageMagick: true,
	appPath: config.imageMagickPath
})

module.exports = function (width, height, bg, fg, streamHandler) {
	// 一个英文字母的宽度与字号的比值
	var fontClientWidthRatio = 0.63
	// 一个英文字母的高度与字号的比值
	var fontClientHeightRatio = 1

	// 描述文字相对宽度
	var textRelativeWidth = (width.length + height.length + 1) * fontClientWidthRatio
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

	// 字体 http://mplus-fonts.osdn.jp
	var fontPath = path.join(__dirname, '../data/font/mplus-1c-light.ttf')

	gm(width, height, `#${bg}`)
		// .setFormat('PNG8')
		.bitdepth(4)
		// Center the text
		.gravity('Center')
		// Background colour
		.fill(`#${fg}`)
		// Scale font-size according to image dimensions
		.pointSize(fontSize)
		// 描边
		// .stroke(fg)
		// 字体字号
		.font(fontPath)
		// 绘制文字
		.drawText(0, 0, `${width}X${height}`)
		.stream('png', streamHandler)
}
