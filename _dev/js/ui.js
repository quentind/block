/*jshint smarttabs:true, laxbreak:true, laxcomma:true */

/**
 * Dependencies : game, board, puzzle
 **/
(function ( game, board, puzzle ) {
	'use strict';

	var UI = {};

	/***
	 * Store elements to reduce DOM access
	 ***/
	UI.$ = {
		ui				: $('#ui')
	  , board			: $('#play')
	  ,	level			: $('#current-level')
	  , fieldLevel		: $('#box-current-level')
	  , movesPlayed		: $('#moves-played')
	  , movesPar		: $('#moves-par')
	  , movesBest		: $('#moves-best')
	  , toggleMenu		: $('#toggle-menu')
	  , levelList		: $('#level-list')
	  , fieldMovesBest	: $('#field-moves-best')
	  , fullscreenButton: $('#fullscreen-button')
	  , endScreen		: $('#end-screen')
	};

	/***
	 * STATUS
	 * - 
	 * Handle game status
	 * Provides status to prevent UI action for specific state (ie: no reset when blocks are out)
	 **/
	UI.status = {

		puzzle: true,
		fullscreen: false,
		muted: false,

		update: function ( status, value ) {
			UI.status[ status ] = value;
		},

		init: function () {

			/*
			 * PUZZLE in or out
			 */
			$(window).addEvent('puzzleOut' , function () {
				UI.status.update( 'puzzle', false );
			}, true, true);

			$(window).addEvent('puzzleIn' , function () {
				UI.status.update( 'puzzle', true );
			}, true, true);

			/*
			 * FULLSCREEN mode on or off
			 * -
			 * Firefox doesnt start transition with html:-moz-full-screen selector
			 * So we have to use JS events and a class
			 */
			var isFullScreenOn = function () {
				
				var d = document
				  , isActive = d.fullscreen || d.mozFullScreen || d.webkitIsFullScreen || false
				;

				UI.status.fullscreen = isActive;

				if ( isActive === true ) {
					UI.$.fullscreenButton.addClass('enabled');
				} else {
					UI.$.fullscreenButton.removeClass('enabled');
				}
			};

			$(document).addEvent('fullscreenchange', isFullScreenOn );
			$(document).addEvent('mozfullscreenchange', isFullScreenOn );
			$(document).addEvent('webkitfullscreenchange', isFullScreenOn );
			
		}

	};

	/***
	 * UI BUTTONS
	 ***/
	UI.buttons = {

		/**
		 * Click Handler - dispatch action from data-action attribute
		 */
		dispatchAction: function ( e ) {
			
			$.preventDefault( e );

			var action = UI.buttons.actions[ $(this).attr('data-action') ]
			  , requires = $(this).attr('data-requires')
			;

			if ( typeof action === 'function' && ( ! requires || UI.status[ requires ] === true ) ) {
				action.call( this );
			}
		},

		/**
		 * Buttons actions (functions)
		 */
		actions: {

			/**
			 * Opens or close the level selector
			 */
			toggleLevelList: function () {

				var level = UI.$.levelList;
				
				if ( level.hasClass('show') ) {
					
					// Handle end game screen
					if ( UI.$.endScreen.hasClass('enabled') ) {
						UI.endScreen.show();
					}

					level.removeClass('show');
					game.animate.blocks({
						where: 'in',
						direction: 'top'
					});
				} else {

					// Handle end game screen
					if ( UI.$.endScreen.hasClass('enabled') ) {
						UI.endScreen.hide();
					}

					level.addClass('show');
					game.animate.blocks({
						where: 'out',
						direction: 'top'
					});

					/***
					 * Track action in Google Analytics
					 * -
					 * open level list
					 */
					ga('send', 'event', 'ui_action', 'level-list');
				}

			},

			/**
			 * Fullscreen
			 */
			toggleFullScreen: function () {

				var fs = $.support.fullscreen;

				if ( fs ) {

					if ( UI.status.fullscreen === false ) {
						fs.enable();
						
						/***
						 * Track action in Google Analytics
						 * -
						 * enable fullscreen
						 */
						ga('send', 'event', 'ui_action', 'fullscreen');

					} else {
						fs.cancel();
					}

				}
			},

			/**
			 * (un)Mute
			 */
			muteUnmute: function () {
				
				if ( UI.status.muted === false ) {
					UI.status.update('muted', true );
					$(this).addClass('muted');

					/***
					 * Track action in Google Analytics
					 * -
					 * mute game
					 */
					ga('send', 'event', 'ui_action', 'mute');

				} else {
					UI.status.update('muted', false );
					$(this).removeClass('muted');
				}

			},

			/**
			 * Reset board
			 */
			resetBoard: function () {
				
				var $this = $(this);

				$this.addClass('anim');

				game.animate.blocks({
					where: 'out',
					direction: 'far',
					callback: function () {

						UI.$.board[0].innerHTML = '';
						game.puzzle.insert( puzzle[ $.storage.lvl ] );
						$(window).trigger('levelUpdate');
						
						game.animate.blocks({
							where: 'in',
							direction: 'bot',
							force: true,
							callback: function () {
								$this.removeClass('anim');
							}
						});

					}
				});

				/***
				 * Track action in Google Analytics
				 * -
				 * enable fullscreen
				 */
				ga('send', 'event', 'ui_action', 'reset-level');

			},

			/**
			 * Reset levels
			 */
			resetLevels: function () {
				$.storage.lvl = null;
				$.storage.best = null;
				$.storage.bestMoves = null;
			}
		},

		/**
		 * Init all buttons
		 */
		init: function () {
			$('a', UI.$.ui[0] ).addEvent( 'click', this.dispatchAction, true );
		}

	};

	/***
	 * LEVEL SELECTOR COMPONENT
	 ***/
	UI.level = {

		/**
		 * Hides the level selector and animate blocks in as callback
		 */
		hideList: function () {

			var transition = $.support.transitionEvent
			  , callback = function () {
					UI.$.levelList.removeEvent( transition, callback );
					game.animate.blocks({
						where: 'in',
						direction: 'bot',
						force: true
					});
				}
			;

			if ( transition ) {
				UI.$.levelList.addEvent( transition, callback );
			} else {
				game.animate.blocks({
					where: 'in',
					direction: 'bot',
					force: true
				});
			}

			UI.$.levelList.removeClass('show');
		},

		/**
		 * Loads new puzzle from elements id
		 */
		load: function ( e ) {
			
			$.preventDefault(e);

			var n = parseInt( $(this).attr('id').replace('level-', ''), 10 )
			  , currentLevel = parseInt( $.storage.best, 10 )
			;

			// Enable level switch only if level is unlocked
			if ( n < currentLevel + 1 || ( currentLevel ===  -1 && n === 0 ) ) {
				// Empty the board
				UI.$.board[0].innerHTML = '';

				// Insert puzzle number N
				game.puzzle.insert( puzzle[ n ] );

				// Set currently played puzzle
				$.storage.lvl = n;
				
				$(window).trigger('levelUpdate');

				// Close level list
				UI.level.hideList();

				/***
				 * Track action in Google Analytics
				 * -
				 * Insert level n
				 */
				ga('send', 'event', 'ui_action', 'load-level', n );
			}
		},
		
		/**
		 * Unlock level 'n'
		 */
		unlock: function ( n ) {
			$( '#level-' + n ).removeClass('locked');
		},

		/**
		 * Init level selector, event bindings
		 */ 
		init: function () {

			// Bind level nav
			var links = UI.$.levelList[0].getElementsByTagName('a')
			  , i = 1
			  , best = parseInt( $.storage.best, 10 )
			;

			$(links).addEvent('click', UI.level.load, true );

			// Unlock all achieved levels
			for ( ; i <= best; i++ ) {
				UI.level.unlock( i );
			}
		}

	};

	/***
	 * SCORE BOARD
	 ***/
	UI.score = {

		update: {

			/**
			 * Updates moves counter
			 */
			moves: function ( reset ) {

				var n;

				if ( reset === true ) {
					n = 0;
				} else {
					n = parseInt( UI.$.movesPlayed[0].innerHTML, 10 ) + 1;
				}
				
				UI.$.movesPlayed[0].innerHTML = n;
			},

			/**
			 * Updates par moves
			 */
			parMoves: function () {
				UI.$.movesPar[0].innerHTML = puzzle[ parseInt( $.storage.lvl, 10 ) ].parMoves;
			},

			/**
			 *  Update best moves
			 */
			bestMoves: function () {
				
				var moves = JSON.parse( $.storage.bestMoves );

				moves = moves[ $.storage.lvl ] || '—';

				UI.$.movesBest[0].innerHTML = moves;
			},

			/**
			 * Update level counter
			 */
			level: function () {
				UI.$.level[0].innerHTML = parseInt( $.storage.lvl, 10 ) + 1;
			},

			/**
			 * Update all infos in the scoreboard
			 */
			all: function () {

				var update = UI.score.update;

				update.level();
				update.parMoves();
				update.bestMoves();
				update.moves( true );

				// TODO: on level complete: separate event handler and call to update.all
				// TODO: popover indicating best score (only if level has been completed before and score is improved ?)

			}

		},

		init: function () {
			$(window).addEvent('levelUpdate', UI.score.update.all, false, true );
		}
	};

	/***
	 * Display Alert 
	 ***/
	UI.alert = {
		newRecord: {
			show: function () {
				UI.$.fieldMovesBest.addClass('alert');
			},
			hide: function () {
				UI.$.fieldMovesBest.removeClass('alert');
			}
		},
		newLevel: {
			show: function () {
				UI.$.fieldLevel.addClass('alert');
			},
			hide: function () {
				UI.$.fieldLevel.removeClass('alert');
			}
		}
	};

	/***
	 * END GAME SCREEN
	 ***/
	UI.endScreen = {

		enable: function () {
			UI.$.endScreen.addClass('enabled');
			window.getComputedStyle( UI.$.endScreen[0] ).top;
		},

		disable: function () {
			UI.$.endScreen.removeClass('enabled');
		},

		show: function () {
			UI.$.endScreen.addClass('in');
			$.delay( UI.alert.newRecord.hide, 750 );
		},

		hide: function () {
			UI.$.endScreen.removeClass('in');
		}

	};

	/***
	 * ANIMATE UI IN
	 ***/
	UI.show = function () {
		
		UI.$.ui.addEvent( $.support.transitionEvent, function () {
			$.delay(function () {
				$(document.documentElement).addClass('ui-in');
			}, 500);
		});
		$(document.documentElement).addClass('ui-ready');

	};

	/***
	 * INIT UI
	 ***/
	UI.init = function () {

		UI.level.init();
		UI.score.init();
		UI.buttons.init();
		UI.status.init();

		// Bring UI in when board is ready
		$(window).addEvent( 'uiReady', UI.show, false, true );
		
	}();

	$(window).addEvent('load', game.load );

	window.UI = UI;

}( window.game, window.board, window.puzzle ));