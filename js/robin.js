(function () {
	"use strict";

	var selects = document.querySelectorAll('select');

	if (selects.length > 0) {
		document.addEventListener('click', function() {
			Array.prototype.forEach.call(document.querySelectorAll('.select .options'), function(element) {
				element.style.display = 'none';
			});
		});
	}

	Array.prototype.forEach.call(selects, function(element) {
		var dummy = document.createElement('div');
		dummy.className = 'select';
		dummy.tabIndex = 0;

		var value = document.createElement('div');
		value.className = 'value';
		value.innerHTML = '-';
		dummy.appendChild(value);

		var dropper = document.createElement('div');
		dropper.className = 'dropper';
		dropper.innerHTML = '<span>&#x25be;</span>';
		dummy.appendChild(dropper);

		var options = document.createElement('div');
		options.className = 'options';
		dummy.appendChild(options);
		
		dummy.addEventListener('keyup', function(evt) {			
			var style = window.getComputedStyle(evt.currentTarget.querySelector('.options'));
			var selection = evt.currentTarget.querySelector('.kbd-selection');
			
			if (style.display === 'none') {
				switch (evt.which) {
					case 32: // spacebar
					case 38: // up arrow
					case 40: // down arrow
						evt.currentTarget.click();
						
						if (evt.which === 38) {
							// up arrow => move up
							if (selection && selection.prevElementSibling) {
								selection.prevElementSibling.classList.add('kbd-selection');
								selection.classList.remove('kbd-selection');
							}
							else if (!selection) {
								evt.currentTarget.querySelector('.option:first-child').classList.add('kbd-selection');
							}
						}
						else if (evt.which === 40) {
							// down arrow => move down
							if (selection && selection.nextElementSibling) {
								selection.nextElementSibling.classList.add('kbd-selection');
								selection.classList.remove('kbd-selection');
							}
							else if (!selection) {
								evt.currentTarget.querySelector('.option:last-child').classList.add('kbd-selection');
							}
						}
										
						break;
				}
				
			}
			else {				
				if (evt.which === 38) {
					// up arrow => move up
					if (selection && selection.previousElementSibling) {
						selection.classList.remove('kbd-selection');
						selection.previousElementSibling.classList.add('kbd-selection');
					}
					else if (!selection) {
						evt.currentTarget.querySelector('.option:first-child').classList.add('kbd-selection');
					}
				}
				else if (evt.which === 40) {
					// down arrow => move down
					if (selection && selection.nextElementSibling) {
						selection.classList.remove('kbd-selection');
						selection.nextElementSibling.classList.add('kbd-selection');
					}
					else if (!selection) {
						evt.currentTarget.querySelector('.option:last-child').classList.add('kbd-selection');
					}
				}
				else if (evt.which === 13 || evt.which === 32) {
					// return/spacebar => select current
					if (selection) {
						selection.click();
					}
				}
				else if (evt.which === 27) {
					// escape => close options
					evt.currentTarget.querySelector('.options').style.display = 'none';
				}
			}
		});

		Array.prototype.forEach.call(element.querySelectorAll('option'), function(option) {
			var optel = document.createElement('div');
			optel.innerHTML = option.innerHTML;
			optel.dataset.value = option.value;
			optel.className = 'option';
			options.appendChild(optel);
			optel.addEventListener('click', function(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				
				Array.prototype.forEach.call(options.querySelectorAll('.option'), function(el) {
					el.classList.remove('selected');
				});
				evt.currentTarget.classList.add('selected');

				value.innerHTML = evt.currentTarget.innerHTML;
				value.dataset.value = evt.currentTarget.dataset.value;
				
				options.style.display = 'none';
			});

			if (option.hasAttribute('selected')) {
				optel.click();
			}
		});

		dummy.selectElement = element;
		element.parentNode.insertBefore(dummy, element);
		element.style.display = 'none';

		dummy.addEventListener('click', function(evt) {
			evt.stopPropagation();
			evt.currentTarget.querySelector('.options').style.display = 'block';
	
			var selection = evt.currentTarget.querySelector('.kbd-selection');
			
			if (selection) {
				selection.classList.remove('kbd-selection');
			}
		});
	});

	var checkboxes = document.querySelectorAll('input[type="checkbox"]');

	Array.prototype.forEach.call(checkboxes, function(element) {
		element.style.display = 'none';

		var dummy = document.createElement('div');
		dummy.className = 'checkbox';
		dummy.dataset.value = element.value;
		dummy.dataset.checked = element.checked;
		dummy.checkboxElement = element;
		element.dummyElement = dummy;

		element.addEventListener('change', function(evt) {
			change_checkbox(dummy);
		});

		dummy.addEventListener('click', function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			element.checked = !element.checked;
			change_checkbox(dummy);
		});

		element.parentNode.insertBefore(dummy, element);
	});
	
	function change_checkbox(checkbox) {
		checkbox.dataset.checked = checkbox.checkboxElement.checked;

		if (checkbox.checkboxElement.dataset.group) {
			var status = checkbox.checkboxElement.checked;
			Array.prototype.forEach.call(document.querySelectorAll('[data-group="' + checkbox.checkboxElement.dataset.group + '"]'), function(element) {
				element.checked = false;
				element.dummyElement.dataset.checked = false;
			});
			checkbox.checkboxElement.checked = status;
			checkbox.dataset.checked = status;
		}
	}
})();
