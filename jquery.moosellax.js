/**
 *
 * jQuery Parallax Plugin for basic parallax effect
 *
 * Usage: $('.parallax').moosellax();
 *
 * Options: set per element that will have the parallax effect using a data attribute
 * 		dir: "up", "down" - which direction will the element move (default: "up")
 *		axis: "x" , "y" - animate on x or y axis (default: "y")
 *		rangeMin: int - scrollTop position to start animating (default: 0)
 *		rangeMax: int - scrollTop position to stop animating (default: 0 - no max)
 *		speed: int - speed to animate; 1 matches scroll rate higher number moves less, lower moves more
 *
 */

;(function($, window, undefined){

  var $window = $(window);

  //  constructor - do not modify below values
  var Moosellax = function( elem, options ) {
	this.badBrowser = false;
	this.offset = 0;
	this.axis = 0;
	this.posX = 0;
	this.posY = 0;
	this.elem = $(elem);
	this.rangeMax = 0;
	this.rangeMin = 0;
	this.dir = (this.elem.data('dir')) ? this.elem.data('dir') : "up";
	this.speed = (this.elem.data('speed')) ? this.elem.data('speed') : 0;

	if(typeof this.elem.css('backgroundPosition') == 'undefined') {
		this.badBrowser = true;
	}

	if( this.badBrowser ) {
		this.oldBrowserInit();
	} else {
		this.init();
	} 

	var that = this;

	$window.scroll(function() {
		//parallax
		// Scroll the background at var speed
		// the yPos computed based on teh direction the element should animate!
		var scrollPos = $window.scrollTop();		

		if( that.inRange(scrollPos, that.rangeMax, that.rangeMin) ) {

			var newPos = (that.dir == "down") ? ( ( ( scrollPos - that.rangeMin ) / that.speed ) + that.offset ) : (that.offset - ( ( scrollPos - that.rangeMin ) / that.speed ) );
			var coords = '';
			if(that.axis == 'y') {
				// Put together our final background position
				coords = that.posX + ' ' + newPos + 'px';
			} else {
				coords = newPos + 'px ' + that.posY;
			}
			// Move the background
			that.elem.css({ backgroundPosition: coords });

		}
		
		
	});
  };

  Moosellax.prototype = {
	defaults: {

	},

	init: function() {
		this.axis = ( this.elem.data('axis') ) ? this.elem.data('axis') : 'y';
		var Pos = this.elem.css('backgroundPosition').split(' ');
		this.offset = (this.axis == 'y') ? parseInt( Pos[1].replace('px', '') ) : parseInt( Pos[0].replace('px', '') );
		this.posX = Pos[0];
		this.posY = Pos[1];
		this.rangeMax = ( this.elem.data('rangemax') ) ? this.elem.data('rangemax') : 0;
		this.rangeMin = ( this.elem.data('rangemin') ) ? this.elem.data('rangemin') : 0;
	},

	oldBrowserInit: function() {
		this.axis = ( this.elem.data('axis') ) ? this.elem.data('axis') : 'y';
		this.posX = this.elem.css('backgroundPositionX');
		this.posY = this.elem.css('backgroundPositionY');
		this.offset = (this.axis == 'y') ? parseInt( this.posY.replace('px', '') ) : parseInt( this.posX.replace('px', '') );
		this.rangeMax = ( this.elem.data('rangemax') ) ? this.elem.data('rangemax') : 0;
		this.rangeMin = ( this.elem.data('rangemin') ) ? this.elem.data('rangemin') : 0;
	},

	inRange: function(val, max, min) {
		if ( val < min ) {
		  return false;
		} else if ( max == 0 ) { // if max is 0 then no limit set - short circuit true to ignore max
			return true;
		} else if ( val > max ) {
		  return false;
		}
		return true;
	}
	
  }

  Moosellax.defaults = Moosellax.prototype.defaults;

  $.fn.moosellax = function(options) {
	return this.each(function() {
	  new Moosellax(this, options);
	});
  };

})(jQuery, window);