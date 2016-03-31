# Jasmine-virtualDom
A tool to create a virtual dom to use in your specs

##How to use it

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

####Examples
    
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

##Generate docs

    1. npm install
    2. grunt doc

##Support

Chrome, Safari, FF, IE > 8.





