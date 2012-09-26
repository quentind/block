/*jshint smarttabs:true, laxbreak:true, laxcomma:true */
(function () {
	'use strict';

	/**
	 * BOARD SETUP
	 **/
	var board = {
		blockSize : 80,
		el : $('#play')[0],
		size : 480,
		offset : {
			left : null,
			top : null
		}
	};

	board.offset.left = board.el.offsetLeft;
	board.offset.top = board.el.offsetTop;

	window.board = board;

}());