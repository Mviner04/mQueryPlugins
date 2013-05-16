/**
 * Styleable input field plugin
 *
 * @requires jquery, jquery.fieldselection
 * 
 * Adds <b> and <i> options to input fields.
 */

 ;(function($, window, undefined) {

  var $win = $(window);

	/* Utility helper */
	if(!String.prototype.trim) {
		String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
	}

	var StyleAble = function(elem, opts) {
		this.elem = $(elem);

		this.boldBtn = null;
		this.italBtn = null;

		this.defaults = {
			boldBtnClass: 'btn-bold',
			italBtnClass: 'btn-italic',
			buttonElement: 'a',
			btnBefore: false
		};

		this.opts = $.extend({}, this.defaults, opts);

		this.init();

		this.elem.data('styleable', true); // prevent multiple instantiations
	};

	StyleAble.prototype = {
		init: function() {
			this.createButtons();

			var that = this;

			this.boldBtn.on('click', function(e) {
				e.preventDefault();
				that.setBold(e);
			});

			this.italBtn.on('click', function(e) {
				e.preventDefault();
				that.setItalic(e);
			});
		},

		createButtons: function() {
			this.boldBtn = $('<'+this.opts.buttonElement+' href="#">B</'+this.opts.buttonElement+'>');
			this.boldBtn.addClass(this.opts.boldBtnClass);

			this.italBtn = $('<'+this.opts.buttonElement+' href="#">I</'+this.opts.buttonElement+'>');
			this.italBtn.addClass(this.opts.italBtnClass);

			if(this.opts.btnBefore) {
				this.elem.before(this.italBtn);
				this.elem.before(this.boldBtn);
			} else {
				this.elem.after(this.italBtn);
				this.elem.after(this.boldBtn);
			}

		},

		setBold: function() {
			var sel = this._getSelection();
			if(sel) {
				this._setSelection('<b>'+sel+'</b>');
			}
		},

		setItalic: function() {
			var sel = this._getSelection();
			if(sel) {
				this._setSelection('<i>'+sel+'</i>');
			}
		},

		_getSelection: function() {
			var sel = this.elem.getSelection();
			if(sel.length && sel.text.trim() !== '') {
				return sel.text;
			} else {
				return false;
			}
		},

		_setSelection: function(sel) {
			if(sel!=="") {
				this.elem.replaceSelection(sel);
			}
		}
	};

	$.fn.StyleAble = function(options) {
		return this.each(function() {
			if( $(this).is('input') && $(this).data('styleable') == undefined ) {
				new StyleAble(this, options);
			}
		});
	};

 })(jQuery, window);
