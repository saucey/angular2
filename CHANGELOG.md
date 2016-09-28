## 2016-09-27
Upgrade of Angular2 to release version number 2.0.0
# Added node modules webpack and through2
# Removed gulp tasks `scripts:angular2components` and `scripts:angular2core`
# Created gulp task `webpack` to compile all Angular2 dependencies into one file *aegon-angular2.js* so now angular2core.js is not used anymore.

### Actions
# Pull from master the latest content
# Remove the node_modules folder
# Run in terminal `npm install`
# Change directory to lib/aegon-frontend-library and pull from master
# Change directory to aegon-scripts-library and remove the node_modules folder
# Run in terminal `npm install`
