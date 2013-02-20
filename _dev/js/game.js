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
			loadDelay: 300,
			maxLevel: puzzle.length
		}
	;

	/***
	 * GAME DOM ELEMENTS
	 ***/
	game.$ = {
		'board':			$('#board'),
		'play':				$('#play'),
		'level-list':		$('#level-list'),
		'toggle-menu':		$('#toggle-menu'),
		'screenToSmall':	$('#too-small'),
		'html':				$(document.documentElement)
	};

	/***
	 * GAME SOUNDS
	 ***/
	game.playSound = {};

	/***
	 * PRE-LOAD COMPONENTS before init
	 ***/
	game.load = function () {

		var resource = [
				{
					src: '/_static/img/sprite.png',
					type: 'image'
				},
				{
					idname: 'knock',
					src: '/_files/audio/knock.',
					type: 'audio'
				},
				/*{
					idname: 'gg',
					src: '/_files/audio/gg.',
					type: 'audio'
				}*/
			]
		  , l = resource.length
		  , i = 0
		  , preload
		  , loadedCount = 0
		  , resourceLoaded
		  , iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false
		;

		resourceLoaded = function () {

			//console.log('new resource loaded.');
			loadedCount++;

			if ( loadedCount === l) {
				//console.log('all resources loaded.')
				$.delay( game.init, config.loadDelay );
			}
		};

		preload = function ( src, type, idname ) {

			// Temporary fix for iOS
			if ( iOS && type === 'audio' ) {
			
				resourceLoaded();

			} else if ( type === 'audio' ) {

				if ( $.support.audio ) {

					var audio = new Audio()
					  , ext
					  , onCanPlayThrough
					;

					onCanPlayThrough = function () {
						
						$(this).removeEvent('canplaythrough', onCanPlayThrough);

						game.playSound[ idname ] = function ( vol ) {
							if ( UI.status.muted === false ) {
								audio.volume = vol;
								audio.play();
							}
						}
						resourceLoaded();

					};

					if ( audio.canPlayType('audio/ogg; codecs="vorbis"') ) {
						ext = 'ogg';
					} else if ( audio.canPlayType('audio/mpeg; codecs="mp3"') ) {
						ext = 'mp3';
					}

					$(audio).addEvent('canplaythrough', onCanPlayThrough, false);

					audio.src = src + ext;

				} else {
					resourceLoaded();
				}

			} else if ( type === 'image' ) {

				var img = new Image();

				$( img ).addEvent('load', function () {
					resourceLoaded();
				});

				img.src = src;

			}

		};

		for ( ; i < l; i++ ) {
			preload( resource[ i ].src, resource[ i ].type, resource[ i ].idname );
		}

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
			  , blocks = puzzleObject.blocks
			  , len = blocks.length
			  , i = 0
			  , el
			  , startEvent = document.ontouchstart === undefined ? 'mousedown' : 'touchstart'
			;

			for ( ; i < len ; i++ ) {
			
				el = document.createElement('div');
				el.style.cssText = blocks[i].styles;
				el.className = blocks[i].classAttr;
			
				frag.appendChild( el );

				// Temporarily disable mouse
				// TODO: fix this
				$(el).addEvent( startEvent, dragDrop.startDragMouse, true )

			}

			game.$.play[0].appendChild( frag );

			// Temporary event binding for touch
			/*var qsa = document.querySelectorAll('.block');
			var l = qsa.length;

			for (var i=0; i < l ; i++ ) {
				$(qsa[i]).addEvent('touchstart', dragDrop.startDragMouse, true);
			}*/

			UI.endScreen.disable();
		},

		/**
		 * Rebind blocks
		 * -
		 * Ugly fix, stupid but only solution ATM :(
		 * See game.animate.block()
		 */
		rebind: function () {
			$('div', game.$.play[0]).addEvent( document.ontouchstart === undefined ? 'mousedown' : 'touchstart', dragDrop.startDragMouse, true );
		},

		/**
		 * Save minimum moves played if best perf
		 * -
		 * called in block.moves.js (block unbind)
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

			if ( lvl > parseInt( $.storage.best, 10 ) ) {
				$.storage.best = lvl;
				UI.level.unlock( lvl );
			}

			$.storage.lvl = lvl;
			
			if ( lvl >= config.maxLevel ) {
				lvl = config.maxLevel;
				return false;
			}
			
			return lvl;
		},

		/**
		 * Win 
		 * -
		 * When a puzzle is achieved
		 - @param { boolean } newRecord - true should be passed if a new level is unlocked
		 */
		win: function ( newBestLevel ) {

			var inCallback
			  , outCallback
			;

			inCallback = function () {

				// TODO: cann only If new record has been set, remove alert
				if ( 1 ) {
					UI.alert.newRecord.hide();
				}
				
				$(window).trigger('levelUpdate');
				
				// if new level is unlocked, show alert and remove it after 3 sec
				if ( newBestLevel === true ) {
					UI.alert.newLevel.show();
					$.delay( UI.alert.newLevel.hide, 3000);
				}
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
					}, 200); // => setTimeout required to ensure puzzle have been inserted before we animate blocks in
				} else {
					
					/*
					 * End screen
					 */
					UI.endScreen.enable();
					$.delay( UI.endScreen.show, 200);

				}

			};

			if ( game.tutorial.pending ) {
				game.tutorial.onComplete();
			}

			game.animate.blocks({
				where: 'out',
				direction: 'far',
				callback: game.tutorial.pending ? game.tutorial.onEnd : outCallback
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
			  , maxPuzzles = window.puzzle.length - 1
			;

			// Prevent lvl to exceed number of puzzle (minus 1 because zero indexed)
			if ( ! lvl ) {
				lvl = 0;
			}

			lvl = Math.min( maxPuzzles, lvl );

			$.storage.lvl = lvl;
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
	 * TUTORIAL
	 ***/
	game.tutorial = {

		pending: true,

		init: function () {

			var play = game.$.play
			  , html =  '<div id="instructions" class="instructions">Slide blocks forward or backward in order to free the red one.</div>';
				html += '<div class="instruction-arrow pos-1">&larr;</div><div class="instruction-arrow pos-2">&darr;</div><div class="instruction-arrow pos-3">&rarr;</div>'

			game.puzzle.insert({
				blocks: [
					new Block( 2, 1, 2, 'h', true )
				  , new Block( 1, 3, 3, 'v', false )
				  , new Block( 4, 2, 3, 'h', false )
				]
			});

			play.append( html );

			$(window).addEvent('tutorialReady', this.start, false, true );
		
		},

		start: function () {

			window.getComputedStyle( game.$.play[0] ).opacity;
			game.$.play.addClass('tutorial-ui-in');

		},

		onComplete: function () {

			game.$.play.addClass('tutorial-completed');
		
		},

		onEnd: function () {
			
			game.tutorial.pending = false;
			
			$.delay( function() {
				
				game.$.play[0].innerHTML = '';
				game.puzzle.init();

				game.animate.blocks({
					where: 'in',
					direction: 'bot',
					force: true
				});

			}, 200);
			
			$(window).trigger('uiReady');
			
		}

	};

	/***
	 * GAME INIT
	 ***/
	game.init = function () {

		/**
		 * Prevent elastic scrolling / overscrolling in iOS
		 */
		$(document.body).addEvent('touchmove', function(e) {
			e.preventDefault();
		});

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
		var initialized = false;
		var onResizeWindow = function () {
			document.body.style.width = 'auto';

			var w = document.body.clientWidth + 'px';
			$('#wrap')[0].style.width = w;
			document.body.style.width = w;
			
			if ( ! game.screen.isTooSmall() ) {
				if ( initialized === false ) {
					init();
				}
				updateOffsets();
			}
		};

		$(window).addEvent('resize', onResizeWindow );

		/***
		 * Actual init
		 */
		var init = function () {

			$(window).addEvent('boardReady', function () {
				game.$.html.addClass('board-ready');
			}, false, true );
			
			//console.log ('lvl', $.storage.lvl);
			//console.log ('lvl', parseInt( $.storage.lvl, 10 ));

			if ( parseInt( $.storage.lvl, 10 ) >= 0 ) {

				// Tutorial already finished
				game.tutorial.pending = false;

				// Init latest puzzle
				game.puzzle.init();
				game.animate.board( true, false );
			
			// User has not finished a puzzle yet
			} else {

				// Init tutorial
				game.tutorial.init();
				game.animate.board( false, true );
			}
			
			$(document.documentElement).addClass('ready');
			
			initialized = true;

		};

		if ( ! game.screen.isTooSmall()  ) {
			init();
		}
	};

	/***
	 * Screen enabling and disabling
	 ***/
	game.screen = {

		/**
		 * Checks if screen is large enough to play
		 */ 
		isTooSmall: function () {

			if ( window.getComputedStyle( game.$.screenToSmall[0], null).display === 'block' ) {
				return true;
			}

			return false;
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
		board: function ( triggerUiReady, triggerTutorial ) {
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
						if ( triggerUiReady ) {
							$(window).trigger('uiReady');
						}
						$.delay( function () {
							game.animate.blocks({
								where: 'in',
								direction: 'bot',
								callback: function () {
									if ( triggerTutorial ) {
										$(window).trigger('tutorialReady')
									}
								}
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
				if ( triggerUiReady ) {
					$(window).trigger('uiReady');
				}
				if ( triggerTutorial ) {
					$(window).trigger('tutorialReady')
				}
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
					// TODO: try with windon.cacl
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

	window.game = game;

}( window.puzzle, window.dragDrop ));