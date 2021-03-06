# Jasmine-virtualDom
A tool to create a virtual dom to use in your specs

[![Travis Build Status](https://travis-ci.org/DarioG/Jasmine-virtualDom.svg?branch=master)](https://travis-ci.org/DarioG/Jasmine-virtualDom)
[![Scrutinizer Build Status](https://scrutinizer-ci.com/g/DarioG/Jasmine-virtualDom/badges/build.png?b=master)](https://scrutinizer-ci.com/g/DarioG/Jasmine-virtualDom/build-status/master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/DarioG/Jasmine-virtualDom/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/DarioG/Jasmine-virtualDom/?branch=master)

## How to use it

1. Add the file after boot.js of jasmine

```html
    <script src="../libraries/jasmine-2.3.4/jasmine.js"></script>
    <script src="../libraries/jasmine-2.3.4/jasmine-html.js"></script>
    <script src="../libraries/jasmine-2.3.4/boot.js"></script>
    <script src="../libraries/jasmineVD-1.0.1/virtualDom.js"></script>
```
2. install the virtual dom inside of beforeEach or it ( dont forget to uninstall it in the afterEach)

```javascript
    beforeEach(function () {
        jasmine.virtualDom.install(body);
    });

    afterEach(function () {
        jasmine.virtualDom.uninstall();
    });
```
3. use the dom API as usual

#### Examples
    
Here you have a summary, if you want more details, generate the docs.

##### Installing

The install method has an optional parameter, called body, which is expected to be the initial html state.

```javascript
    beforeEach(function () {
        jasmine.virtualDom.install('<head></head><body>' +
            '<div id="myContainer" class="container">Hi!</div>' +
            '<div class="container">Hi2!</div>' +
            '<div id="selector">' +
                '<div class="child">Yeeeeepa</div>' +
                '<div class="child">Yeeeeepa2</div>' +
            '</div>' +
        '</body>');
    });

    afterEach(function () {
        jasmine.virtualDom.uninstall();
    });


    it('Adding a new element into the html', function () {
        /// production code
        var newEl = document.createElement('div');
        newEl.innerText = 'This is a new element';
        newEl.id = 'newEl';

        document.getElementById('selector').appendChild(newEl);
        ///

        expect(document.getElementById('newEl')).toBeDefined();
    });
```  
##### Triggering events

You can trigger native or custom events of any element in the dom

```javascript
    it('triggering events', function () {
        var callback = jasmine.createSpy();

        /// production code
        var el = document.getElementById('selector');

        el.addEventListener('click', callback);
        ///

        jasmine.virtualDom.trigger(el, 'click', {
            property: 'this property will be added to the event object'
        });
        expect(callback).toHaveBeenCalled();
    });
```  

##### Reseting the virtual dom

Sometimes you need to reset the dom with a new template. You can do this, uninstalling and installing again, but there is a method which does that

```javascript
    jasmine.virtualDom.resetDom(newHTMLTemplateHere);
```  

#### Special cases

Sometimes you have a event listener whose default behaviour needs to be prevented ( preventing redirections or submits for instance). You, obviously, need to test this. 

For this when calling 

```javascript
jasmine.virtualDom.trigger(el, event);
```
this will return a boolean, so when it is false means that the default behaviour was stopped, true otherwise

##### Examples

```javascript
element.addEventListener('click', function (e) {
    e.preventDefault();
});

var result = jasmine.virtualDom.trigger(element, 'click');

result === false // This assertion is true
```

```javascript
element.addEventListener('click', function (e) {
    // do something else
});

var result = jasmine.virtualDom.trigger(element, 'click');

result === true // This assertion is true
```

## Generate docs

    1. npm install
    2. grunt doc

## Support

Chrome, Safari, FF, IE > 8.





