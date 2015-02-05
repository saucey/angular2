# Aegon SASS library

The library will host the SASS library required for cXstudio Drupal projects and Design Technical Library.


## Technical notes & guidelines

* TEMPORARY REMOVED [Susy: YOUR MARKUP, YOUR DESIGN, YOUR OPINIONS | OUR MATH.](http://susydocs.oddbird.net/) 
	Susy it is the SASS library we are going to use. Since we have a custom framework started on Drupal side, we are not going to implement new CSS library. But importing only a library with mixins, layouts and helpers served by Susy: your layout | our math.
* Instead included **compass-mixins** as bower project. In main.scss we are importing only the mixins that we need at moment, for example: sprites.
* Library doesn't require any file help or development project environment. It will be shared with repos listed below:
	* aegon-technical-design-library
	* aegon-drupal-base-theme
	* any other projects
* Don't use anymore vendor prefixes. They will be added by Autoprefixer as Grunt task inside father projects.


## Usage

* This library will be used as submodule ot other projects. Where added, please run also **bower install** in relative subfolder to create Bower dependencies as vendors/ folder.
* Sometime could happen that the dependecies in assets/aegon-sass-library change, please re-run **bower install** (in case of weird errors, just remove the vendor folders from SASS library and run again **bower install**)

## Notes

* We are going to import the compiled CSS version of SASS file: aegon-library.scss in other projects as extra file.
  That's mean we dopn't have to implement really everything taken from other projects, if the styles are not really useful first of all in Drupal websites environments.