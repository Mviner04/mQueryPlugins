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

$.fn.customCbx = function (options) {

    var settings = $.extend({
        className: 'custom-checkbox',
        element: 'a'
    }, options);

    return this.each(function () {
        var $this = $(this);
        $this.css({ position: 'absolute', left: '-9999em' });
        var cCbx = $('<' + settings.element + ' class="' + settings.className + '"></' + settings.element + '>');
        cCbx.data('checkboxName', $this.attr('name'));
        cCbx.data('ele', $this);
        cCbx.prop('id', cCbx.data('checkboxName'));
        if ($this.is(':checked')) {
            cCbx.addClass('checked');
        }
        $this.after(cCbx);
        cCbx.on("touchend click", function (e) {
            if ($(this).data("moved")) {
                $(this).removeData("moved")
            } else {
                e.preventDefault();
                e.stopPropagation();
                var bx = $(this).data('ele');
                if (bx.is(':checked')) {
                    $(this).removeClass('checked');
                } else {
                    $(this).addClass('checked');
                }
                bx.trigger('click');
            }
        })
        .on("touchmove", function(e) {
            $(this).data("moved", true);
        });
        cCbx.siblings('label').eq(0).on("touchstart click", function (e) {
            if ($(this).data("moved")) {
                $(this).removeData("moved");
            } else {
                e.preventDefault();
                e.stopPropagation();
                cCbx.trigger('click');
            }
        })
        .on("touchmove", function (e) {
            $(this).data("moved", true);
        });;
    });
};
