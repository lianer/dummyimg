var os = require('os')
var imageMagickPath = os.platform() === 'win32' ? 'D:/ImageMagick-7.0.3-Q16/' : ''

module.exports = {
	imageMagickPath: imageMagickPath
}