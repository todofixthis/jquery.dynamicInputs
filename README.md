# dynamicInputs Plugin

This plugin allows you to create forms that allow the user to dynamically
  create/remove inputs, using a template.

# Dependencies

This plugin requires [jQuery Core](https://jquery.com/) and
  [jQuery UI](https://jqueryui.com/).
  
# Usage

1. Create a template (will be cloned to create new elements).
  - Annotate controls to insert a new element with `data-di-fn="add"`.
  - Annotate controls to remove the element with `data-di-fn="remove"`. 
2. Invoke the plugin on the container (where new elements will be added).
3. Implement event handlers if desired.

# Example

For a demo of this plugin in action, see `demo.html`.

# Event Handlers

Use event handlers to perform additional functions when an element is
  added or removed:

- `todofixthis.di.adding: function(event, position, element)` - right
  before a new input is added to the container.
- `todofixthis.di.added: function(event, position, element)` - after a
  new input has been added to the container.
- `todofixthis.di.removing: function(event, position, element)` - right
  before an input is removed from the container.
- `todofixthis.di.removed: function(event, position, element)` - after
  an input has been removed from the container.
