# Aegon technical design library

The library will host the HTML CSS & JS resources required for cXstudio and 
third parties to implement in projects.


## Technical notes and considerations
***

As documented in Confluence wiki regarding themes and browsers supported, we are
going to support the follow list of browsers and devices:

* Internet Explorer (Desktop): 9.0, 10.0, 11.0
* TODO 


## Summary of set up development environment
***

### Prepare project environment

* [Install Node.js and npm (Node Package Manager)](http://nodejs.org/download/)
* [Install Sass](http://sass-lang.com/install)
* [Install Bower](http://bower.io/)
* [Install Grunt](http://gruntjs.com/getting-started)

### First step after git clone

* Install all requirements described at "Prepare project environment".
* Running **bower install & npm install** to install the required dependencies. 
  If this fails, try running the commands separately and check errors.
* Clone submodules in one shot: **git submodule init && git submodule update**.

*NOTES:  submodules are about dependencies with other repos. Remember to read
online how  GIT submodules work. Or just ask when at cXstudio's office*