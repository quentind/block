/*! block - v0.1.0 - 2013-03-09 *//*jshint smarttabs:true, laxbreak:true, laxcomma:true */
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
/*jshint smarttabs:true, laxbreak:true, laxcomma:true */
/*global jQuery:true, $:true, UI:true */

(function () {
	'use strict';

	/***
	 * AudioSprite Constructor
	 * -
	 * @param {string} src
	 */
	var AudioSprite = function ( src ) {

		// Path to the audio file ( without extention )
		this.src = src;

		// Storage for sounds
		this.registry = {};

		// Create and init audio element
		this.audio = document.createElement('audio');
		this.audio.autobuffer = true;
		this.audio.load(); // force the audio to start loading (doesn't work in iOS)

	};

	/***
	 * Preload the audio sprite if possible
	 * -
	 * Preload ontouchstart in iOS
	 *
	 * @param {function} loadedCallback
	 */
	AudioSprite.prototype.load = function ( loadedCallback ) {

		var self = this
		  , iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false
		  , ext
		;

		// Determine supported Audio type
		if ( this.audio.canPlayType('audio/ogg; codecs="vorbis"') ) {
			ext = 'ogg';
		} else if ( this.audio.canPlayType('audio/mpeg; codecs="mp3"') ) {
			ext = 'mp3';
		}

		if ( ext ) {

			// Actually trigger load except on iOS
			this.audio.src = this.src + ext;

			if ( iOS ) {

				var body = document.documentElement;

				var preload = function () {
					
					body.removeEventListener('touchstart', preload, true);

					self.audio.play();
					setTimeout(function () {
						self.audio.pause();
					}, 1000 );
					
				};
				
				body.addEventListener('touchstart', preload, true );

				loadedCallback();
				
				return;
			}

			var onCanPlayThrough = function () {
				
				$(this).removeEvent('canplaythrough', onCanPlayThrough );

				if ( typeof loadedCallback === 'function' ) {
					loadedCallback();
				}

			};

			$(this.audio).addEvent('canplaythrough', onCanPlayThrough, false);

		}

		return this;

	};

	/***
	 * Register a track within the audio sprite
	 */
	AudioSprite.prototype.register = function ( trackName , start, end ) {

		this.registry[ trackName ] = {
			start: start,
			end: end
		};

		return this;

	};

	/***
	 * Plays a given track within the audio sprite
	 */
	AudioSprite.prototype.play = function ( trackName, volume ) {

		if ( ! this.registry[ trackName ] ) {
			console.log('could not find the track');
			return;
		}

		if ( UI.status.muted === false ) {
			
			this.audio.volume = volume || 1;
		
			this.audio.pause();
			this.audio.currentTime = this.registry[ trackName ].start;
			this.audio.play();

			this.timer = null;

			var self = this;

			clearTimeout( this.timer );

			var timerFn = function () {
				if ( self.audio.currentTime >= self.registry[ trackName ].end ) {
					self.audio.pause();
					clearTimeout( self.timer );
				} else {
					setTimeout( timerFn, 10);	
				}
			};

			this.timer = setTimeout(timerFn, 10);
		
		}

		return this;
	};

	// Expose API
	window.AudioSprite = AudioSprite;

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
			parMoves: 32,
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
			parMoves: 47,
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
			parMoves: 37,
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
		event: {
			move: document.ontouchstart === undefined ? 'mousemove' : 'touchmove',
			end: document.ontouchstart === undefined ? 'mouseup' : 'touchend'
		},

		startDragMouse: function ( e ) {

			//console.log( e.type );
			
			dragDrop.startDrag(this);
			
			if ( this.className.indexOf('key') >= 0 ) {
				dragDrop.isKey = true;
			} else {
				dragDrop.isKey = false;	
			}
			
			var evt = e || window.event;

			//console.log( evt.touches );
			//console.log( evt.touches[0].clientX );
			
			if (evt.touches && evt.touches.length) {
				dragDrop.initialMouseX = evt.touches[0].clientX;
				dragDrop.initialMouseY = evt.touches[0].clientY;
			} else {
				dragDrop.initialMouseX = evt.clientX;
				dragDrop.initialMouseY = evt.clientY;
			}
			
			$(document)
				.addEvent( dragDrop.event.move, dragDrop.dragMouse )
				.addEvent( dragDrop.event.end, dragDrop.unBind );
			
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

			var evt = e || window.event
			  , dx
			  , dy
			;

			//console.log( dragDrop.initialMouseX );
			//console.log( evt.touches );
			//console.log( evt.touches[0].clientX );
			
			if (evt.touches && evt.touches.length) {
				dx = evt.touches[0].clientX - dragDrop.initialMouseX;
				dy = evt.touches[0].clientY - dragDrop.initialMouseY;
			} else {
				dx = evt.clientX - dragDrop.initialMouseX;
				dy = evt.clientY - dragDrop.initialMouseY;
			}

			//console.log(dx);
			//console.log(dy);

			dragDrop.setPosition( dx , dy, evt );
			
			return false;
		},
		
		setPosition: function ( dx, dy, evt ) {

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
			
			// If block cant move further bottom or right
			if ( n === maxBlock && ! dragDrop.blockIsAtMaxPosition && ! dragDrop.noMove ) {
				
				// Special case for key block which should not trigger 
				// sound when reaching right edge of the board
				if ( ! dragDrop.isKey || maxBlock < 4 * board.blockSize ) {
					dragDrop.blockIsAtMaxPosition = true ;
					sounds.play( 'knock', 0.6 );
				}

			// If block cant move further top or left
			} else if ( n === minBlock && ! dragDrop.blockIsAtMinPosition && ! dragDrop.noMove ) {
				dragDrop.blockIsAtMinPosition = true ;
				sounds.play( 'knock', 0.6 );

			} else {

				if ( n < maxBlock) {
					dragDrop.blockIsAtMaxPosition = false ;
				} 

				if ( n > minBlock) {
					dragDrop.blockIsAtMinPosition = false ;
				}

			}

			dragDrop.draggedObject.style[ dir ] = n + 'px';

			// Special case for webkit
			if ( dragDrop.isKey && evt.clientX >= $.docWidth() ) {
				dragDrop.unBind();
			}
			
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
			
			// Play sounds only if block position is adjusted
			if ( diff * board.blockSize !== n ) {
				var delta = n - diff;
				
				// If block was moved and is not key block or is moved towards the left edge
				if ( delta !== 0 && ( dragDrop.isKey === false || n < 320 ) ) {
					// volume = (abs block movement length) / (ratio in block size) * (modifier = 2)
					delta = Math.abs( delta ) / 80 * 2;
					sounds.play( 'knock', delta );
				}
			}

			$(document)
				.removeEvent( dragDrop.event.move, dragDrop.dragMouse )
				.removeEvent( dragDrop.event.end, dragDrop.unBind );
			
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
			if ( dragDrop.isKey && ( dragDrop.n >= board.blockSize * 5 || diff >= board.blockSize * 5 ) ) {
				// Supports for double key block puzzle
				if ( board.el.querySelectorAll('.block.key').length === 1 ) {
					// dont save moves if this is tutorial end
					if ( ! game.tutorial.pending ) {
						game.puzzle.saveMoves();
					}

					var lvl  = parseInt( $.storage.lvl,  10);
					var best = parseInt( $.storage.best, 10);
					var isNewLevel = ( lvl >= best ) ? true : false;
					
					game.animate.keyBlock( dragDrop.draggedObject, function () {
						game.puzzle.win( isNewLevel );
					});

					sounds.play( 'win', 0.7 );

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

}( window.board, window.sounds ));
/*jshint smarttabs:true, laxbreak:true, laxcomma:true */
/*global jQuery:true, $:true, UI:true */

/**
 * Dependencies : puzzle, dragDrop, AudioSprite
 **/
(function ( puzzle, dragDrop, AudioSprite ) {
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
	 * PRE-LOAD COMPONENTS before init
	 ***/
	game.load = function () {

		var resource = [
				{
					src: '/_dev/img/sprite.png',
					type: 'image'
				},
				{
					src: '/_dev/audio/sprite.',
					type: 'audio'
				}
			]
		  , l = resource.length
		  , i = 0
		  , preload
		  , loadedCount = 0
		  , resourceLoaded
		;

		resourceLoaded = function () {

			loadedCount++;

			if ( loadedCount === l ) {
				$.delay( game.init, config.loadDelay );
			}
		};

		preload = function ( src, type ) {

			if ( type === 'audio' ) {

				if ( $.support.audio ) {

					window.sounds = new AudioSprite( src );

					window.sounds.load( resourceLoaded );
					window.sounds.register('knock', 2.521, 2.6 );
					window.sounds.register('win', 3.8, 5.865 );

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
			preload( resource[ i ].src, resource[ i ].type );
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

				$(el).addEvent( startEvent, dragDrop.startDragMouse, true );

			}

			game.$.play[0].appendChild( frag );

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
			  , html =  '<div id="instructions" class="instructions">Slide blocks forward or backward in order to free the red one.</div><div class="instruction-arrow pos-1">&larr;</div><div class="instruction-arrow pos-2">&darr;</div><div class="instruction-arrow pos-3">&rarr;</div>'
			;

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
										$(window).trigger('tutorialReady');
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
					$(window).trigger('tutorialReady');
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

}( window.puzzle, window.dragDrop, window.AudioSprite ));
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