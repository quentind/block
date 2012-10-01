/*jshint smarttabs:true, laxbreak:true, laxcomma:true */
/*global jQuery:true, $:true, UI:true */

/**
 * Dependencies : puzzle, dragDrop
 **/
(function ( puzzle, dragDrop ) {
	'use strict';

	/***
	 * GAME SETUP
	 ***/
	var game = {}
	  , config = {
			// Game config
			inited: false,
			spriteURL: '_dev/img/sprite.png',
			loadDelay: 300,
			screen: {
				minWidth: 800,
				minHeight: 600
			},
			maxLevel: 24
		}
	;

	/***
	 * PRE-LOAD COMPONENTS before init
	 ***/
	game.load = function () {

		// TODO: component list loading - img only ?
		var preload = new Image();
		
		preload.onload = function () {
			$.delay( game.init, config.loadDelay );
		};

		preload.src = config.spriteURL;

		/*
		$('#audio').addEvent('canplaythrough', function() {
			//alert('k');
		}, false);
		*/

	};
	
	/***
	 * GAME DOM ELEMENTS
	 ***/
	game.$ = {
		'board':			$('#board'),
		'play':				$('#play'),
		'level-list':		$('#level-list'),
		'toggle-menu':		$('#toggle-menu'),
		'html':				$(document.documentElement)
	};

	/***
	 * PUZZLE
	 ***/
	game.puzzle = {

		/**
		 * Inserts a puzzle
		 * -
		 * @param {array} puzzleObject -> array of Blocks
		 */
		insert: function ( puzzleObject ) {

			var frag = document.createDocumentFragment()
			  , puzzle = puzzleObject.blocks
			  , len = puzzle.length
			  , i = 0
			  , el
			;

			for ( ; i < len ; i++ ) {
			
				el = document.createElement('div');
				el.style.cssText = puzzle[i].styles;
				el.className = puzzle[i].classAttr;
			
				frag.appendChild( el );

				$(el).addEvent('mousedown', dragDrop.startDragMouse, true );
			}

			game.$.play[0].appendChild( frag );
		},

		/**
		 * Rebind blocks
		 * -
		 * Ugly fix of a fix, retarded but only solution ATM :(
		 * Rebind blocks after CSS transition fix using innerHTML = ''
		 * See game.animate.block() for more details
		 * Could maybe use setImmediate but unsure and not well supported
		 */
		rebind: function () {
			$('div', game.$.play[0]).addEvent('mousedown', dragDrop.startDragMouse, true );
		},

		/**
		 * Save minimum moves played if best perf
		 */
		saveMoves: function () {

			var movesArray = JSON.parse( $.storage.bestMoves )
			  , currentMoves = parseInt( UI.$.movesPlayed[0].innerHTML, 10 )
			  , currentLevel = $.storage.lvl
			  , currentBest  = movesArray[ currentLevel ]
			;

			if ( currentMoves < currentBest || ! currentBest  ) {
				movesArray[ currentLevel ] = currentMoves;
				$.storage.bestMoves = JSON.stringify(movesArray);
				UI.alert.newRecord.show();
			}
			
			UI.score.update.bestMoves();

		},

		/**
		 * Next puzzle
		 * - 
		 * @returns {boolean|number} return false if last level is reached, returns next level number otherwise
		 */
		next: function () {
			
			var lvl = parseInt( $.storage.lvl, 10 ) + 1;

			if ( lvl >= config.maxLevel ) {
				lvl = config.maxLevel;
			}

			if ( lvl > parseInt( $.storage.best, 10 ) ) {
				$.storage.best = lvl;
				UI.level.unlock( lvl );
			}

			$.storage.lvl = lvl;

			return lvl;
		},

		/**
		 * Win 
		 * -
		 * When a puzzle is achieved
		 */
		win: function () {

			// TODO (?) : when win(), blocks out puis popover avec recap et bouton restart si 'par' pas obtenu (éventuellement système d'étoiles) et boutton next.
			
			$('#audio')[0].play();
			
			var inCallback
			  , outCallback
			;

			inCallback = function () {
				UI.alert.newRecord.hide();
				$(window).trigger('levelUpdate');
			};

			outCallback = function () {

				game.$.play[0].innerHTML = '';
				
				var nextPuzzle = game.puzzle.next();

				if ( nextPuzzle ) {

					game.puzzle.insert( puzzle[ nextPuzzle ] );
					$.delay( function() {
						game.animate.blocks({
							where: 'in',
							direction: 'bot',
							force: true,
							callback: inCallback
						});
					}, 200); // => setTimeout to ensure puzzle have been inserted before we animate blocks in
				} else {
					// credit
				}

				// play audio
				// http://remysharp.com/2010/12/23/audio-sprites/
				// http://nicolahibbert.com/html5-canvas-breakout-game/
				/*
					http://audiojungle.net/item/achieved/2527252?WT.ac=search_item&WT.seg_1=search_item&WT.z_author=NenadSimic
					http://audiojungle.net/item/level-up-02/90087?WT.ac=search_item&WT.seg_1=search_item&WT.z_author=Paweqq
					http://audiojungle.net/item/level-complete/2102518?WT.ac=search_item&WT.seg_1=search_item&WT.z_author=R-Mafi
					http://audiojungle.net/item/level-up/50226?WT.ac=search_item&WT.seg_1=search_item&WT.z_author=Paweqq
					http://audiojungle.net/item/level-select-sound-4/2717269?WT.ac=category_item&WT.seg_1=category_item&WT.z_author=Sunsvision
				*/

			};

			game.animate.blocks({
				where: 'out',
				direction: 'far',
				callback: outCallback
			});

		},

		/**
		 * Init first puzzle
		 */
		init: function () {

			var lvl = parseInt( $.storage.lvl, 10 )
			  , best = parseInt( $.storage.best, 10 )
				// check if local storage entry exists to fix Webkit bug (Unexpected Token u)
			  , bestMoves = ($.storage.bestMoves) ? JSON.parse($.storage.bestMoves) : false
			;

			$.storage.lvl  = lvl  || 0;
			$.storage.best = best || -1;

			if ( ! bestMoves ) {
				$.storage.bestMoves = JSON.stringify([]);
			}

			// Insert first unachieved puzzle
			game.puzzle.insert( puzzle[ $.storage.lvl ] );
			
			$(window).trigger('levelUpdate');
		}
	};

	/***
	 * GAME INIT
	 ***/
	game.init = function () {

		var initialized = false;

		/***
		 * Update window.board.offset.left and .top
		 * -
		 * Called on each window resize
		 */
		var updateOffsets = function () {
			window.board.offset.left = game.$.play[0].offsetLeft;
			window.board.offset.top  = game.$.play[0].offsetTop;
		};

		/***
		 * Resize window event handler
		 */
		var onResizeWindow = function () {
			if ( ! game.screen.isTooSmall() ) {
				if ( initialized === false ) {
					init();
				}
				updateOffsets();
			}
		};

		// 
		$(window).addEvent('resize', onResizeWindow );

		/***
		 * Actual init
		 */
		var init = function () {
			//
			game.puzzle.init();
			
			//
			$(document.documentElement).addClass('ready');
			game.animate.board();

			// 
			initialized = true;

		};

		if ( ! game.screen.isTooSmall()  ) {
			init();
		}
	};

	/***
	 * Screen enabling and disabling
	 * TODO: rewrite this 
	 ***/
	game.screen = {

		/**
		 * Checks if screen is large enough to play
		 */ 
		isTooSmall: function () {
			if ( $.docHeight() < config.screen.minHeight || $.docWidth() < config.screen.minWidth ) {
				game.screen.disable('too-small');
				return true;
			} else {
				game.screen.enable('too-small');
				return false;
			}
		},

		/**
		 * Prevent players from playing
		 */
		disable: function ( reason ) {
			$( '#' + reason ).show();
		},

		/**
		 * Enable players to play
		 */
		enable: function ( reason ) {
			$( '#' + reason ).hide();
		}
	};

	/***
	 * ANIMATION OF GAME ELEMENTS - Blocks, board, ...
	 ***/
	game.animate = {

		/**
		 * Bring board in
		 * TODO: rewrite animate board
		 */
		board: function () {
			var transition = $.support.transitionEvent;

			game.$.board
				// Supports transitionEnd, use the event
				.chainEvents( transition, [
					// $.delay => setTimeout required for chrome since webkitTransitionEnds doenst always fire, delay can be 0
					function () {
						$.delay( game.animate.borders, 500 ); 
					},
					function () {
						$(window).trigger('boardReady');
						$.delay( function () {
							game.animate.blocks({
								where: 'in',
								direction: 'bot'
							});
						}, 200 );
					}
				], true)
				// AddClass to trigger the event
				.addClass('init');
				
			// No support for transitionEnd event, bring everything in
			// Mainly for IE9
			if ( ! transition ) {
				game.animate.borders();
				game.animate.blocks({
					where: 'in',
					direction: 'bot'
				});
				$(window).trigger('boardReady');
			}
		},

		/**
		 * Bring board borders
		 */
		borders: function () {
			game.$.board.addClass('init-border');
		},

		/**
		 * Animate blocks in or out of the playing board
		 * @param {object} config
		 * {
		 *	  where: 'out' || 'in'
		 *	  from: 'top' || 'bot' || 'far'
		 *	  force: enable fix for special edge cases	
		 *	  callback: callback function when transition ends
		 * }
		 */
		blocks: function ( config ) {

			var $board = game.$.play
			  , transition = $.support.transitionEvent
			  , callback = config.callback
			  , fn = function () {
					$board.removeEvent( transition, fn);
					if ( typeof callback === 'function' ) {
						callback();
					}
					// Block are considered 'in' only when animation is finished
					if ( config.where === 'in' ) {
						$(window).trigger('puzzleIn');
					}
				}
			  , className = 'blocks-out-' + config.direction 
			  , html = ''
			;

			if ( transition ) {
				$board.addEvent( transition, fn );
			}

			if ( config.force ) {
				$board.addClass('blocks-out-bot').removeClass('blocks-out-top').removeClass('blocks-out-far');
				
				if ( transition ) {

					// Ugly fix: Clear and populate innerHTML to fix CSS Transition issue in pretty much all browsers
					html = $board[0].innerHTML;
					$board[0].innerHTML = '';
					$board[0].innerHTML = html;
					// Ugly fix 2: have to rebind events since innerHTML is used
					game.puzzle.rebind();

					$.delay(function () {
						$board.removeClass( className );
					}, 200);

				} else {
					$board.removeClass( className );
				}
				
			} else {

				if ( config.where === 'in' ) {
					$board.removeClass( className );
				} else if ( config.where === 'out') {
					// Blocks are concidered 'out' as soon as animation starts
					$(window).trigger('puzzleOut');
					$board.addClass( className );
				}
			}

			// No transition callback instantly
			if ( ! transition ) {
				fn();
			}

		},

		/**
		 * Animate a key-block out of the playing board
		 */
		keyBlock: function( blockElement, callback ) {

			var block = $( blockElement )
			  , transition = $.support.transitionEvent
			  , removeBlock = function () {
					block.removeEvent( transition, removeBlock ).remove();
					if ( callback ) {
						$.delay( callback, 0);
					}
				}
			;

			block.addEvent( transition, removeBlock ).addClass('out');

			if ( ! transition && callback ) {
				callback();
			}
		}
	};
	
	// Game end scene
	// When player has finished last puzzle
	game.credit = function () {

	};

	window.game = game;

}( window.puzzle, window.dragDrop ));