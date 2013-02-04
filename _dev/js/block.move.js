/*jshint smarttabs:true, laxbreak:true, laxcomma:true */
/*global jQuery:true, $:true, UI:true, game:true */

/**
 * Dependencies: board, game
 **/
(function ( board ) {
	'use strict';

	/**
	 * DRAG N DROP
	 **/
	var dragDrop = {
		
		initialMouseX: undefined,
		initialMouseY: undefined,
		startX: undefined,
		startY: undefined,
		n: 0,
		dir: undefined,
		noMove: true,
		isKey: false,
		_max: null,
		_min: null,
		draggedObject: undefined,
		blockIsAtMaxPosition: false,
		blockIsAtMinPosition: false,

		startDragMouse: function ( e ) {
			
			dragDrop.startDrag(this);
			
			if ( this.className.indexOf('key') >= 0 ) {
				dragDrop.isKey = true;
			} else {
				dragDrop.isKey = false;	
			}
			
			var evt = e || window.event;
			dragDrop.initialMouseX = evt.clientX;
			dragDrop.initialMouseY = evt.clientY;
			$(document).addEvent( 'mousemove', dragDrop.dragMouse ).addEvent( 'mouseup', dragDrop.unBind );
			
			return false;
		},
		
		startDrag: function ( obj ) {
			
			if (dragDrop.draggedObject) {
				dragDrop.unBind();
			}
			
			dragDrop.startX = obj.offsetLeft;
			dragDrop.startY = obj.offsetTop;
			dragDrop.draggedObject = obj;
			dragDrop.draggedObjectHeight = parseInt(obj.style.height, 10);
			dragDrop.draggedObjectWidth = parseInt(obj.style.width, 10);
			
			var over
			  , _max
			  , _min
			  , d = document
			  , coordLeft
			  , coordTop
			  , posTop = obj.offsetTop
			  , posLeft = obj.offsetLeft
			  , i
			;

			/**
			 * Set max
			 **/
			// Horizontal
			if ( obj.className.indexOf('dir-h') >= 0 ) {
				
				dragDrop.dir = 'left';
				
				var width = parseInt(obj.style.width, 10)
				  , coordRight = posLeft + window.board.offset.left + 1 + width
				;

				coordLeft = posLeft + window.board.offset.left - 1;
				coordTop = posTop + window.board.offset.top + 1;
				
				for ( i = 0; i < 5; i++ ) {
					over = document.elementFromPoint( coordRight , coordTop );
					
					if ( over !== board.el ) {
						_max = coordRight;
						break;
					}
					
					coordRight += board.blockSize;
					
				}
				
				dragDrop._max = _max - window.board.offset.left - width - 1;
				
				// 6 loops for key block only
				for ( i = 0; i < 6; i++ ) {
					// FIX: -1 to fix bug in chrome
					over = document.elementFromPoint( coordLeft -1 , coordTop );
					
					if ( over !== board.el ) {
						_min = coordLeft;
						break;
					}
					
					coordLeft -= board.blockSize;
					
				}
				
				dragDrop._min = _min - window.board.offset.left + 1;
			
			// Vertical
			} else {
				
				dragDrop.dir = 'top';
			
				var height = parseInt(obj.style.height, 10)
				  , coordBottom = posTop + window.board.offset.top + 1 + height
				;

				coordLeft = posLeft + window.board.offset.left + 1;
				coordTop = posTop + window.board.offset.top - 1;

				for ( i = 0; i < 5; i++ ) {
					over = document.elementFromPoint( coordLeft, coordBottom );
					
					if ( over !== board.el ) {
						_max = coordBottom;
						break;
					}
					
					coordBottom += board.blockSize;
					
				}
				
				dragDrop._max = _max - window.board.offset.top - height - 1;

				for ( i = 0; i < 5; i++ ) {
					// FIX: -1 to fix bug in chrome with elementFromPoint and CSS transforms
					over = document.elementFromPoint( coordLeft, coordTop - 1 );
					
					if ( over !== board.el ) {
						_min = coordTop;
						break;
					}
					
					coordTop -= board.blockSize;
					
				}
				
				dragDrop._min = _min - window.board.offset.top + 1;
				
			}
			
			$(obj).addClass('dragged');
		},

		dragMouse: function ( e ) {
			var evt = e || window.event,
				dx = evt.clientX - dragDrop.initialMouseX,
				dy = evt.clientY - dragDrop.initialMouseY;
			
			dragDrop.setPosition( dx , dy );
			
			return false;
		},
		
		setPosition: function ( dx, dy ) {

			var dir = dragDrop.dir
			  , n
			  , maxBlock = dragDrop._max
			  , minBlock = dragDrop._min
			;
			
			// Horizontal
			if ( dir === 'left' ) {
				var maxX = board.elSize - dragDrop.draggedObjectWidth;

				n = dragDrop.startX + dx;
				
				if ( dragDrop.isKey ) {
					if ( maxBlock >= 320 ) {
						if ( n < minBlock ) {
							n = minBlock;
						} else if ( n <= 0 ) {
							n = 0;
						} else if ( n > 480 ) {
							n = 480;
						}
					} else {
						if ( n > maxBlock ) {
							n = maxBlock;
						} else if ( n <= minBlock ) {
							n = minBlock;
						} else if ( n <= 0 ) {
							n = 0;
						} else if ( n > maxX ) {
							n = maxX;
						}
					}
				} else {
					if ( n > maxBlock ) {
						n = maxBlock;
					} else if ( n < minBlock ) {
						n = minBlock;
					} else if ( n <= 0 ) {
						n = 0;
					} else if ( n > maxX ) {
						n = maxX;
					}
				}

				if ( n !== dragDrop.startX ) {
					dragDrop.noMove = false;
				}

			// Vertical
			} else {
				var maxY = board.elSize - dragDrop.draggedObjectHeight;

				n = dragDrop.startY + dy;
				
				if ( n > maxBlock ) {
					n = maxBlock;
				} else if ( n < minBlock ) {
					n = minBlock;
				} else if ( n < 0 ) {
					n = 0;
				} else if ( n > maxY ) {
					n = maxY;
				}

				if ( n !== dragDrop.startY ) {
					dragDrop.noMove = false;
				}
			}
			
			dragDrop.n = n;
			
			//console.log('max', maxBlock);
			//console.log('min', minBlock);
			//console.log('n', n);
			//console.log('nomove', dragDrop.noMove);
			
			// If block cant move further bottom or right
			if ( n === maxBlock && ! dragDrop.blockIsAtMaxPosition && ! dragDrop.noMove ) {
				dragDrop.blockIsAtMaxPosition = true ;
				game.playSound.knock( 0.6 );

			// If block cant move further top or left
			} else if ( n === minBlock && ! dragDrop.blockIsAtMinPosition && ! dragDrop.noMove ) {
				dragDrop.blockIsAtMinPosition = true ;
				game.playSound.knock( 0.6 );
			} else {

				if ( n < maxBlock) {
					dragDrop.blockIsAtMaxPosition = false ;
				} 

				if ( n > minBlock) {
					dragDrop.blockIsAtMinPosition = false ;
				}

			}

			dragDrop.draggedObject.style[ dir ] = n + 'px';
			
		},

		unBind: function () {
			
			var	n = dragDrop.n
			  ,	dir = dragDrop.dir
			  ,	diff = Math.round( n / board.blockSize ) * board.blockSize
			  , initialPosition = ( dragDrop.dir == 'left' ) ? dragDrop.startX: dragDrop.startY
			;

			if ( diff * board.blockSize !== n ) {
				dragDrop.draggedObject.style[ dir ] = diff + 'px';

			}
			
			//console.log('n', n);
			//console.log('init', initialPosition);
			//console.log('diff', diff);

			// Play sounds only if block position is adjusted
			if ( diff * board.blockSize !== n ) {
				var delta = n - diff;
				if ( delta !== 0 ) {
					//console.log(delta);
					// volume = (abs block movement length) / (ratio in block size) * (modifier = 2)
					delta = Math.abs( delta ) / 80;
					game.playSound.knock( delta );
				}
			}

			$(document).removeEvent('mousemove', dragDrop.dragMouse ).removeEvent('mouseup', dragDrop.unBind );
			
			// Remove dragger class on the dragger object
			// TODO: store $(draggedObject) in var
			$(dragDrop.draggedObject).removeClass('dragged');

			if ( diff == initialPosition ) {
				dragDrop.noMove = true;
			}
			
			// If the block has not been moved
			if ( dragDrop.noMove === false ) {
				UI.score.update.moves();
			}
			
			// Checks if game is won when mousemove stops
			if ( dragDrop.isKey && dragDrop.n >= board.blockSize * 5.5 ) {
				// Supports for double key block puzzle
				if ( board.el.querySelectorAll('.block.key').length === 1 ) {
					// dont save moves if this is tutorial end
					if ( ! game.tutorial.pending ) {
						game.puzzle.saveMoves();
					}

					var lvl  = parseInt( $.storage.lvl,  10);
					var best = parseInt( $.storage.best, 10);

					//console.log('curr lvl', lvl );
					//console.log('best lvl', best );

					var isNewLevel = ( lvl >= best ) ? true : false;
					//console.log('new lvl?:', isNewLevel );

					game.animate.keyBlock( dragDrop.draggedObject, function () {
						game.puzzle.win( isNewLevel );
					});
				} else {
					game.animate.keyBlock( dragDrop.draggedObject );
				}
			}

			// Resets values when drags end
			dragDrop.n = 0;
			dragDrop.draggedObject = null;
			dragDrop.noMove = true;
		}
	};

	window.dragDrop = dragDrop;

}( window.board ));