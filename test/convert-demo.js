var path = require('path')
var gm = require('gm').subClass({
	imageMagick: true,  // 使用imageMagick，默认使用GraphicsMagick（imageMagick的分支）
	appPath: 'D:/ImageMagick-7.0.3-Q16/',  // Windows下面需要指定ImageMagick安装路径，与系统自带的命令有冲突
})

gm(300, 300, '#ccc')  // 画布大小、背景色
	.gravity('Center')  // 文字上下、左右居中
	.pointSize(40)  // 文字大小
	.fill('#666')  // 填充颜色
	.drawText(0, 0, 'Hello Lianer')
	.write('a.png', function (err, stdout, stderr, command) {
		if(err){
			throw err
		}
		console.log(command)
	})