/*
 * Mitchousel the Infinite Carousel - put a collection of LI's, all assumed to be same width into an infinite scrolling 
 * carousel. Great for a product slider.
 *
 * @depends jQuery 1.7+
 *
 * @Usage:
 *	$('ul').mitchousel({
 *		numToShow: int (default 4) - how many to show per group
 *		prev: string (default 'previousButton') - class name to bind the previous button to (or will create)
 *		next: string (default 'nextButton') - class to bind next button (or will create)
 *		addControls: boolean (default true) - add controls to DOM or look for existing
 *		speed: milliseconds (default 500) - how fast should we go? how fast should we go?
 *	});
 *
 *	
 */
;(function($, window, undefined) {
	
	var $win = $(window);

	var Mitchousel = function(elem, opts) {
		this.elem = $(elem);
		
		this.defaults = { // options settable via opts obj
			numToShow: 4,
			prev: 'previousButton',
			next: 'nextButton',
			addControls: true,
			speed: 500
		};
		this.opts = $.extend({}, this.defaults, opts);

		this.slides = this.elem.children('li');
		this.slideCount = this.slides.length;

		//Some reference vars for later
		this.prevBtn = null;
		this.nextBtn = null;
		this.animating = false;
		this.leftPos = 0;
		this.slideWidth = 0;
		this.activeIdx = 0;

		if(this.slideCount) {
			this.elem.wrap('<div class="bacardi-slider-wrapper carousel" />');
			this.wrapper = $('.bacardi-slider-wrapper');
			var x = 0;
			// @Todo this is just so I can say where these little shits are moving to.
			this.slides.each(function() {
				$(this).addClass('num'+x);
				x++;
			});
			this.init();
		} else {
			throw 'Unable to find any slides.';
		}
	};

	Mitchousel.prototype = {

		init: function() {
			this.slideWidth = this.slides.first().outerWidth(true); // for now, assume all same width
			this.wrapper.css({
				'width': (this.slideWidth * this.opts.numToShow)+'px',
				'position': 'relative',
				'overflow': 'hidden'
			});
			this.elem.css({
				'width': (this.slideWidth * (this.slideCount * 3)),
				'position' : 'relative'
			}); // set to twice as wide since we'll be doing some cloning to make this continuous
			
			this.activeIdx = this.slideCount; // start on second duplicate

			// Set the "slide" to start one frame to the right, so we have room to 
			// put the last "set" at the beginning to handle the left click
			this._setElemPos('-'+(this.slideWidth*this.slideCount)+'px');

			//Put some slides to show before
			var idxs = this._getSlideIndexes(this.slideCount, this.slideCount, '-');
			this._copySlides(idxs, 'prepend');

			// make sure we have enough to cover a next click in our "show"
			idxs = this._getSlideIndexes(0, this.opts.numToShow);
			this._copySlides(idxs);

			this.setupControls();
			
		},

		setupControls: function() {
			if(this.opts.addControls) {
				this.prevBtn = $('<a href="#" class="'+this.opts.prev+'"><span>Prev</span></a>');
				this.wrapper.before(this.prevBtn);
				this.nextBtn = $('<a href="#" class="'+this.opts.next+'"><span>Next</span></a>');
				this.wrapper.after(this.nextBtn);
			} else {
				if(typeof this.opts.prev == 'object') {
					this.prevBtn = this.opts.prev;
				} else if (typeof this.opts.prev == 'string') {
					this.prevBtn = $('.'+this.opts.prev);
				} else {
					throw 'Unable to find a previous button, set useControls to false if not using.';
				}
				if(typeof this.opts.next == 'object') {
					this.nextBtn = this.opts.next;
				} else if (typeof this.opts.next == 'string') {
					this.nextBtn = $('.'+this.opts.next);	
				} else {
					throw 'Unable to find a next button, set useControls to false if not using.';
				}
			}
			var that = this;
			this.nextBtn.on('click', function(e) {
				e.preventDefault();
				that.moveNext();
			});
			this.prevBtn.on('click', function(e) {
				e.preventDefault();
				that.movePrev();
			});
			
		},

		moveNext: function() {
			this.activeIdx = this.activeIdx + this.opts.numToShow;
			this.animateSlide((this.slideWidth*this.opts.numToShow)+'px', '-');
		},

		movePrev: function() {
			this.activeIdx = this.activeIdx - this.opts.numToShow;
			this.animateSlide((this.slideWidth*this.opts.numToShow)+'px', '+');				
		},

		animateSlide: function(x, incre) {
			var that = this;
			this.animating = true;
			this.elem.animate({
				left: incre+'='+x
			}, that.opts.speed, function() {
				that.animating = false;
				if(that.activeIdx < that.opts.numToShow) {
					that.activeIdx = that.activeIdx + that.slideCount;
				}
				// ((Total Slides - 2 Groups from the end))
				if(that.activeIdx > (((that.slideCount * 2) + that.opts.numToShow) - (that.opts.numToShow * 2)) ) {
					that.activeIdx = that.activeIdx - that.slideCount;
				}
				that.jumpToActive();
			});
		},

		jumpToActive: function() {
			this._setElemPos('-'+(this.activeIdx * this.slideWidth)+'px');
		},

		/* Grab some slide, clone them, put them either at beginning or end
		 *	@param idxs - array of slide indexes to clone
		 *  @param pos - 'prepend' or 'append' to put at beginning or end // assumes 'append'
		 */
		_copySlides: function(idxs, pos) {
			var that = this;
			var cl = null;
			$.each(idxs, function(idx, i) {
				cl = that.elem.find('li.num'+i).first().clone(); // always clone the original collection so indexes aren't whack
				if(pos == 'prepend') {
					that.elem.prepend(cl);
				} else {
					that.elem.append(cl);
				}
			});
			that.slides = that.elem.children('li');
		},

		_getSlideIndexes: function(start, count, dir) {
			var that = this;
			var idxs = [];
			var slidesLeft = 0;
			if(dir == '-') {
				start = start-1; // 0 based
				for(var i = start;i>=((start+1) - count);i--) {
					if(i >= 0 ) {
						idxs.push(i);
					}
				}
				
				if(idxs.length !== count) {
					slidesLeft = count - idxs.length;
					for(var i = (that.slideCount-1); i >= (that.slideCount-slidesLeft); i--) {
						idxs.push(i);
					}
				} 
				return idxs;
			} else {
				for(var i = start; i<=(start+count)-1;i++) {
					if(i >= 0 && i < that.slideCount ) { idxs.push(i); }
				}
				
				if(idxs.length !== count) {
					slidesLeft = count - idxs.length;
					for(var i = 0; i < slidesLeft; i++) {
						idxs.push(i);
					}
				}
				return idxs;
			}

		},

		_removeSlides: function(idxs) {
			var that = this;
			$.each(idxs, function(idx, i) {
				that.slides.eq(i).remove();
			});
		},

		_setElemPos: function(x) {
			this.elem.css('left', x);
		}

	};

	$.fn.mitchousel = function(options) {
		return this.each(function() {
			new Mitchousel(this, options);
		});
	};

	$(function() {
		$('.productList').mitchousel();
	});

})(jQuery, window);