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