/**
* Wrapper on top of the Document object model javascript API,
*   to make our life easier when we need to interact with such API in our tests
*
* @constructor VirtualDom
*/
window.getJasmineRequireObj().VirtualDom = function () {
    var oldDocument,

    spyElement = function (el) {
        var original = el.addEventListener;
        el.events = {};
        spyOn(el, 'addEventListener').and.callFake(function (name, listener) {
            if (this.events[name]) {
                this.events[name].push(listener);
            } else {
                this.events[name] = [listener];
            }

            original.call(this, name, listener);
        });

        return el;
    },

    spyElements = function (elements) {
        var i,
            result = [],
            length = elements.length;

        for (i = 0; i < length; i++) {
            result.push(spyElement.call(this, elements[i]));
        }

        return result;
    },

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

    getSingleElement = function (el) {
        if (el) {
            return spyElement.call(this, el);
        }
        
        return null;
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
    },

    merge = function (target, source) {
        var result = {},
            property;

        for (property in target) {
            result[property] = target[property];
        }

        for (property in source) {
            if (source.hasOwnProperty(property)) {
                result[property] = source[property];
            }
        }

        return result;
    },

    onEventTriggered = function (e) {
        e.preventDefault();

        e.target.removeEventListener(e.type, onEventTriggered);
    },

    shouldEventBubble = function (element) {
        return element.parentElement !== null && element.parentElement !== undefined;
    },

    callListeners = function (element, eventObject) {
        var i;

        if (element.events && element.events[eventObject.type]) {
            for (i = 0; i < element.events[eventObject.type].length; i++) {
                element.events[eventObject.type][i].call(element, eventObject);
            }
        }
    },

    dispatchEvent = function (element, eventObject) {
        callListeners.call(this, element, eventObject);

        if (shouldEventBubble.call(this, element)) {
            dispatchEvent.call(this, element.parentElement, eventObject);
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
        dom.innerHTML = body ? body : '';

        oldDocument = {
            getElementsByTagName: document.getElementsByTagName,
            getElementById: document.getElementById,
            querySelector: document.querySelector,
            querySelectorAll: document.querySelectorAll,
            getElementsByClassName: document.getElementsByClassName
        };

        document.getElementsByTagName = function (tagName) {
            if (tagName.toLowerCase() === 'html') {
                return spyElements.call(this, [dom]);
            }
            return spyElements.call(this, dom.getElementsByTagName(tagName));
        };
        document.getElementById = function (id) {          
            return getSingleElement.call(this, getElementById.call(this, dom, id));
        };
        document.getElementsByClassName = function (className) {
            return spyElements.call(this, dom.getElementsByClassName(className));
        };
        document.querySelector = function (selector) {
            return getSingleElement.call(this, dom.querySelector(selector));
        };
        document.querySelectorAll = function (selector) {
            return spyElements.call(this, dom.querySelectorAll(selector));
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
        var eventObject = new Event(event, {
            bubbles: true,
            cancelable: true
        }),
        preventBackup = eventObject.preventDefault;

        spyOn(eventObject, 'preventDefault').and.callFake(function () {
            preventBackup.call(eventObject);
        });
        element.addEventListener(event, onEventTriggered);

        mergeConfigIntoEventObject.call(this, eventObject, config);

        dispatchEvent.call(this, element, merge.call(this, eventObject, {
            target: element
        }));

        return eventObject.preventDefault.calls.count() === 1;
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
