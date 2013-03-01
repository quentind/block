/*jshint smarttabs:true, laxbreak:true, laxcomma:true */
(function() {
	'use strict';

	/***
	 * BETTER MINIFICATION
	 ***/
	var doc = document
	  , html = doc.documentElement
	  , body = doc.body
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

		//console.log( selector, typeof selector, selector.childNodes );

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
			if ( typeof selector === 'object' || typeof selector === 'function' ) {
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

			if ( element.addEventListener ) {
				// BBOS6 doesn't support handleEvent, catch and polyfill
				try {
					element.addEventListener(evt, fn, false);
				} catch(e) {
					if (typeof fn == 'object' && fn.handleEvent) {
						element.addEventListener(evt, function(e){
							// Bind fn as this and set first arg as event object
							fn.handleEvent.call(fn,e);
						}, false);
					} else {
						throw e;
					}
				}
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

	/**
	 * FastClick on touch devices
	 * -
	 * @param {node} element
	 * @param {function} handler
	 * 
	 * https://github.com/h5bp/mobile-boilerplate/blob/master/js/helper.js#L93
	 */
	priv.fastClick = function ( element, handler ) {
		
		// Reference to element and handler
		this.element = element;
		this.handler = handler;

		// Number of pixels required in a touch move to cancel the click
		this.moveThreshold = 10;
		
		// 
		priv.addEvent( element, 'touchstart', this, false );
		priv.addEvent( element, 'click', this, false );
	};


	/**
	 * HandleEvent to catch any type of event
	 * -
	 * @param {event} event
	 */
	priv.fastClick.prototype.handleEvent = function ( event ) {

		this.event = event || window.event;
		this.touch = +event.touches[0];

		switch ( event.type ) {
			case
				'touchstart': this.onTouchStart();
				break;
			case 
				'touchmove': this.onTouchMove();
				break;
			case
				'touchend': this.onClick();
				break;
			case 'click': this.onClick();
				break;
		}

	};

	/**
	 * Touchstart handler
	 */
	priv.fastClick.prototype.onTouchStart = function () {
		
		this.event.stopPropagation();
		
		this.element.addEventListener('touchend', this, false);
		body.addEventListener('touchmove', this, false);

		this.startX = this.touch.clientX;
		this.startY = this.touch.clientY;
	};

	/**
	 * Touchmove handler
	 */
	priv.fastClick.prototype.onTouchMove = function () {

		if ( Math.abs( this.touch.clientX - this.startX ) > this.moveThreshold || Math.abs( this.touch.clientY - this.startY ) > this.moveThreshold ) {
			this.reset();
		}
	};

	/**
	 * Click handler
	 * -
	 * Apply the click handler and prevent ghost clicks if a touch event was fired
	 */
	priv.fastClick.prototype.onClick = function () {
		
		var e = this.event;

		if ( e.stopPropagation ) {
			event.stopPropagation();
		}

		this.reset();
		this.handler.apply( e.currentTarget, [e] );

		if ( e.type === 'touchend' ) {
			priv.preventGhostClick( this.startX, this.startY );
		}
	};

	/**
	 * Remove touchend and touche move event listener
	 * -
	 * Called when the user touchmove too far away from the initial touchstart
	 */
	priv.fastClick.prototype.reset = function () {
		priv.removeEvent( this.element, 'touchend', this, false );
		priv.removeEvent( body, 'touchmove', this, false );
	};

	/**
	 * Remove all event handler related to fastClick from the element
	 * -
	 * Used in lib.removeEvent
	 */
	priv.fastClick.prototype.unbind = function () {
		priv.removeEvent( this.element, 'click', this );
		priv.removeEvent( this.element, 'touchstart', this );
		priv.removeEvent( this.element, 'touchend', this );
		priv.removeEvent( this.element, 'touchmove', this );
	};

	/**
	 * Holds coord for preventGhostClick and ghostClickHandler
	 */
	priv.coords = [];

	/**
	 * Bust all 'click' events that were fired within the treshold of the provided x, y coordinates in the next 2.5s
	 * -
	 * @param {int} x,y - touch[0].clientX/Y
	 */
	priv.preventGhostClick = function ( x, y ) {
		priv.coords.push( x, y );
		window.setTimeout(function() {
			priv.coords.splice(0, 2);
		}, 2500);
	};

	/**
	 * Detect Android 2.3 devices
	 * -
	 * Doesnt create false positive on Blackvberry devices
	 * https://github.com/Modernizr/Modernizr/issues/372
	 */
	priv.dodgyAndroid = ( 'ontouchstart' in window ) && ( navigator.userAgent.indexOf('Android 2.3') != -1 );

	/**
	 * Prevent ghostClick from firing
	 */
	if ( doc.addEventListener ) {
		doc.addEventListener('click', priv.ghostClickHandler, true);
	}

	/**
	 * Set a flag if a touchstart event has been fired in the page
	 * -
	 * Used to prevent event firing from page to page when using fastClick
	 * to change window.location on Android 2.3 devices
	 */
	priv.addEvent(document.documentElement, 'touchstart', function() {
		priv.hadTouchEvent = true;
	}, false);

	/**
	 * Ghost clicks detection
	 * -
	 * Prevents ghost clicks form firing and fix Android 2.3 bug
	 */
	priv.ghostClickHandler = function ( event ) {

		/*
		 * Fix Android 2.3 issue
		 * -
		 * If window.location is changed via fastClick, a click event will fire
		 * on the new page, as if the events are continuing from the previous page.
		 * We pick that event up here, but priv.coords is empty, because it's a new page,
		 * so we don't prevent it. Here's we're assuming that click events on touch devices
		 * that occur without a preceding touchStart are to be ignored.
		 */
		if ( ! priv.hadTouchEvent && priv.dodgyAndroid ) {
			// This is a bit of fun for Android 2.3...
			// 
			event.stopPropagation();
			event.preventDefault();
			return;
		}

		/*
		 * If we catch a click event inside a 25px radius and within the time threshold
		 * then we stopPropagation and preventDefault, preventing the link from being activated
		 */
		var i = 0
		  , l = priv.coords.length
		;

		for ( ; i < l; i += 2 ) {
			
			var x = priv.coords[ i ]
			  , y = priv.coords[ i + 1 ]
			;
			
			if ( Math.abs( event.clientX - x ) < 25 && Math.abs( event.clientY - y ) < 25 ) {
				event.stopPropagation();
				event.preventDefault();
			}
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
		 * Append html or node to each node of the collection
		 * -
		 * @param {string|object} content
		 */
		append: function ( content ) {

			var frag = doc.createDocumentFragment()
			  , tmp = doc.createElement('div')
			  , i = 0
			  , l
			;

			if ( typeof content === 'string' ) {
				tmp.innerHTML = content;
			} else if ( typeof content === 'object' ) {
				tmp.appendChild( content );
			}

			l = tmp.childNodes.length;

			for ( ; i < l; i++ ) {
				frag.appendChild( tmp.childNodes[i].cloneNode(true) );	
			}
			
			priv.each( this, function () {
				this.appendChild( frag );
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
			
			/*
			 * Touch event
			 * -
			 * Support for click on touch devices, use fastClick from H5MBP
			 * https://github.com/h5bp/mobile-boilerplate/blob/master/js/helper.js
			 */
			if ( evt === 'click' && document.ontouchstart !== undefined ) {
				priv.each( this, function () {
					
					this.fastClick = new priv.fastClick( this, fn );
				
				});
			}

			/*
			 * Regular events
			 */
			else {

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
			
			/*
			 * Touch event
			 * -
			 * Support for click on touch devices, use fastClick from H5MBP
			 * https://github.com/h5bp/mobile-boilerplate/blob/master/js/helper.js
			 */
			if ( evt === 'click' && document.ontouchstart !== undefined ) {
				priv.each( this, function () {
					
					this.fastClick.unbind();

				});
			}

			/*
			 * Regular events
			 */
			else {

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
			var API = {
					enable: function ( test ) {
						var fn = html.requestFullscreen || html.mozRequestFullScreen || html.webkitRequestFullScreen;
						if ( ! test ) {
							fn.call( html );
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
	 * @param {int} delay (ms)
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
	 * @returns {int}
	 */
	lib.docHeight = function () {
		return Math.max(
			Math.max(body.offsetHeight, html.offsetHeight),
			Math.max(body.clientHeight, html.clientHeight)
		);
	};
	
	/**
	 * Return width of the document
	 * -
	 * @returns {int}
	 */
	lib.docWidth = function () {
		return Math.max(
			Math.max(body.offsetWidth, html.offsetWidth),
			Math.max(body.clientWidth, html.clientWidth)
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