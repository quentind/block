/*jshint smarttabs:true, laxbreak:true, laxcomma:true, newcap:false */
/*global jQuery:true, $:true, UI:true */

(function () {
	'use strict';

	var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false;

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
		this.audio.preload = "auto"; // Opera needs this to preload the audio
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
		  , ext
		;

		/**
		 * For non iOS device or iOS devices connected to network (we assume there is an internet connection)
		 */
		if ( ! iOS || iOS && window.navigator.onLine === true ) {

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

		} else {
			if ( typeof loadedCallback === 'function' ) {
				loadedCallback();
			}
		}

		return this;

	};

	/***
	 * Register a track within the audio sprite
	 */
	AudioSprite.prototype.register = function ( trackName , start, end ) {

		var self = this;

		/**
		 * For non iOS device or iOS devices connected to network (we assume there is an internet connection)
		 */
		if ( ! iOS || iOS && window.navigator.onLine === true ) {

			this.registry[ trackName ] = {
				start: start,
				end: end
			};

		}

		/**
		 * iOS devices that support Web Audio API
		 * -
		 * iOS has a bug preventing playing sounds using HTML5 <audio> when offline
		 * so we use Web Audio API if available
		 */
		else if ( 'AudioContext' in window || 'webkitAudioContext' in window ) {
		
			var arrayBuff = Base64Binary.decodeArrayBuffer( window.iOS_sounds[ trackName ] );
			self.ctx = new webkitAudioContext() || new AudioContext();
			self.volume = self.ctx.createGainNode();
			self.registry[ trackName ] = arrayBuff;

		}

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

		var self = this;

		if ( UI.status.muted === false ) {
			
			/**
			 * For non iOS device or iOS devices connected to network (we assume there is an internet connection)
			 */
			if ( ! iOS || iOS && window.navigator.onLine === true ) {
			
				this.audio.volume = volume || 1;

				this.audio.pause();
				this.audio.currentTime = this.registry[ trackName ].start;
				this.audio.play();

				this.timer = null;				

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
			/**
			 * iOS devices that support Web Audio API
			 * -
			 * iOS has a bug preventing playing sounds using HTML5 <audio> when offline
			 * so we use Web Audio API if available
			 */
			else if ( 'AudioContext' in window || 'webkitAudioContext' in window ) {

				self.ctx.decodeAudioData( self.registry[ trackName ], function( audioData ) {
				
					var source = self.ctx.createBufferSource();
					source.buffer = audioData;
					source.connect( self.volume );

					self.volume.connect(self.ctx.destination);
					self.volume.gain.value = volume;
					//console.log( self.volume.gain.value );

					if ('AudioContext' in window) {
						source.start(0);
					} else if ('webkitAudioContext' in window) {
						source.noteOn(0);
					} 

				});

			}
		
		}

		return this;
	};

	// Expose API
	window.AudioSprite = AudioSprite;

}());
