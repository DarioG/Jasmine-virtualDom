#Contributing for Jasmine virtual dom
Welcome to Jasmine virtual dom! Thanks for helping to make it better and make other developers life easier. :). This is a project which is in a very early stage and we are happy to receive suggestions and bug fixes, so if you find something just follow the common workflow

## Common workflow

First of all, fork the repo `git@github.com:DarioG/Jasmine-virtualDom.git` into your git account, then just follow the common flow

```
git clone git@github.com:YourName/Jasmine-virtualDom.git
git branch you-feature-branch
git commit -m "Add or fix something"
git push origin you-feature-branch
```
Once you've pushed a feature branch to your forked repo, you're ready to open a pull request. We favor pull requests with very small, single commits with a single purpose.

## Guidelines

### Directory structure

* `/src` contains all the src files
 * `/src/boot.js` initialization of virtual dom
 *  `/src/virtualDom` base of virtual dom
* `/specs` contains all the specs. The structure inside must be exactly as the structure below `/src`
* `/output` file generated after compiling all the src files. This is actually the whole library
* `/doc` folder generated by jsDoc where you will find the code documentation

You can add/modify this structure as you want, as long as that it makes sense

### Testing
Jasmine virtual dom is a testing tool, so every line of code should be tested. This is not optional.

To run the test locally you have to options:

Be sure that you have node and npm installed and it your project folder

* Open the specs runner in your favourite browser `pathToYourLocalProject\specs\specsRunner.html`
or
* Run it with grunt `grunt test`

Be sure that the test are always green before pushing

### Code Style Standars

We are using jscs and jshint like linters for this project. The rules are defined in `.jshintrc` and `jscsRules.json` in the root of the project. You can check your code with `grunt qa`. Both should be always green.

### Before pushing

Before pushing to the repo or creating the pull request the code should be:

* Properly formated. We want to keep the harmony of the code in the whole project
* `jshint` and `jscs` are green
* `jasmine` test green
* all src files are compile into `/output/virtualDom.js`

To do this you can just run `grunt push`, and if everything is green you are ready to push

### After creating the pull request

We have 2 CI systems: 

* [travis](https://travis-ci.org/). This will run grunt qa
* [scrutinizer](https://scrutinizer-ci.com/). This will check code complexity, potential bugs, code style, etc. This is a really usefull tool which, even when it is green, offers usefull tips. Please take a look at it after creating the PR, because maybe it has some good advises.

If you want us to review and, potentially, merge your PR both should be green

### Some tips when write code for Jasmine virtual dom

* Do not change the public interface. You can add new methods to it, but changing the existing ones could break the projects that are already using it.
* Be browser agnostic down to IE9.
* Write specs - Jasmine virtual dom is a testing framework; don't add functionality without test-driving it
* Write code in the defined style.
* Ensure the entire test suite is green in all the big browsers, PhantomJs, JSHint and Jscs - your contribution shouldn't break Jasmine for other users
