(function () {

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

			clearInterval(this.timer);
			this.timer = setInterval(function () {
				if ( self.audio.currentTime >= self.registry[ trackName ].end ) {
					self.audio.pause();
					clearInterval(self.timer);
				}
			}, 10);
		
		}

		return this;
	};

	// Expose API
	window.AudioSprite = AudioSprite;

}());
