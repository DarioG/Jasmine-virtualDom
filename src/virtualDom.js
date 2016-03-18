window.getJasmineRequireObj().VirtualDom = function () {
    var oldDocument,

    getElementById = function (parent, id) {
        var children = parent.childNodes,
            child,
            result,
            i;

        for (i = 0; i < children.length; i++) {
            child = children[i];

            if (child.id === id) {
                return child;
            }

            result = getElementById.call(this, child, id);

            if (result) {
                return result;
            }
        }
    },

    isAlreadyInstalled = function () {
        return !!oldDocument;
    };

    this.install = function (body) {
        var dom ;

        if (isAlreadyInstalled.call(this)) {
            throw 'Virtual dom already installed';
        }

        dom = document.createElement('html');
        dom.innerHTML = body;

        oldDocument = {
            getElementsByTagName: document.getElementsByTagName,
            getElementById: document.getElementById,
            getElementsByClassName: document.getElementsByClassName
        };

        document.getElementsByTagName = function (tagName) {
            if (tagName.toLowerCase() === 'html') {
                return [dom];
            }
            return dom.getElementsByTagName(tagName);
        };
        document.getElementById = function (id) {
            return getElementById.call(this, dom, id);
        };
        document.getElementsByClassName = function (className) {
            return dom.getElementsByClassName(className);
        };
        document.querySelector = function (selector) {
            return dom.querySelector(selector);
        };
        document.querySelectorAll = function (selector) {
            return dom.querySelectorAll(selector);
        };
    };

    this.uninstall = function () {
        var method;

        for (method in oldDocument) {
            if (oldDocument.hasOwnProperty(method)) {
                document[method] = oldDocument[method];
            }
        }

        oldDocument = null;
    };
};

(function () {
    var require = window.getJasmineRequireObj();
    window.jasmine.virtualDom = new require.VirtualDom();
})();
