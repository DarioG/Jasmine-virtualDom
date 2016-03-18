# Jasmine-virtualDom
A tool to create a virtual dom to use in your specs

##How to use it

1. Add the file after boot.js of jasmine

```html
    <script src="../libraries/jasmine-2.3.4/jasmine.js"></script>
    <script src="../libraries/jasmine-2.3.4/jasmine-html.js"></script>
    <script src="../libraries/jasmine-2.3.4/boot.js"></script>
    <script src="../src/virtualDom.js"></script>
```
2. install the virtual dom inside of beforeEach or it ( dont forget to uninstall it in the afterEach)

```javascript
    beforeEach(function () {
        jasmine.virtualDom.install(body);
    });

    afterEach(function () {
        jasmine.virtualDom.uninstall(body);
    });
```

3. use the dom API as usual
