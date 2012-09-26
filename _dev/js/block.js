/* jshint smarttabs:true, laxbreak:true, laxcomma:true */

/**
 * Dependencies : board
 **/
(function ( board ) {
	'use strict';

	/**
	 * BLOCK CONSTRUCTOR
	 * -
	 * @param {number} row, column	- row and column of the top and left of the Block
	 * @param {number} size			- size of the Block, always 2 or 3
	 * @param {string} dir			- 'h' or 'v', direction in which the Block is spread out
	 * @param {boolean} isKey		- is the Block the key Block
	 **/
	var Block = function ( row, col, size, dir, isKey ) {
		
		var largeSideSize = board.blockSize * size
		  , thinSideSize = board.blockSize
		  , rand = Math.floor(Math.random() * 3) + 1
		;

		if ( isKey ) {
			rand = 4;
		}

		this.dir	= dir;
		this.isKey	= isKey;
		this.top	= row * board.blockSize;
		this.left	= col * board.blockSize;

		this.w		= ( dir === 'h' ) ? largeSideSize : thinSideSize;
		this.h		= ( dir === 'h' ) ? thinSideSize : largeSideSize;
		this.styles	= 'width:' + this.w + 'px; height:' + this.h + 'px; top:' + this.top + 'px; left:' + this.left + 'px;';
		this.classAttr	= 'row-' + row + ' col-' + col + ' block dir-' + dir + ' size-' + size + ' delay-' + rand + ' ' + (( isKey ) ? 'key' : '');
	};

	window.Block = Block;

}( window.board ));