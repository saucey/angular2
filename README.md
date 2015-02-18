# Aegon technical design library

The library will host the HTML CSS & JS resources required for cXstudio and third parties to implement in projects.


### Technical notes and considerations

As documented in Confluence wiki regarding themes and browsers supported, we are going to support the follow list of browsers and devices:

* Internet Explorer (Desktop): 9.0, 10.0, 11.0;
* TODO: add more browsers from Confluence;


### Guidelines and Coding standards

* Since our main platform is Drupal, we follow the code standards of community: [https://www.drupal.org/coding-standards](https://www.drupal.org/coding-standards).
  Main rules that we need to follow are described below:
	* Indentation with 2 spaces and no tab allowed.
    * With the project we have also an hidden file .editorconfig for editor standards.


### Architecture of the project

TODO...



## Summary of setup dev environment

Follow the steps below to setup your local stack environment.


### Step 1 - Prepare development environment

* [Install Git on your machine](https://confluence.atlassian.com/display/BITBUCKET/Set+up+Git)
* [Install Node.js and npm (Node Package Manager)](http://nodejs.org/download/) With this tool, we are going to install also the Node Package Manager (npm) that we use in the next step.
* [Install Bower](http://bower.io/) After install Node.js above, just type on command line: **npm install -g bower** (probably you have to use **sudo** command, for linux/machintosh machines)
* [Install Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) After install Node.js above, just type on command line: **npm install -g gulp**


### Step 2 (Optional) - Prepare your machine

Before the **Step 3** below, remember to setup your global user locally. Please follow [this tutorial to work with Bitbucket](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config) and also [set up SSH for Git](https://confluence.atlassian.com/display/BITBUCKET/Set+up+SSH+for+Git) for personal Bitbucket's area.


### Step 3 - Clone repository on your local machine

Clone the repository in your favorite projects folder:

```
git clone git@bitbucket.org:cxstudio/aegon-technical-design-library.git
```


### Step 4 - Commands after git clone

Run first setup script from command line as below:

```
npm run setup
```

*Below at **Other command line** there are explanation of single steps (in case some of them fails, try running the commands separately and check errors.).*


## Other command line


Start the application in development mode:

```
npm run serve
```

Or simply:
```
gulp --dev
```

To install the required project's dependencies:

```
npm run deps
```

Clone submodules in one shot:

```
npm run subs
```

*NOTE: submodules are about dependencies as extra repositories. Remember to read online how  GIT submodules work. Or just ask when at cXstudio's office*

Command below is to update the main Git repository and the submodules connected:

```
npm run update
```

Build the project making ready for deploy:

```
npm run build
```

TODO: Create the deploy's task in Gulpfile

```
npm run deploy
```