/* **
	Custom checkboxes:
		Replace standard checkbox element with a div that will act as a proxy to the checkbox.

	Usage:
		$('input[type=checkbox]').customCbx();
	Or:
		$('input.customCheckbox').customCbx({ element: 'span', className: 'differentCustomCheckboxClass' });


	Options:
		element - default 'div'
		className - default 'custom-checkbox'

	Styling:
		Use whatever class name you want, default or a custom one passed, when checked, the element gets a class of 'checked' added to it.

*/

$.fn.customCbx = function(options) {

	var settings = $.extend( {
		className : 'custom-checkbox',
		element : 'div'
	}, options);

	return this.each(function() {
		var $this = $(this);
		$this.css({position: 'absolute', left: '-999px'});
		var cCbx = $('<'+settings.element+' class="'+settings.className+'"></'+settings.element+'>');
		cCbx.data('checkboxName', $this.attr('name'));
		cCbx.prop('id', cCbx.data('checkboxName'));
		if($this.is(':checked')) {
			cCbx.addClass('checked');
		}
		$this.after(cCbx);
		cCbx.on('click', function(e) {
			var bx = $('input[name='+$(this).data('checkboxName')+']');
			if(bx.is(':checked')) {
				$(this).removeClass('checked');
			} else {
				$(this).addClass('checked');
			}
			bx.trigger('click');

		});
	});
};