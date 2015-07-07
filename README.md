# Aegon technical design library

The library will host the HTML, CSS and JavaScript resources required for cXstudio and third parties to implement in projects.
The library tool is composed of advanced components that permit to have a complete front-end development stack.


### Architecture of the project

We are using Gulp that is an utility wrote in Node.js. Gulp is a build system automating tasks: minification and copying of all JavaScript files, static images, capable of watching files to automatically rerun the task when a file is changed and much more.
Beside Gulp we are customising a new utility called Fabricator, that permit to keep track and develop new elements inside our UI libraries repository adding on each elements the technical notes, HTML, CSS and JavaScript code.

This **Aegon technical design library** repository contains configuration files to build the development environment and static version of this website tool ready to be deployed in only one shot from command line.
It has additionals GIT submodules that will be setup extra libraries under ./lib folders, to mantain an assets, scripts and SASS extra projects shared with other main Drupal projects and third party tools/websites.

Extra components repository are listed below:

* Assets repo: [https://bitbucket.org/cxstudio/aegon-assets-library](https://bitbucket.org/cxstudio/aegon-assets-library)
* Styles repo: [https://bitbucket.org/cxstudio/aegon-sass-library](https://bitbucket.org/cxstudio/aegon-sass-library)
* Scripts repo: [https://bitbucket.org/cxstudio/aegon-scripts-library](https://bitbucket.org/cxstudio/aegon-scripts-library)


### Guidelines, Coding standards and Technical notes

* Since our main platform is Drupal, we follow the code standards of community: [https://www.drupal.org/coding-standards](https://www.drupal.org/coding-standards);
  Main rules that we need to follow are described below:
	* Indentation with 2 spaces and no tab allowed;
    * With the project we have also an hidden file .editorconfig for editor standards;
* As documented in Confluence wiki regarding themes and browsers supported, we are going to support the list of browsers and devices mentioned in [Browser and devices policy for Aegon websites](http://swfactory.intra.aegon.nl:8090/display/WebDevelopment/Browser+and+devices+policy+for+Aegon+websites) of Confluence.
* This README file is wrote with Markdown syntax. If you are not familiar, please [visit the tutorial page of Atlassian](https://bitbucket.org/tutorials/markdowndemo);
* Code into JavaScript files need to be encapsulated. Best way is showed in **src/assets/scripts/toolkit.js**;
* For folders **src/components** and **src/widgets** there is the markdown support for documentation of single html document. Is enough create an .md extra files with the same name of the html file to have the documentation/comments support inside the out tool.


## Summary of setup dev environment

Follow the steps below to setup your local stack environment.


### Step 1 - Prepare development environment

* [Install Git on your machine](https://confluence.atlassian.com/display/BITBUCKET/Set+up+Git)
* [Install Node.js and npm (Node Package Manager)](http://nodejs.org/download/) With this tool, we are going to install also the Node Package Manager (npm) that we use in the next step.
* [Install Bower](http://bower.io/) After install Node.js above, just type on command line: **npm install -g bower** (probably you have to use **sudo** command, for linux/machintosh machines)
* [Install Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) After install Node.js above, just type on command line: **npm install -g gulp**


### Step 2 (Optional) - Prepare your machine

Before the **Step 3** below, remember to setup your global Git user locally. Please follow [this tutorial to work with Bitbucket](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config) and also [set up SSH for Git](https://confluence.atlassian.com/display/BITBUCKET/Set+up+SSH+for+Git) for personal Bitbucket's area.


### Step 3 - Clone repository on your local machine

Clone the repository in your favorite projects folder:

```
git clone git@bitbucket.org:cxstudio/aegon-technical-design-library.git
```


### Step 4 - Commands after git clone

Run first setup script from command line as below:

```
$ cd aegon-technical-design-library
$ npm run setup
```

*Below at **Other command line** there are explanation of single steps (in case some of them fails, try running the commands separately and check errors.).*


## Other command line


Start the application in development mode (e.g. compile scss, js code check):

```
$ npm run serve
```

Or simply:
```
$ gulp --dev
```

To install the required project's dependencies:

```
$ npm run deps
```

Clone submodules in one shot:

```
$ npm run subs
```

*NOTE: submodules are about dependencies as extra repositories. Remember to read online how  GIT submodules work. Or just ask when at cXstudio's office*

Command below is to update the main Git repository and the submodules connected at latest HEAD revision of main repo:

```
$ npm run update
```

Command below is similar to **npm run update**, but forcing to pull latest file from submobules repository detaching from HEAD revision of this main repository:

```
$ npm run pull
```

**IMPORTANT:** After this command, optionally, you need to update the HEAD revision of current repository.

Build the project making it ready for deploy:

```
$ npm run build
```

Optional: is also possible to deploy the entire ./dist folder with builded files and .inc/.php files of Drupal theme:

```
$ npm run deploy
or
$ gulp deploy
```

**IMPORTANT NOTE:** before use deploy command, you need to create a **./private.json** in your root project folder with the content below:

```
{
  "deploy": {
    "host": "10.120.32.22",
    "port": "22",
    "path": "/var/www/aegon-technical-design-library",
    "user": "linux user for SSH",
    "pass": "*****"
  } 
}
```


### Additional Widgets information

When the userDetail widget run and user is logged in, automatically a class .shw-widgets-logged-in will be assigned to the body tag.
In this way will be easy to hide/show certains elements on our page via simple CSS.
Example is present in **./lib/aegon-sass-library/widgets/_extra_features.scss**.

**JavaScript way**: additionally, we have also public functions loaded by userDetails widgets that permit to control if an user is logged in.
Example: the code below return true/false for current user logged status.
```
window.shwGlobal.userLoggedin()
```

With this userLoggedin(), it's easy to create additional scripts that check the widgets session if logged or not. Just remember to call those methods below after DOMready.
Example:

```
if (window.shwGlobal.userLoggedin()) {
  // Do whatever you want if user logged in
}

// Or:
if (!window.shwGlobal.userLoggedin()) {
  // Do whatever you want if user logged out
}
```

Assitionally: each time the page is loaded and user is logged in or logged out, we can bind those events.
Example below:

```
$(window).on('shwUserLoggedIn', function() {
  // Do whatever you want here
});

$(window).on('shwUserLogout', function() {
  // Do whatever you want here
});
```

For other functionality, like **window.shwGlobal.getRelNumByType()**, check the JS file **./lib/aegon-scripts-library/widgets/userDetail.js** and look at methods in the bottom.

## Common problems

* In case of network issues with git:// protocol, please try to enable the https:// protocol using the command below:

```
git config --global url."https://".insteadOf git://
```
