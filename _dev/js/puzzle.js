/*jshint smarttabs:true, laxbreak:true, laxcomma:true */

/**
 * Dependencies : Block
 **/
(function ( Block ) {
	'use strict';
	
	/**
	 * PUZZLES
	 * -
	 * Array containing 25 puzzles.
	 * Each puzzle contains an array of several Blocks
	 **/
	var puzzle = window.puzzle = [
	
		// 1
		{
			parMoves: 8,
			blocks: [
				new Block( 2, 1, 2, 'h', true )
			  , new Block( 0, 0, 2, 'h', false )
			  , new Block( 0, 5, 3, 'v', false )
			  , new Block( 0, 3, 3, 'v', false )
			  , new Block( 1, 0, 3, 'v', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 4, 4, 2, 'h', false )
			  , new Block( 5, 3, 3, 'h', false )
			]
		},

		// 2
		{
			parMoves: 14,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 2, 3, 3, 'v', false )
			  , new Block( 3, 1, 2, 'h', false )
			  , new Block( 3, 5, 3, 'v', false )
			  , new Block( 4, 1, 2, 'v', false )
			  , new Block( 5, 2, 2, 'h', false )
			]
		},
		
		// 3
		{
			parMoves: 12,
			blocks: [
				new Block( 2, 1, 2, 'h', true )
			  , new Block( 0, 0, 3, 'v', false )
			  , new Block( 3, 0, 3, 'h', false )
			  , new Block( 0, 1, 3, 'h', false )
			  , new Block( 0, 4, 2, 'h', false )
			  , new Block( 4, 2, 2, 'v', false )
			  , new Block( 4, 3, 3, 'h', false )
			  , new Block( 1, 5, 3, 'v', false )
			]
		},
		
		// 4
		{
			parMoves: 9,
			blocks: [
				new Block( 2, 1, 2, 'h', true )
			  , new Block( 0, 0, 3, 'v', false )
			  , new Block( 0, 3, 3, 'v', false )
			  , new Block( 3, 2, 2, 'v', false )
			  , new Block( 3, 3, 3, 'h', false )
			  , new Block( 5, 2, 3, 'h', false )
			  , new Block( 4, 5, 2, 'v', false )
			]
		},
		
		// 5
		{
			parMoves: 9,
			blocks: [
				new Block( 2, 1, 2, 'h', true )
			  , new Block( 0, 0, 2, 'h', false )
			  , new Block( 0, 3, 2, 'v', false )
			  , new Block( 1, 0, 2, 'h', false )
			  , new Block( 1, 4, 3, 'v', false )
			  , new Block( 1, 5, 3, 'v', false )
			  , new Block( 2, 3, 3, 'v', false )
			  , new Block( 3, 0, 2, 'h', false )
			  , new Block( 3, 2, 2, 'v', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 5, 3, 3, 'h', false )
			]
		},

		// 6
		{
			parMoves: 12,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 0, 1, 2, 'v', false )
			  , new Block( 0, 2, 2, 'h', false )
			  , new Block( 0, 4, 2, 'h', false )
			  , new Block( 1, 3, 2, 'v', false )
			  , new Block( 1, 4, 2, 'h', false )
			  , new Block( 2, 4, 3, 'v', false )
			  , new Block( 2, 5, 2, 'v', false )
			  , new Block( 3, 0, 3, 'v', false )
			  , new Block( 3, 1, 3, 'h', false )
			  , new Block( 4, 2, 2, 'v', false )
			  , new Block( 4, 5, 2, 'v', false )
			]
		},

		// 7
		{
			parMoves: 17,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 0, 0, 2, 'v', false )
			  , new Block( 0, 1, 2, 'h', false )
			  , new Block( 0, 5, 3, 'v', false )
			  , new Block( 1, 2, 3, 'v', false )
			  , new Block( 3, 3, 3, 'h', false )
			  , new Block( 4, 4, 2, 'v', false )
			  , new Block( 5, 0, 3, 'h', false )
			]
		},

		// 8
		{
			parMoves: 17,
			blocks: [
				new Block( 2, 2, 2, 'h', true )
			  , new Block( 0, 0, 2, 'h', false )
			  , new Block( 0, 2, 2, 'v', false )
			  , new Block( 1, 4, 2, 'h', false )
			  , new Block( 2, 0, 2, 'v', false )
			  , new Block( 2, 1, 2, 'v', false )
			  , new Block( 2, 4, 2, 'v', false )
			  , new Block( 2, 5, 2, 'v', false )
			  , new Block( 3, 2, 2, 'h', false )
			  , new Block( 4, 2, 2, 'v', false )
			  , new Block( 4, 4, 2, 'h', false )
			  , new Block( 5, 0, 2, 'h', false )
			]
		},

		// 9
		{
			parMoves: 11,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 0, 1, 2, 'h', false )
			  , new Block( 0, 3, 2, 'h', false )
			  , new Block( 0, 5, 2, 'v', false )
			  , new Block( 1, 4, 2, 'v', false )
			  , new Block( 2, 5, 3, 'v', false )
			  , new Block( 3, 0, 2, 'h', false )
			  , new Block( 3, 2, 2, 'v', false )
			  , new Block( 3, 4, 2, 'v', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 5, 1, 2, 'h', false )
			  , new Block( 5, 3, 3, 'h', false )
			]
		},

		// 10
		{
			parMoves: 8,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 0, 2, 2, 'v', false )
			  , new Block( 0, 3, 3, 'h', false )
			  , new Block( 1, 3, 2, 'v', false )
			  , new Block( 2, 5, 3, 'v', false )
			  , new Block( 3, 1, 2, 'h', false )
			  , new Block( 3, 3, 2, 'h', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 4, 1, 2, 'v', false )
			  , new Block( 4, 2, 2, 'h', false )
			  , new Block( 5, 4, 2, 'h', false )
			]
		},

		// 11
		{
			parMoves: 22,
			blocks: [
				new Block( 2, 2, 2, 'h', true )
			  , new Block( 0, 2, 2, 'v', false )
			  , new Block( 0, 3, 2, 'h', false )
			  , new Block( 1, 4, 2, 'v', false )
			  , new Block( 2, 1, 2, 'v', false )
			  , new Block( 3, 2, 2, 'h', false )
			  , new Block( 3, 4, 2, 'v', false )
			  , new Block( 4, 1, 3, 'h', false )
			]
		},

		// 12
		{
			parMoves: 24,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 0, 0, 2, 'v', false )
			  , new Block( 0, 1, 3, 'h', false )
			  , new Block( 1, 2, 2, 'h', false )
			  , new Block( 1, 4, 2, 'h', false )
			  , new Block( 2, 2, 2, 'v', false )
			  , new Block( 3, 0, 2, 'h', false )
			  , new Block( 3, 3, 3, 'v', false )
			  , new Block( 4, 0, 3, 'h', false )
			  , new Block( 4, 4, 2, 'v', false )
			  , new Block( 4, 5, 2, 'v', false )
			  , new Block( 5, 0, 3, 'h', false )
			]
		},

		// 13
		{
			parMoves: 23,
			blocks: [
				new Block( 2, 2, 2, 'h', true )
			  , new Block( 0, 1, 2, 'h', false )
			  , new Block( 0, 3, 2, 'h', false )
			  , new Block( 1, 0, 2, 'h', false )
			  , new Block( 1, 2, 2, 'h', false )
			  , new Block( 1, 4, 3, 'v', false )
			  , new Block( 1, 5, 3, 'v', false )
			  , new Block( 2, 0, 3, 'v', false )
			  , new Block( 2, 1, 3, 'v', false )
			  , new Block( 3, 2, 2, 'v', false )
			  , new Block( 3, 3, 2, 'v', false )
			  , new Block( 4, 4, 2, 'h', false )
			  , new Block( 5, 1, 2, 'h', false )
			  , new Block( 5, 3, 2, 'h', false )
			]
		},

		// 14
		{
			parMoves: 22,
			blocks: [
				new Block( 2, 1, 2, 'h', true )
			  , new Block( 2, 3, 2, 'h', true )
			  , new Block( 0, 0, 3, 'v', false )
			  , new Block( 0, 1, 3, 'h', false )
			  , new Block( 0, 4, 2, 'h', false )
			  , new Block( 1, 5, 3, 'v', false )
			  , new Block( 3, 0, 3, 'h', false )
			  , new Block( 4, 2, 2, 'v', false )
			  , new Block( 4, 3, 3, 'h', false )
			]
		},

		// 15
		// Hard puzzles begin
		{
			parMoves: 0,
			blocks: [
				new Block( 2, 1, 2, 'h', true )
			  , new Block( 0, 0, 2, 'h', false )
			  , new Block( 0, 2, 2, 'v', false )
			  , new Block( 0, 4, 2, 'h', false )
			  , new Block( 1, 0, 2, 'h', false )
			  , new Block( 1, 5, 3, 'v', false )
			  , new Block( 2, 0, 3, 'v', false )
			  , new Block( 2, 4, 2, 'v', false )
			  , new Block( 3, 1, 3, 'h', false )
			  , new Block( 4, 1, 2, 'v', false )
			  , new Block( 4, 3, 2, 'v', false )
			  , new Block( 4, 4, 2, 'h', false )
			  , new Block( 5, 4, 2, 'h', false )
			]
		},

		// 16
		{
			parMoves: 25,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 2, 2, 2, 'h', true )
			  , new Block( 0, 1, 2, 'h', false )
			  , new Block( 0, 3, 2, 'h', false )
			  , new Block( 0, 5, 2, 'v', false )
			  , new Block( 1, 4, 2, 'v', false )
			  , new Block( 2, 5, 3, 'v', false )
			  , new Block( 3, 0, 2, 'h', false )
			  , new Block( 3, 2, 2, 'v', false )
			  , new Block( 3, 4, 2, 'v', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 5, 1, 2, 'h', false )
			  , new Block( 5, 3, 3, 'h', false )
			]
		},

		// 17
		{
			parMoves: 25,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 2, 3, 2, 'h', true )
			  , new Block( 0, 0, 2, 'v', false )
			  , new Block( 0, 1, 2, 'h', false )
			  , new Block( 0, 3, 2, 'v', false )
			  , new Block( 1, 1, 2, 'h', false )
			  , new Block( 1, 4, 2, 'h', false )
			  , new Block( 2, 2, 3, 'v', false )
			  , new Block( 2, 5, 3, 'v', false )
			  , new Block( 3, 3, 2, 'h', false )
			  , new Block( 4, 3, 2, 'v', false )
			  , new Block( 5, 1, 2, 'h', false )
			  , new Block( 5, 4, 2, 'h', false )
			]
		},

		// 18
		{
			parMoves: 0,
			blocks: [
				new Block( 2, 1, 2, 'h', true )
			  , new Block( 0, 0, 2, 'h', false )
			  , new Block( 0, 2, 2, 'v', false )
			  , new Block( 0, 4, 2, 'h', false )
			  , new Block( 1, 0, 2, 'h', false )
			  , new Block( 1, 4, 3, 'v', false )
			  , new Block( 1, 5, 3, 'v', false )
			  , new Block( 2, 0, 3, 'v', false )
			  , new Block( 3, 1, 3, 'h', false )
			  , new Block( 4, 3, 2, 'v', false )
			  , new Block( 4, 4, 2, 'h', false )
			  , new Block( 5, 0, 2, 'h', false )
			  , new Block( 5, 4, 2, 'h', false )
			]
		},

		// 19
		{
			parMoves: 31,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 2, 3, 2, 'h', true )
			  , new Block( 0, 1, 2, 'v', false )
			  , new Block( 0, 2, 3, 'v', false )
			  , new Block( 0, 3, 3, 'h', false )
			  , new Block( 2, 5, 2, 'v', false )
			  , new Block( 3, 0, 2, 'v', false )
			  , new Block( 3, 1, 2, 'h', false )
			  , new Block( 3, 3, 2, 'v', false )
			  , new Block( 3, 4, 2, 'v', false )
			  , new Block( 4, 5, 2, 'v', false )
			  , new Block( 5, 0, 2, 'h', false )
			  , new Block( 5, 2, 3, 'h', false )
			]
		},

		// 20
		{
			parMoves: 32,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 2, 3, 2, 'h', true )
			  , new Block( 0, 1, 2, 'v', false )
			  , new Block( 0, 2, 3, 'v', false )
			  , new Block( 1, 4, 2, 'h', false )
			  , new Block( 2, 5, 3, 'v', false )
			  , new Block( 3, 0, 2, 'v', false )
			  , new Block( 3, 1, 2, 'h', false )
			  , new Block( 3, 3, 2, 'h', false )
			  , new Block( 4, 1, 2, 'h', false )
			  , new Block( 4, 3, 2, 'v', false )
			  , new Block( 5, 4, 2, 'h', false )
			]
		},

		// 21
		// very hard begins
		{
			parMoves: 34,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 0, 0, 2, 'v', false )
			  , new Block( 0, 1, 2, 'v', false )
			  , new Block( 3, 0, 2, 'v', false )
			  , new Block( 0, 2, 2, 'h', false )
			  , new Block( 0, 4, 2, 'h', false )
			  , new Block( 1, 2, 3, 'h', false )
			  , new Block( 1, 5, 3, 'v', false )
			  , new Block( 2, 2, 2, 'v', false )
			  , new Block( 3, 3, 2, 'h', false )
			  , new Block( 4, 1, 2, 'h', false )
			  , new Block( 4, 3, 2, 'v', false )
			  , new Block( 5, 4, 2, 'h', false )
			]
		},

		// 22
		{
			parMoves: 33,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 2, 2, 2, 'h', true )
			  , new Block( 0, 1, 2, 'h', false )
			  , new Block( 0, 3, 2, 'h', false )
			  , new Block( 0, 5, 3, 'v', false )
			  , new Block( 1, 1, 2, 'h', false )
			  , new Block( 1, 4, 2, 'v', false )
			  , new Block( 3, 0, 2, 'h', false )
			  , new Block( 3, 2, 2, 'v', false )
			  , new Block( 3, 4, 2, 'h', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 4, 3, 3, 'h', false )
			  , new Block( 5, 1, 3, 'h', false )
			  , new Block( 5, 4, 2, 'h', false )
			]
		},

		// 23
		{
			parMoves: 31, // can prolly be improved
			blocks: [
				new Block( 2, 1, 2, 'h', true )
			  , new Block( 0, 2, 2, 'v', false )
			  , new Block( 0, 3, 3, 'h', false )
			  , new Block( 1, 0, 2, 'v', false )
			  , new Block( 1, 3, 3, 'v', false )
			  , new Block( 1, 4, 2, 'h', false )
			  , new Block( 3, 1, 2, 'v', false )
			  , new Block( 3, 4, 2, 'h', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 4, 2, 2, 'h', false )
			  , new Block( 4, 5, 2, 'v', false )
			  , new Block( 5, 1, 3, 'h', false )
			]
		},

		// 24
		{
			parMoves: 0,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 2, 3, 2, 'h', true )
			  , new Block( 0, 0, 2, 'h', false )
			  , new Block( 0, 2, 3, 'h', false )
			  , new Block( 0, 5, 3, 'v', false )
			  , new Block( 1, 0, 2, 'h', false )
			  , new Block( 1, 2, 3, 'v', false )
			  , new Block( 3, 3, 2, 'v', false )
			  , new Block( 3, 4, 2, 'h', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 4, 1, 2, 'h', false )
			  , new Block( 5, 1, 2, 'h', false )
			  , new Block( 5, 3, 2, 'h', false )
			]
		},

		// 25
		{
			parMoves: 51,
			blocks: [
				new Block( 2, 3, 2, 'h', true )
			  , new Block( 0, 0, 3, 'v', false )
			  , new Block( 0, 1, 2, 'h', false )
			  , new Block( 0, 4, 2, 'v', false )
			  , new Block( 1, 1, 2, 'v', false )
			  , new Block( 1, 2, 2, 'v', false )
			  , new Block( 1, 5, 3, 'v', false )
			  , new Block( 3, 0, 3, 'h', false )
			  , new Block( 3, 3, 2, 'v', false )
			  , new Block( 4, 2, 2, 'v', false )
			  , new Block( 4, 4, 2, 'h', false )
			  , new Block( 5, 0, 2, 'h', false )
			  , new Block( 5, 3, 2, 'h', false )
			]
		}

	];

}( window.Block ));