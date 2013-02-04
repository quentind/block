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
			parMoves: 9,
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
			parMoves: 0,
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

	//console.log(puzzle[24]);


	/*
	// 1
	puzzle[0][m] = 8;
	puzzle[0][0] = new Block( 2, 1, 2, 'h', true ),
	puzzle[0][1] = new Block( 0, 0, 2, 'h', false ),
	puzzle[0][2] = new Block( 0, 5, 3, 'v', false ),
	puzzle[0][3] = new Block( 0, 3, 3, 'v', false ),
	puzzle[0][4] = new Block( 1, 0, 3, 'v', false ),
	puzzle[0][5] = new Block( 4, 0, 2, 'v', false ),
	puzzle[0][6] = new Block( 4, 4, 2, 'h', false ),
	puzzle[0][7] = new Block( 5, 3, 3, 'h', false ),

	// 2
	puzzle[1][m] = 14;
	puzzle[1][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[1][1] = new Block( 2, 3, 3, 'v', false ),
	puzzle[1][2] = new Block( 3, 1, 2, 'h', false ),
	puzzle[1][3] = new Block( 3, 5, 3, 'v', false ),
	puzzle[1][4] = new Block( 4, 1, 2, 'v', false ),
	puzzle[1][5] = new Block( 5, 2, 2, 'h', false ),

	// 3
	puzzle[2][m] = 12;
	puzzle[2][0] = new Block( 2, 1, 2, 'h', true ),
	puzzle[2][1] = new Block( 0, 0, 3, 'v', false ),
	puzzle[2][2] = new Block( 3, 0, 3, 'h', false ),
	puzzle[2][3] = new Block( 0, 1, 3, 'h', false ),
	puzzle[2][4] = new Block( 0, 4, 2, 'h', false ),
	puzzle[2][5] = new Block( 4, 2, 2, 'v', false ),
	puzzle[2][6] = new Block( 4, 3, 3, 'h', false ),
	puzzle[2][7] = new Block( 1, 5, 3, 'v', false ),

	// 4
	puzzle[3][0] = new Block( 2, 1, 2, 'h', true ),
	puzzle[3][1] = new Block( 0, 0, 3, 'v', false ),
	puzzle[3][2] = new Block( 0, 3, 3, 'v', false ),
	puzzle[3][3] = new Block( 3, 2, 2, 'v', false ),
	puzzle[3][4] = new Block( 3, 3, 3, 'h', false ),
	puzzle[3][5] = new Block( 5, 2, 3, 'h', false ),
	puzzle[3][6] = new Block( 4, 5, 2, 'v', false ),

	// 5
	puzzle[4][0] = new Block( 2, 1, 2, 'h', true ),
	puzzle[4][1] = new Block( 0, 0, 2, 'h', false ),
	puzzle[4][2] = new Block( 0, 3, 2, 'v', false ),
	puzzle[4][3] = new Block( 1, 0, 2, 'h', false ),
	puzzle[4][4] = new Block( 1, 4, 3, 'v', false ),
	puzzle[4][5] = new Block( 1, 5, 3, 'v', false ),
	puzzle[4][6] = new Block( 2, 3, 3, 'v', false ),
	puzzle[4][7] = new Block( 3, 0, 2, 'h', false ),
	puzzle[4][8] = new Block( 3, 2, 2, 'v', false ),
	puzzle[4][9] = new Block( 4, 0, 2, 'v', false ),
	puzzle[4][10] = new Block( 5, 3, 3, 'h', false ),

	// 6
	puzzle[5][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[5][1] = new Block( 0, 1, 2, 'v', false ),
	puzzle[5][2] = new Block( 0, 2, 2, 'h', false ),
	puzzle[5][3] = new Block( 0, 4, 2, 'h', false ),
	puzzle[5][4] = new Block( 1, 3, 2, 'v', false ),
	puzzle[5][5] = new Block( 1, 4, 2, 'h', false ),
	puzzle[5][6] = new Block( 2, 4, 3, 'v', false ),
	puzzle[5][7] = new Block( 2, 5, 2, 'v', false ),
	puzzle[5][8] = new Block( 3, 0, 3, 'v', false ),
	puzzle[5][9] = new Block( 3, 1, 3, 'h', false ),
	puzzle[5][10] = new Block( 4, 2, 2, 'v', false ),
	puzzle[5][11] = new Block( 4, 5, 2, 'v', false ),

	// 7
	puzzle[6][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[6][1] = new Block( 0, 0, 2, 'v', false ),
	puzzle[6][2] = new Block( 0, 1, 2, 'h', false ),
	puzzle[6][3] = new Block( 0, 5, 3, 'v', false ),
	puzzle[6][4] = new Block( 1, 2, 3, 'v', false ),
	puzzle[6][5] = new Block( 3, 3, 3, 'h', false ),
	puzzle[6][6] = new Block( 4, 4, 2, 'v', false ),
	puzzle[6][7] = new Block( 5, 0, 3, 'h', false ),

	// 8
	puzzle[7][0] = new Block( 2, 2, 2, 'h', true ),
	puzzle[7][1] = new Block( 0, 0, 2, 'h', false ),
	puzzle[7][2] = new Block( 0, 2, 2, 'v', false ),
	puzzle[7][3] = new Block( 1, 4, 2, 'h', false ),
	puzzle[7][4] = new Block( 2, 0, 2, 'v', false ),
	puzzle[7][5] = new Block( 2, 1, 2, 'v', false ),
	puzzle[7][6] = new Block( 2, 4, 2, 'v', false ),
	puzzle[7][7] = new Block( 2, 5, 2, 'v', false ),
	puzzle[7][8] = new Block( 3, 2, 2, 'h', false ),
	puzzle[7][9] = new Block( 4, 2, 2, 'v', false ),
	puzzle[7][10] = new Block( 4, 4, 2, 'h', false ),
	puzzle[7][11] = new Block( 5, 0, 2, 'h', false ),

	// 9
	puzzle[8][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[8][1] = new Block( 0, 0, 2, 'v', false ),
	puzzle[8][2] = new Block( 0, 1, 3, 'h', false ),
	puzzle[8][3] = new Block( 1, 2, 2, 'h', false ),
	puzzle[8][4] = new Block( 1, 4, 2, 'h', false ),
	puzzle[8][5] = new Block( 2, 2, 2, 'v', false ),
	puzzle[8][6] = new Block( 3, 0, 2, 'h', false ),
	puzzle[8][7] = new Block( 3, 3, 3, 'v', false ),
	puzzle[8][8] = new Block( 4, 0, 3, 'h', false ),
	puzzle[8][9] = new Block( 4, 4, 2, 'v', false ),
	puzzle[8][10] = new Block( 4, 5, 2, 'v', false ),
	puzzle[8][11] = new Block( 5, 0, 3, 'h', false ),

	// 10
	puzzle[9][0] = new Block( 2, 2, 2, 'h', true ),
	puzzle[9][1] = new Block( 0, 2, 2, 'v', false ),
	puzzle[9][2] = new Block( 0, 3, 2, 'h', false ),
	puzzle[9][3] = new Block( 1, 4, 2, 'v', false ),
	puzzle[9][4] = new Block( 2, 1, 2, 'v', false ),
	puzzle[9][5] = new Block( 3, 2, 2, 'h', false ),
	puzzle[9][6] = new Block( 3, 4, 2, 'v', false ),
	puzzle[9][7] = new Block( 4, 1, 3, 'h', false ),

	// 11
	puzzle[10][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[10][1] = new Block( 0, 1, 2, 'h', false ),
	puzzle[10][2] = new Block( 0, 3, 2, 'h', false ),
	puzzle[10][3] = new Block( 0, 5, 2, 'v', false ),
	puzzle[10][4] = new Block( 1, 4, 2, 'v', false ),
	puzzle[10][5] = new Block( 2, 5, 3, 'v', false ),
	puzzle[10][6] = new Block( 3, 0, 2, 'h', false ),
	puzzle[10][7] = new Block( 3, 2, 2, 'v', false ),
	puzzle[10][8] = new Block( 3, 4, 2, 'v', false ),
	puzzle[10][9] = new Block( 4, 0, 2, 'v', false ),
	puzzle[10][10] = new Block( 5, 1, 2, 'h', false ),
	puzzle[10][11] = new Block( 5, 3, 3, 'h', false ),

	// 12 - great one
	puzzle[11][0] = new Block( 2, 2, 2, 'h', true ),
	puzzle[11][1] = new Block( 0, 1, 2, 'h', false ),
	puzzle[11][2] = new Block( 0, 3, 2, 'h', false ),
	puzzle[11][3] = new Block( 1, 0, 2, 'h', false ),
	puzzle[11][4] = new Block( 1, 2, 2, 'h', false ),
	puzzle[11][5] = new Block( 1, 4, 3, 'v', false ),
	puzzle[11][6] = new Block( 1, 5, 3, 'v', false ),
	puzzle[11][7] = new Block( 2, 0, 3, 'v', false ),
	puzzle[11][8] = new Block( 2, 1, 3, 'v', false ),
	puzzle[11][9] = new Block( 3, 2, 2, 'v', false ),
	puzzle[11][10] = new Block( 3, 3, 2, 'v', false ),
	puzzle[11][11] = new Block( 4, 4, 2, 'h', false ),
	puzzle[11][12] = new Block( 5, 1, 2, 'h', false ),
	puzzle[11][13] = new Block( 5, 3, 2, 'h', false ),

	// 13
	puzzle[12][0] = new Block( 2, 1, 2, 'h', true ),
	puzzle[12][1] = new Block( 2, 3, 2, 'h', true ),
	puzzle[12][2] = new Block( 0, 0, 3, 'v', false ),
	puzzle[12][3] = new Block( 0, 1, 3, 'h', false ),
	puzzle[12][4] = new Block( 0, 4, 2, 'h', false ),
	puzzle[12][5] = new Block( 1, 5, 3, 'v', false ),
	puzzle[12][6] = new Block( 3, 0, 3, 'h', false ),
	puzzle[12][7] = new Block( 4, 2, 2, 'v', false ),
	puzzle[12][8] = new Block( 4, 3, 3, 'h', false ),

	// 14
	puzzle[13][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[13][1] = new Block( 0, 2, 2, 'v', false ),
	puzzle[13][2] = new Block( 0, 3, 3, 'h', false ),
	puzzle[13][3] = new Block( 1, 3, 2, 'v', false ),
	puzzle[13][4] = new Block( 2, 5, 3, 'v', false ),
	puzzle[13][5] = new Block( 3, 0, 2, 'h', false ),
	puzzle[13][6] = new Block( 3, 3, 2, 'h', false ),
	puzzle[13][7] = new Block( 4, 0, 2, 'v', false ),
	puzzle[13][8] = new Block( 4, 1, 2, 'v', false ),
	puzzle[13][9] = new Block( 4, 2, 2, 'h', false ),
	puzzle[13][10] = new Block( 5, 2, 2, 'h', false ),

	// 15
	// Hard puzzles begin
	puzzle[14][0] = new Block( 2, 1, 2, 'h', true ),
	puzzle[14][1] = new Block( 0, 0, 2, 'h', false ),
	puzzle[14][2] = new Block( 0, 2, 2, 'v', false ),
	puzzle[14][3] = new Block( 0, 4, 2, 'h', false ),
	puzzle[14][4] = new Block( 1, 0, 2, 'h', false ),
	puzzle[14][5] = new Block( 1, 5, 3, 'v', false ),
	puzzle[14][6] = new Block( 2, 0, 3, 'v', false ),
	puzzle[14][7] = new Block( 2, 4, 2, 'v', false ),
	puzzle[14][8] = new Block( 3, 1, 3, 'h', false ),
	puzzle[14][9] = new Block( 4, 1, 2, 'v', false ),
	puzzle[14][10] = new Block( 4, 3, 2, 'v', false ),
	puzzle[14][11] = new Block( 4, 4, 2, 'h', false ),
	puzzle[14][12] = new Block( 5, 4, 2, 'h', false ),

	// 16
	puzzle[15][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[15][1] = new Block( 2, 2, 2, 'h', true ),
	puzzle[15][2] = new Block( 0, 1, 2, 'h', false ),
	puzzle[15][3] = new Block( 0, 3, 2, 'h', false ),
	puzzle[15][4] = new Block( 0, 5, 2, 'v', false ),
	puzzle[15][5] = new Block( 1, 4, 2, 'v', false ),
	puzzle[15][6] = new Block( 2, 5, 3, 'v', false ),
	puzzle[15][7] = new Block( 3, 0, 2, 'h', false ),
	puzzle[15][8] = new Block( 3, 2, 2, 'v', false ),
	puzzle[15][9] = new Block( 3, 4, 2, 'v', false ),
	puzzle[15][10] = new Block( 4, 0, 2, 'v', false ),
	puzzle[15][11] = new Block( 5, 1, 2, 'h', false ),
	puzzle[15][12] = new Block( 5, 3, 3, 'h', false ),

	// 17
	puzzle[16][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[16][1] = new Block( 2, 3, 2, 'h', true ),
	puzzle[16][2] = new Block( 0, 0, 2, 'v', false ),
	puzzle[16][3] = new Block( 0, 1, 2, 'h', false ),
	puzzle[16][4] = new Block( 0, 3, 2, 'v', false ),
	puzzle[16][5] = new Block( 1, 1, 2, 'h', false ),
	puzzle[16][6] = new Block( 1, 4, 2, 'h', false ),
	puzzle[16][7] = new Block( 2, 2, 3, 'v', false ),
	puzzle[16][8] = new Block( 2, 5, 3, 'v', false ),
	puzzle[16][9] = new Block( 3, 3, 2, 'h', false ),
	puzzle[16][10] = new Block( 4, 3, 2, 'v', false ),
	puzzle[16][11] = new Block( 5, 1, 2, 'h', false ),
	puzzle[16][12] = new Block( 5, 4, 2, 'h', false ),

	// 18
	puzzle[17][0] = new Block( 2, 1, 2, 'h', true ),
	puzzle[17][1] = new Block( 0, 0, 2, 'h', false ),
	puzzle[17][2] = new Block( 0, 2, 2, 'v', false ),
	puzzle[17][3] = new Block( 0, 4, 2, 'h', false ),
	puzzle[17][4] = new Block( 1, 0, 2, 'h', false ),
	puzzle[17][5] = new Block( 1, 4, 3, 'v', false ),
	puzzle[17][6] = new Block( 1, 5, 3, 'v', false ),
	puzzle[17][7] = new Block( 2, 0, 3, 'v', false ),
	puzzle[17][8] = new Block( 3, 1, 3, 'h', false ),
	puzzle[17][9] = new Block( 4, 3, 2, 'v', false ),
	puzzle[17][10] = new Block( 4, 4, 2, 'h', false ),
	puzzle[17][11] = new Block( 5, 0, 2, 'h', false ),
	puzzle[17][12] = new Block( 5, 4, 2, 'h', false ),

	// 19
	puzzle[18][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[18][1] = new Block( 2, 3, 2, 'h', true ),
	puzzle[18][2] = new Block( 0, 1, 2, 'v', false ),
	puzzle[18][3] = new Block( 0, 2, 3, 'v', false ),
	puzzle[18][4] = new Block( 0, 3, 3, 'h', false ),
	puzzle[18][5] = new Block( 2, 5, 2, 'v', false ),
	puzzle[18][6] = new Block( 3, 0, 2, 'v', false ),
	puzzle[18][7] = new Block( 3, 1, 2, 'h', false ),
	puzzle[18][8] = new Block( 3, 3, 2, 'v', false ),
	puzzle[18][9] = new Block( 3, 4, 2, 'v', false ),
	puzzle[18][10] = new Block( 4, 5, 2, 'v', false ),
	puzzle[18][11] = new Block( 5, 0, 2, 'h', false ),
	puzzle[18][12] = new Block( 5, 2, 3, 'h', false ),

	// 20
	puzzle[19][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[19][1] = new Block( 2, 3, 2, 'h', true ),
	puzzle[19][2] = new Block( 0, 1, 2, 'v', false ),
	puzzle[19][3] = new Block( 0, 2, 3, 'v', false ),
	puzzle[19][4] = new Block( 1, 4, 2, 'h', false ),
	puzzle[19][5] = new Block( 2, 5, 3, 'v', false ),
	puzzle[19][6] = new Block( 3, 0, 2, 'v', false ),
	puzzle[19][7] = new Block( 3, 1, 2, 'h', false ),
	puzzle[19][8] = new Block( 3, 3, 2, 'h', false ),
	puzzle[19][9] = new Block( 4, 1, 2, 'h', false ),
	puzzle[19][10] = new Block( 4, 3, 2, 'v', false ),
	puzzle[19][11] = new Block( 5, 4, 2, 'h', false ),

	// 21
	// very hard begins
	puzzle[20][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[20][1] = new Block( 0, 0, 2, 'v', false ),
	puzzle[20][2] = new Block( 0, 1, 2, 'v', false ),
	puzzle[20][3] = new Block( 3, 0, 2, 'v', false ),
	puzzle[20][4] = new Block( 0, 2, 2, 'h', false ),
	puzzle[20][5] = new Block( 0, 4, 2, 'h', false ),
	puzzle[20][6] = new Block( 1, 2, 3, 'h', false ),
	puzzle[20][7] = new Block( 1, 5, 3, 'v', false ),
	puzzle[20][8] = new Block( 2, 2, 2, 'v', false ),
	puzzle[20][9] = new Block( 3, 3, 2, 'h', false ),
	puzzle[20][10] = new Block( 4, 1, 2, 'h', false ),
	puzzle[20][11] = new Block( 4, 3, 2, 'v', false ),
	puzzle[20][12] = new Block( 5, 4, 2, 'h', false ),

	// 22
	puzzle[21][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[21][1] = new Block( 2, 2, 2, 'h', true ),
	puzzle[21][2] = new Block( 0, 1, 2, 'h', false ),
	puzzle[21][3] = new Block( 0, 3, 2, 'h', false ),
	puzzle[21][4] = new Block( 0, 5, 3, 'v', false ),
	puzzle[21][5] = new Block( 1, 1, 2, 'h', false ),
	puzzle[21][6] = new Block( 1, 4, 2, 'v', false ),
	puzzle[21][7] = new Block( 3, 0, 2, 'h', false ),
	puzzle[21][8] = new Block( 3, 2, 2, 'v', false ),
	puzzle[21][9] = new Block( 3, 4, 2, 'h', false ),
	puzzle[21][10] = new Block( 4, 0, 2, 'v', false ),
	puzzle[21][11] = new Block( 4, 3, 3, 'h', false ),
	puzzle[21][12] = new Block( 5, 1, 3, 'h', false ),
	puzzle[21][13] = new Block( 5, 4, 2, 'h', false ),

	// 23
	puzzle[22][0] = new Block( 2, 3, 2, 'h', true ),
	puzzle[22][1] = new Block( 0, 0, 3, 'v', false ),
	puzzle[22][2] = new Block( 0, 1, 2, 'h', false ),
	puzzle[22][3] = new Block( 0, 4, 2, 'v', false ),
	puzzle[22][4] = new Block( 1, 1, 2, 'v', false ),
	puzzle[22][5] = new Block( 1, 2, 2, 'v', false ),
	puzzle[22][6] = new Block( 1, 5, 3, 'v', false ),
	puzzle[22][7] = new Block( 3, 0, 3, 'h', false ),
	puzzle[22][8] = new Block( 3, 3, 2, 'v', false ),
	puzzle[22][9] = new Block( 4, 2, 2, 'v', false ),
	puzzle[22][10] = new Block( 4, 4, 2, 'h', false ),
	puzzle[22][11] = new Block( 5, 0, 2, 'h', false ),
	puzzle[22][12] = new Block( 5, 3, 2, 'h', false ),

	// 24
	puzzle[23][0] = new Block( 2, 1, 2, 'h', true ),
	puzzle[23][1] = new Block( 0, 2, 2, 'v', false ),
	puzzle[23][2] = new Block( 0, 3, 3, 'h', false ),
	puzzle[23][3] = new Block( 1, 0, 2, 'v', false ),
	puzzle[23][4] = new Block( 1, 3, 3, 'v', false ),
	puzzle[23][5] = new Block( 1, 4, 2, 'h', false ),
	puzzle[23][6] = new Block( 3, 1, 2, 'v', false ),
	puzzle[23][7] = new Block( 3, 4, 2, 'h', false ),
	puzzle[23][8] = new Block( 4, 0, 2, 'v', false ),
	puzzle[23][9] = new Block( 4, 2, 2, 'h', false ),
	puzzle[23][10] = new Block( 4, 5, 2, 'v', false ),
	puzzle[23][11] = new Block( 5, 1, 3, 'h', false ),

	// 25
	puzzle[24][0] = new Block( 2, 0, 2, 'h', true ),
	puzzle[24][1] = new Block( 2, 3, 2, 'h', true ),
	puzzle[24][2] = new Block( 0, 0, 2, 'h', false ),
	puzzle[24][3] = new Block( 0, 2, 3, 'h', false ),
	puzzle[24][4] = new Block( 0, 5, 3, 'v', false ),
	puzzle[24][5] = new Block( 1, 0, 2, 'h', false ),
	puzzle[24][6] = new Block( 1, 2, 3, 'v', false ),
	puzzle[24][7] = new Block( 3, 3, 2, 'v', false ),
	puzzle[24][8] = new Block( 3, 4, 2, 'h', false ),
	puzzle[24][9] = new Block( 4, 0, 2, 'v', false ),
	puzzle[24][10] = new Block( 4, 1, 2, 'h', false ),
	puzzle[24][11] = new Block( 5, 1, 2, 'h', false ),
	puzzle[24][12] = new Block( 5, 3, 2, 'h', false ),
*/

}( window.Block ));