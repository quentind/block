/* Block Game - v0.1 
 * 2012-09-26
 * 
 * Copyright (c) 2012 Quentin De Smedt;
 * Licensed 
 */

/*jshint smarttabs:true, laxbreak:true, laxcomma:true */
(function() {
	'use strict';

	/***
	 * BETTER MINIFICATION
	 ***/
	var doc = document
	  , html = doc.documentElement
	  , lib
	  , Lib
	  , priv
	;

	/***
	 * $ LIB
	 ***/
	lib = function( selector, context ) {
		return new Lib( selector, context );
	};

	/***
	 * CONSTRUCTOR / SELECTOR
	 * -
	 * @param {string|object} selector
	 * @param {object} context - expect node
	 ***/
	Lib = function( selector, context ) {

		var nodes = []
		  , i = 0
		  , l = 0
		  , ctx = context || document
		;

		// Uses getElementById selector contains '#'
		if ( typeof selector === 'string' && selector.indexOf('#') > -1 ) {
			selector = selector.replace('#', '');
			nodes = ctx.getElementById( selector );

			if ( nodes !== null ) {
				l = 1;
				this[0] = nodes;
			} else {
				l = 0;
				this[0] = null;
			}		

		} else {
			// Selector is an object
			if ( typeof selector === 'object' ) {
				nodes = selector;
			// Selector is a string without '#', getElementsByTagName (usually better than QSA for speed, intented to be used with a context)
			} else if ( typeof selector === 'string' ) {
				nodes = ctx.getElementsByTagName( selector );
			}

			l = nodes.length || 1;

			if ( l === 1 ) {
				this[0] = nodes[0] = selector;
			} else {
				for ( ; i < l; i++ ) {
					this[i] = nodes[i];
				}
			}
		}

		this.length = l;
	  
		return this;
	};

	/***
	 * PRIVATE METHODS
	 ***/
	priv = {

		/**
		 * Loops through each node of a collection (objects) and apply callback to each
		 * (shamelessly stolen from jQuery, with small modifications)
		 * -
		 * @param {nodes} objects
		 * @param {function} callback
		 * @param {array||object} args
		 */
		each: function( objects, callback, args ) {

			var name
			  , i = 0
			  , length = objects.length
			  , isObj = length === undefined
			;

			if ( args ) {
				if ( isObj ) {
					for ( name in objects ) {
						if ( callback.apply( objects[ name ], args ) === false ) {
							break;
						}
					}
				} else {
					for ( ; i < length; ) {
						if ( callback.apply( objects[ i++ ], args ) === false ) {
							break;
						}
					}
				}
			} else {
				if ( isObj ) {
					for ( name in objects ) {
						if ( callback.call( objects[ name ], name, objects[ name ] ) === false ) {
							break;
						}
					}
				} else {
					for ( ; i < length; ) {
						if ( callback.call( objects[ i ], i, objects[ i++ ] ) === false ) {
							break;
						}
					}
				}
			}

			return objects;
		},

		/**
		 * Determine if given element has the given class
		 * -
		 * @param {node} element
		 * @param {string} _class
		 */
		hasClass: function (element, _class ) {
			return element.className.match(new RegExp('(\\s|^)' + _class + '(\\s|$)'));
		},

		/**
		 * Bind an event handler to given element
		 * -
		 * @param {node} element
		 * @param {eventType} evt
		 * @param {function} fn
		 * @param {boolean} fixed - fix attachEvent, not always wanted
		 */
		addEvent: function ( element, evt, fn, fixed ) {
			if (element.addEventListener) {
				element.addEventListener( evt, fn, false );
			} else if (element.attachEvent) {
				if ( fixed === true) {
					var curEl = element;
					element.attachEvent( 'on' + evt, function (e) {
						fn.apply(curEl, [e]);
					});
				} else {
					element.attachEvent( 'on' + evt, fn );
				}
			}
		},

		/**
		 * Remove an event handler from given element
		 * -
		 * @param {node} element
		 * @param {eventType} evt
		 * @param {function} fn
		 */
		removeEvent: function (element, evt, fn ) {
			if (element.removeEventListener) {
				element.removeEventListener( evt, fn, false );
			} else if (element.detachEvent) {
				element.detachEvent( 'on' + evt, fn );
			}
		},

		/**
		 * Custom events
		 * -
		 * Based on NCZ's custom events
		 * http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
		 */
		customEvent: function () {

			var EventTarget = function () {
				this._listeners = {};
			};
			
			EventTarget.prototype = {

				constructor: EventTarget,

				add: function ( type, listener ) {
					
					if ( typeof this._listeners[ type ] == "undefined" ) {
						this._listeners[ type ] = [];
					}

					this._listeners[ type ].push( listener );
				},

			    trigger: function ( event ) {
			        
			        if ( typeof event == 'string' ) {
			            event = { type: event };
			        }
			        
			        if ( ! event.target ) {
			            event.target = this;
			        }

			        if ( ! event.type ) { // falsy
			            throw new Error('Event object missing "type" property.');
			        }

			        if ( this._listeners[ event.type ] instanceof Array ) {
			            var listeners = this._listeners[ event.type ]
			              , l = listeners.length
			              , i = 0
			            ;

			            for ( ; i < l ; i++ ) {
			                listeners[i].call( this, event );
			            }
			        }
			    },

			    remove: function( type, listener ) {
			        if ( this._listeners[ type ] instanceof Array ) {
			            var listeners = this._listeners[ type ]
			              , l = listeners.length
			              , i = 0
			            ;

			            for ( ; i < l; i++ ) {
			                if ( listeners[i] === listener ) {
			                    listeners.splice( i, 1 );
			                    break;
			                }
			            }
			        }
			    }

			};

			return new EventTarget();
		}

	};

	// Expose prototype object
	Lib.prototype = {
		
		/***
		 * FACADE API METHODS
		 ***/

		/**
		 * Loops through each node of the collection and apply callback
		 * -
		 * @param {function} callback
		 * @param {array} args
		 */
		each: function ( callback, args ) {
			return priv.each(this, callback, args);
		},

		/**
		 * Show collection
		 * -
		 */
		show: function () {
			priv.each(this, function () {
				this.style.display = 'block';
			});
			return this;
		},

		/**
		 * Hide collection
		 * -
		 */
		hide: function() {
			priv.each(this, function () {
				this.style.display = 'none';
			});
			return this;
		},

		/**
		 * Remove collection from the DOM
		 * -
		 */
		remove: function() {
			priv.each(this, function () {
				this.parentNode.removeChild(this); 
			});
			return this;
		},

		/**
		 * Determine if any node of the collection has a class
		 * -
		 * @param {string} _class
		 */
		hasClass: function ( _class ) {
			var result = false;

			priv.each(this, function () {
				if ( priv.hasClass( this, _class ) ) {
					result = true;
				}	
			});
			
			return result;
		},

		/**
		 * Remove a class to each node of the collection
		 * -
		 * @param {string} _class
		 */
		removeClass: function ( _class ) {
		   var self = this;

			priv.each(this, function () {
				if ( priv.hasClass( this, _class ) ) {
					var reg = new RegExp('(\\s|^)' + _class + '(\\s|$)');
					this.className = this.className.replace(reg, ' ');
				}
			});
			return this;
		},

		/**
		 * Add a class to each node of the collection
		 * -
		 * @param {string} _class
		 */
		addClass: function ( _class ) {
			var self = this;

			priv.each(this, function () {
				if ( ! priv.hasClass( this, _class ) ) {
					this.className += ' ' + _class; 
				}
			});
			return this;
		},

		/**
		 * Bind an event handler to current collection
		 * -
		 * @param {eventType} evt
		 * @param {function} fn
		 * @param {boolean} fixed - fix attachEvent, not always wanted
		 * @param {boolean} isCustomEvent
		 */
		addEvent: function ( evt, fn, fixed, isCustomEvent ) {

			// Custom event
			if ( isCustomEvent ) {

				priv.each( this, function () {
					// Create customEvent object only if it hasn't been created yet
					if ( ! this.customEvent) {
						this.customEvent = priv.customEvent();
					}
					this.customEvent.add( evt, fn );
				});

			// Regular event
			} else {

				priv.each(this, function () {
					priv.addEvent(this, evt, fn, fixed);
				});

			}
			return this;
		},

		/**
		 * Remove an event handler from current collection
		 * -
		 * @param {eventType} evt
		 * @param {function} fn
		 * @param {boolean} isCustomEvent
		 */
		removeEvent: function ( evt, fn, isCustomEvent ) {
			
			// Custom event
			if ( isCustomEvent ) {

				priv.each( this, function () {
					if ( this.customEvent) {
						// There is at least one custom event
						this.customEvent.remove( evt, fn );
					}
				});

			// Regular event
			} else {

				priv.each(this, function () {
					priv.removeEvent(this, evt, fn);
				});

			}

			return this;
		},

		/**
		 * Trigger a custom event to each element of current collection
		 * (no support for triggering real events ATM)
		 * -
		 * @param {eventType} evt
		 */
		trigger: function ( evt ) {

			priv.each( this , function () {
				if ( this.customEvent ){
					this.customEvent.trigger({
						type: evt,
						target: this
					});
				}
			});

			return this;
		},

		/**
		 * Bind successive event handlers to collection (mostly used for transitions)
		 * -
		 * @param {eventType} evt
		 * @param {array} arrayOfFunctions
		 * @param {boolean} fireOnce - prevent event from firing multiple time
		 * TODO: add param to restart to first fn when end of queue is reached
		 */
		chainEvents: function ( evt, arrayOfFunctions, fireOnce ) {

			priv.each( this, function () {

				var i = 0 
				  , fn = function ( e ) {

						arrayOfFunctions[i].apply(this);
						priv.removeEvent(this, evt, fn);

						i++;

						// Do not rebind event if there is no function left in the arrayOfFunction
						if ( arrayOfFunctions[i] ) {
							if ( fireOnce ) {
								// setTimeout prevents event from firing multiple in a row
								// => transitionEnd event fire once for each property
								setTimeout(function () {
									priv.addEvent(this, evt, fn);
								},0);
							} else {
								priv.addEvent(this, evt, fn); 
							}
						}

					}
				;

				priv.addEvent( this, evt, fn , false);

			});
			
			return this;
		},

		

		/**
		 * Get the value of a given attribute from first element of the collection
		 * -
		 * @param {string} attr
		 */
		attr: function ( attr ) {

			var result;

			if ( this[0].getAttribute ) {
			
				result = this[0].getAttribute(attr);
			
			} else {

				if ( ! result ) {
					var attrs = this.attributes || []
					  , l = attrs.length
					  , i = 0
					;
					for ( ; i < l; i++ ) {
						if(attrs[i].nodeName === attr) {
							result = attrs[i].nodeValue;
						}
					}
				}

			}

			return result;
		}
	};

	/***
	 * PUBLIC METHODS
	 ***/
	lib.support = {

		/**
		 * Checks if transition events are available
		 * -
		 * @return {string|boolean} transition event keyword or false if transition events are not supported
		 */
		transitionEvent: function () {
			var t
			  , el = doc.createElement('test')
			  , transitions = {
				  'transition': 'transitionEnd',
				  'OTransition': 'oTransitionEnd',
				  'MSTransition': 'msTransitionEnd',
				  'MozTransition': 'transitionend',
				  'WebkitTransition': 'webkitTransitionEnd'
				}
			  , support
			;

			for ( t in transitions ) {
				if( el.style[t] !== undefined ) {
					support = transitions[t];
				}
			}

			if ( ! support ) {
				html.className += ' no-transition-event';
			}

			return support || false;
		}(),

		/**
		 * Checks if local storage is supported
		 * - 
		 * @returns {boolean||object} false if unsupported, local storage object if supported
		 */
		storage: function() {
			
			try {
				//return ('localStorage' in window) && window.localStorage !== null // web
				return ('localStorage' in window) && window.localStorage !== null && window.localStorage !== undefined; // Local
			} catch(e) {
				html.className += ' no-storage';
				return false;
			}

		}(),

		/**
		 * Audio
		 * -
		 * @returns {boolean|string} false if unsupported, string of the compatible playType if supported
		 */
		audio: function () {

			var audio = doc.createElement('audio')
			  , canPlayMp3 = !!audio.canPlayType && "" !== audio.canPlayType('audio/mpeg')
			  , canPlayOgg = !!audio.canPlayType && "" !== audio.canPlayType('audio/ogg; codecs="vorbis"')
			  , ext = ''
			;

			if ( audio.canPlayType ) {
					if ( canPlayMp3 ) {
						ext = 'mp3';
					} else if ( canPlayOgg ) {
						ext = 'ogg';
					} else {
						return false;
					}
					return ext;
			}

			html.className += ' no-audio';
			return false;
		  
		}(),

		/**
		 * Checks if fullscreen API is supported
		 * -
		 * @returns {object||false} false is unsupported, API object is supported
		 */
		fullscreen: function () {

			// checks for fullscreen support
			var docEl = doc.documentElement
			  , API = {
					enable: function ( test ) {
						var fn = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen;
						if ( ! test ) {
							fn.call( docEl );
						}
						return fn || false;
					},
					cancel: function ( test ) {
						var fn = doc.exitFullscreen || doc.cancelFullScreen || doc.mozCancelFullScreen || doc.webkitCancelFullScreen;
						if ( ! test ) {
							fn.call( doc );
						}
						return fn || false;
					}
				}
			;

			if ( API.enable( true ) && API.cancel( true ) ) {
				return API;
			}

			html.className += ' no-fullscreen';
			return false;

		}()
	};

	/**
	 * Wrapper for setTimeout
	 * -
	 * @param {function} fn
	 * @param {array|string|object} args
	 * @param {number} delay (ms)
	 **/
	lib.delay = function ( fn, args, delay ) {

		// if there is only two argument, use second argument as delay parameter
		delay = ( arguments.length > 2 ) ? delay : args;

		setTimeout(function () {
		
			fn( args );
		
		}, delay);

	};

	/**
	 * Prevent default event from bubbling and firing
	 * -
	 * @param {event} e
	 */
	lib.preventDefault = function ( e ) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		} 
	};

	/**
	 * Return height of the document
	 * -
	 * @returns {number}
	 */
	lib.docHeight = function () {
		return Math.max(
			Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
			Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
			Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
		);
	};
	
	/**
	 * Return width of the document
	 * -
	 * @returns {number}
	 */
	lib.docWidth = function () {
		return Math.max(
			Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
			Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
			Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
		);
	};

	/**
	 * Wrapper for local stoage
	 * -
	 * @returns {localStorage||object}
	 */
	lib.storage = ( lib.support.storage ) ? window.localStorage : {};


	// Expose lib to global scope
	window.lib = window.$ = lib;

}());
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
			parMoves: 0,
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

		// 10
		{
			parMoves: 0,
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

		// 11
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

		// 12
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

		// 13
		{
			parMoves: 0,
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

		// 14
		{
			parMoves: 0,
			blocks: [
				new Block( 2, 0, 2, 'h', true )
			  , new Block( 0, 2, 2, 'v', false )
			  , new Block( 0, 3, 3, 'h', false )
			  , new Block( 1, 3, 2, 'v', false )
			  , new Block( 2, 5, 3, 'v', false )
			  , new Block( 3, 0, 2, 'h', false )
			  , new Block( 3, 3, 2, 'h', false )
			  , new Block( 4, 0, 2, 'v', false )
			  , new Block( 4, 1, 2, 'v', false )
			  , new Block( 4, 2, 2, 'h', false )
			  , new Block( 5, 2, 2, 'h', false )
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
			parMoves: 0,
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
			parMoves: 0,
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
			parMoves: 0,
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
			parMoves: 0,
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
			parMoves: 0,
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
			parMoves: 0,
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
		},

		// 24
		{
			parMoves: 0,
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

		// 25
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
			$.delay( game.init.verify, config.loadDelay );
		};

		preload.src = config.spriteURL;

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

			// TODO ? : when win(), blocks out puis popover avec recap et bouton restart si 'par' pas obtenu (éventuellement système d'étoiles) et boutton next.
			// ça rêgle le problème des transitions pour ce cas-ci
			
			// audio.play();
			// http://html5doctor.com/native-audio-in-the-browser/

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

				// TODO: disable UI when animation is pending

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
	 * - TODO: rewrite this shit
	 ***/
	game.init = {

		status: false,

		board: function () {
			$(document.documentElement).addClass('ready');
			game.animate.board();
		},

		all: function () {
			game.puzzle.init();
			game.init.board();
			game.init.status = true;
		},

		verify: function () {
			$(window).addEvent('resize', game.onResizeWindow );
			if ( ! game.screen.isTooSmall() ) {
				game.init.all();
			}
		}
	};

	/***
	 * Screen enabling and disabling
	 * TODO: rewrite this shit ?
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
	 * Update window.board.offset.left and .top
	 * -
	 * Called on each window resize
	 ***/
	game.updateOffsets = function () {
		window.board.offset.left = game.$.play[0].offsetLeft;
		window.board.offset.top  = game.$.play[0].offsetTop;
	};

	/***
	 * Resize window event handler
	 ***/
	game.onResizeWindow = function () {
		if ( ! game.screen.isTooSmall() ) {
			if ( game.init.status === false ) {
				game.init.all();
			}
			game.updateOffsets();
		}
	};

	/***
	 * ANIMATION OF GAME ELEMENTS - Blocks, board, ...
	 ***/
	game.animate = {

		/**
		 * Bring board in
		 * TODO: rewrute animate board
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
		 * TODO: gérer le fait que quand on animate out provisoirement (sans remove), il faut disable le click et hover sur les blocks => technique du transition-delay sur visibility
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
	// When player has finished every puzzle
	game.credit = function () {

	};

	window.game = game;

}( window.puzzle, window.dragDrop ));