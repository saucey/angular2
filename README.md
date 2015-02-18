# Aegon technical design library

The library will host the HTML CSS & JS resources required for cXstudio and 
third parties to implement in projects.


## Technical notes and considerations

As documented in Confluence wiki regarding themes and browsers supported, we are
going to support the follow list of browsers and devices:

* Internet Explorer (Desktop): 9.0, 10.0, 11.0;
* TODO: add more browsers from Confluence;


## Guidelines and Coding standards

* Since our main platform is Drupal, we follow the code standards of community: [https://www.drupal.org/coding-standards](https://www.drupal.org/coding-standards).
  Main rules that we need to follow are described below:
	* Indentation with 2 spaces and no tab allowed.
    * With the project we have also an hidden file .editorconfig for editor standards.


## Summary of set up dev environment

### Prepare project environment

* [Install Node.js and npm (Node Package Manager)](http://nodejs.org/download/) With this tool, we are going to install also the Node Package Manager (npm) that we use in the next step.
* [Install Bower](http://bower.io/) After install Node.js above, just type on command line: **npm install -g bower** (probably you have to use **sudo** command, for linux/machintosh machines)
* [Install Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) After install Node.js above, just type on command line: **npm install -g gulp**


### First step after git clone

* Install all requirements described at "Prepare project environment".
* Running **bower install & npm install** to install the required dependencies. 
  If this fails, try running the commands separately and check errors.
* Clone submodules in one shot: **git submodule init && git submodule update**.

*NOTES:  submodules are about dependencies with other repos. Remember to read
online how  GIT submodules work. Or just ask when at cXstudio's office*
