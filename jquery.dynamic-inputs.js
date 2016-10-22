(function($) {
  'use strict';

  $.widget('todofixthis.dynamicInputs', {
    options: {
      // Whether to add an input after initializing.
      add:      true,

      // The DOM element that contains the template that will be cloned
      //  to add new inputs to the container.
      template: null
    },

    _create: function() {
      if(! this.options.template) {
        throw new Error('`template` is required.');
      }
      else if(! (this.options.template instanceof $)) {
        throw new Error('`template` must be a jQuery object.');
      }

      this._inputs = [];

      if(this.options.add) {
        this.add();
      }
    },

    add: function(position) {
      // Call `add` without arguments to add to the end.
      if(typeof position == 'undefined') {
        position = this._inputs.length;
      } else {
        position = this._normalizePosition(position, true);
      }

      var newInput  = this.options.template.clone(),
          widget    = this;

      // Wire up inserters.
      newInput.find('[data-di-fn="add"]').on('click', function(event) {
        event.preventDefault();
        // Insert the next input after this one.
        widget.add(widget._inputs.indexOf(newInput) + 1);
      });

      // Wire up removers.
      var removers =  newInput.find('[data-di-fn="remove"]');
      removers.on('click', function(event) {
        event.preventDefault();
        widget.remove(widget._inputs.indexOf(newInput));
      });

      // If we are adding the very first row, removal controls should
      //  start out hidden.
      if(this._inputs.length < 2) {
        removers.prop('disabled', true).css('visibility', 'hidden');
      }

      this.element.trigger('todofixthis.di.adding', [position, newInput]);

      // Have the input start out hidden so that we can fade it in.
      newInput.hide();

      // Insert the input in the correct position so that we can keep
      //  track of its position relative to other inputs.
      this._inputs.splice(position, 0, newInput);

      // Figure out where to insert the DOM element.
      if(this.element.children().length <= position) {
        this.element.append(newInput);
      } else {
        this.element.children(':nth-child(' + position + ')').after(newInput);
      }

      newInput.fadeIn();
      this.resetControlVisibility();

      this.element.trigger('todofixthis.di.added', [position, newInput]);
    },

    remove: function(position) {
      position = this._normalizePosition(position, false);
      var target = this._inputs[position];

      this.element.trigger('todofixthis.di.removing', [position, target]);

      this._inputs.splice(position, 1);
      this.resetControlVisibility();

      var widget = this;
      target.fadeOut({
        done: function() {
          target.remove();
          widget.element.trigger('todofixthis.di.removed', [position, target]);
        }
      });
    },

    resetControlVisibility: function() {
      var makeVisible = (this._inputs.length > 1);

      $.each(this._inputs, function(i, input) {
        if(makeVisible) {
          input.find('[data-di-fn="remove"]')
            .prop('disabled', false)
            .css('visibility', 'visible')
            .animate({'opacity': 1.0});
        } else {
          input.find('[data-di-fn="remove"]')
            .prop('disabled', true)
            .animate({'opacity': 0.0}, {
              'done': function() {
                $(this).css('visibility', 'hidden');
              }
            });
        }
      });
    },

    _normalizePosition: function(position, forAdd) {
      // Allow selecting just past the end if we are adding a new
      //  element.
      if((! forAdd) && (position == this._inputs.length)) {
        throw new Error('Index out of bounds: ' + position);
      }

      if(position > this._inputs.length) {
        throw new Error('Index out of bounds: ' + position);
      }

      // Negative index counts from the end of the array, as long
      //  as it doesn't go past the start.
      if(position < 0) {
        if((-position) >= this._inputs.length) {
          throw new Error('Index out of bounds: ' + position);
        }

        position += this._inputs.length;
      }

      return position;
    }
  })
})(jQuery);
