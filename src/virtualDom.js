/**
* Wrapper on top of the Document object model javascript API,
*   to make our life easier when we need to interact with such API in our tests
*
* @constructor VirtualDom
*/
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
    },

    mergeConfigIntoEventObject = function (eventObj, config) {
        var prop;

        for (prop in config) {
            if (config.hasOwnProperty(prop)) {
                eventObj[prop] = config[prop];
            }
        }
    };

    /**
    * This method will override the document API to use the virtual one, instead of the real one.
    *
    * @param {String} [body]. HTML template to be added into the virtual dom when installing it
    * @memberof VirtualDom
    */
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
            querySelector: document.querySelector,
            querySelectorAll: document.querySelectorAll,
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

        // Object.defineProperty(document, 'body', {
        //     get: function () {
        //         return this.getElementsByTagName('body')[0];
        //     },
        //     configurable: true
        // });

        // Object.defineProperty(document, 'head', {
        //     get: function () {
        //         return this.getElementsByTagName('head')[0];
        //     },
        //     configurable: true
        // });
    };

    /**
    * @memberof VirtualDom
    */
    this.uninstall = function () {
        var method;

        for (method in oldDocument) {
            if (oldDocument.hasOwnProperty(method)) {
                document[method] = oldDocument[method];
            }
        }

        oldDocument = null;
    };

    /**
    * Trigger any kind of event from any element, native or custom events
    * @param {Object} element. Dom Element
    * @param {String} event. Event name
    * @param {Object} config. parameters to be added to the event object
    * @memberof VirtualDom
    */
    this.trigger = function (element, event, config) {
        var eventObject = new Event(event);

        mergeConfigIntoEventObject.call(this, eventObject, config);

        element.dispatchEvent(eventObject);
    };

    /**
    * Uninstall and install the virtual dom with a new html
    * @param {String} [body]. HTML template to be added into the virtual dom when installing it
    * @memberof VirtualDom
    */
    this.resetDom = function (body) {
        this.uninstall();
        this.install(body);
    };
};

(function () {
    var require = window.getJasmineRequireObj();
    window.jasmine.virtualDom = new require.VirtualDom();
})();
