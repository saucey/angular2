
### Understanding JavaScript behaviors in Drupal

[Drupal's official JavaScript](https://www.drupal.org/node/756722) documentation suggests that modules should implement JavaScript by attaching logic to **Drupal.behaviors**. Here is an example taken from that page:

```javascript
Drupal.behaviors.exampleModule = {
  attach: function (context, settings) {
    $('.example', context).click(function () {
      $(this).next('ul').toggle('show');
    });
  }
};
```

Drupal core will call attached behaviors when the DOM (the object representation of the HTML) is fully loaded, passing in two arguments:

- **context**: which contains the DOM.
- **settings**: which contains all the settings injected server side.

We can confirm this at the following snippet extracted from Drupal core’s misc/drupal.js:

```javascript
// Attach all behaviors.
$(function () { // shorthand for $(document).ready()
  Drupal.attachBehaviors(document, Drupal.settings);
});
```
**Drupal.attachBehaviors()** may be called more times under different circumstances after the DOM is loaded. For instance, Drupal core will also call **Drupal.attachBehaviors()** in these scenarios:

- After an administration overlay has been loaded into the page.
- After the AJAX Form API has submitted a form.
- When an AJAX request returns a command that modifies the HTML, such as *ajax_command_replace()*.

[More info](https://www.lullabot.com/articles/understanding-javascript-behaviors-in-drupal "Understanding JavaScript behaviors in Drupal")

