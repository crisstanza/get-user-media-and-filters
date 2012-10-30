(function() {
	//
	var logger = {
		log: true,
		console: {
			log: function(msg) {
				if ( logger.log ) {
					console.log(msg);
				}
			}
		}
	};
	//
	// exposes the logger object so it can be turned
	// on/off from external debugging console:
	window.logger = logger;
	//
	var transformations = [
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			newPixel.r = 255 - currentPixel.r;
			newPixel.g = 255 - currentPixel.g;
			newPixel.b = 255 - currentPixel.b;
			newPixel.a = currentPixel.a;
			return newPixel;
		},
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			var gray = fixColorChannel( (currentPixel.r + currentPixel.g + currentPixel.b) / 3 );
			newPixel.r = gray;
			newPixel.g = gray;
			newPixel.b = gray;
			newPixel.a = currentPixel.a;
			return newPixel;
		},
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			newPixel.r = currentPixel.r;
			newPixel.g = 0;
			newPixel.b = 0;
			newPixel.a = currentPixel.a;
			return newPixel;
		},
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			newPixel.r = 0;
			newPixel.g = currentPixel.g;
			newPixel.b = 0;
			newPixel.a = currentPixel.a;
			return newPixel;
		},
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			newPixel.r = 0;
			newPixel.g = 0;
			newPixel.b = currentPixel.b;
			newPixel.a = currentPixel.a;
			return newPixel;
		},
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			newPixel.r = currentPixel.r;
			newPixel.g = currentPixel.g;
			newPixel.b = 0;
			newPixel.a = currentPixel.a;
			return newPixel;
		},
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			newPixel.r = currentPixel.r;
			newPixel.g = 0;
			newPixel.b = currentPixel.b;
			newPixel.a = currentPixel.a;
			return newPixel;
		},
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			newPixel.r = 0;
			newPixel.g = currentPixel.g;
			newPixel.b = currentPixel.b;
			newPixel.a = currentPixel.a;
			return newPixel;
		},
		function (currentPixel) {
			var newPixel = { r: undefined, g: undefined, b: undefined, a: undefined };
			newPixel.r = fixColorChannel(currentPixel.r * 0.393 + currentPixel.g * 0.769 + currentPixel.g * 0.189);
			newPixel.g = fixColorChannel(currentPixel.r * 0.349 + currentPixel.g * 0.686 + currentPixel.g * 0.168);
			newPixel.b = fixColorChannel(currentPixel.r * 0.272 + currentPixel.g * 0.534 + currentPixel.g * 0.131);
			newPixel.a = currentPixel.a;
			return newPixel;
		}
	];
	//
	function transformPixel(currentPixel, n) {
		return transformations[n - 1](currentPixel);
	}
	//
	function fixColorChannel(value) {
		if ( value < 0 ) {
			return 0;
		} else if ( value > 255 ) {
			return 255;
		} else {
			return parseInt(value);
		}
	}
	//
	function refreshCanvas(n, myVideo) {
		var canvas = $('#canvas_'+n)[0];
		var context = canvas.getContext('2d');
		setInterval(function() {
			context.drawImage(myVideo, 0, 0, canvas.width, canvas.height);
			var data = context.getImageData(0, 0, canvas.width, canvas.height);
			for ( var i = 0 ; i < data.data.length ; i+=4 ) {
				var currentPixel = {
					r: data.data[i + 0],
					g: data.data[i + 1],
					b: data.data[i + 2],
					a: data.data[i + 3],
				}
				var newPixel = transformPixel(currentPixel, n);
				data.data[i + 0] = newPixel.r;
				data.data[i + 1] = newPixel.g;
				data.data[i + 2] = newPixel.b;
				data.data[i + 3] = newPixel.a;
			}
			//
			// var x = Math.round(canvas.width / 4 );
			// var y = Math.round(canvas.height / 1.5);
			//
			// var i = y*data.width*4 + x*4;
			// data.data[i + 0] = 255;
			// data.data[i + 1] = 0;
			// data.data[i + 2] = 0;
			// data.data[i + 3] = 255;
			//
			context.putImageData(data, 0, 0);
		}, 100);
	}
	//
	function init() {
		//
		logger.console.log('init()');
		//
		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		//
		navigator.getUserMedia(
			{ video: true, audio: false },
			function(localMediaStream) {
				var myVideo = $('#my_video')[0];
				myVideo.src = window.URL.createObjectURL(localMediaStream);
				var length = transformations.length;
				for ( var n = 1 ; n <= length ; n++ ) {
					refreshCanvas(n, myVideo);
				}
			},
			function(exc) {
				logger.console.log(exc);
			}
		);
	}
	//
	$(document).ready(init);
	//
})();