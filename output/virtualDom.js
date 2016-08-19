/**
 * Wrapper on top of the Document object model javascript API,
 *   to make our life easier when we need to interact with such API in our tests
 *
 * @constructor VirtualDom
 */
window.getJasmineRequireObj().VirtualDom = function () {
    var oldDocument,

        isAlreadyStubbed = function (el) {
            return el.events;
        },

        stubElement = function (el) {
            var original = el.addEventListener;

            el.events = {};
            el.addEventListener = function (name, listener) {
                if (this.events[name]) {
                    this.events[name].push(listener);
                } else {
                    this.events[name] = [listener];
                }

                original.call(this, name, listener);
            };

            return el;
        },

        processElement = function (el) {
            if (!isAlreadyStubbed.call(this, el)) {
                return stubElement.call(this, el);
            }

            return el;
        },

        processElements = function (elements) {
            var i,
                length = elements.length;

            for (i = 0; i < length; i++) {
                processElement.call(this, elements[i]);
            }

            return elements;
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
            return el ? processElement.call(this, el) : null;
        },

        isAlreadyInstalled = function () {
            return !!oldDocument;
        },

        stubDomApi = function (dom) {
            var me = this,
                docCreateElementBackup = document.createElement;

            oldDocument = {
                getElementsByTagName: document.getElementsByTagName,
                getElementById: document.getElementById,
                querySelector: document.querySelector,
                querySelectorAll: document.querySelectorAll,
                getElementsByClassName: document.getElementsByClassName,
                addEventListener: document.addEventListener
            };

            document.createElement = function () {
                // when this method is spied in the specs there is a conflic because
                // the spies are set back after the virtual dom is set back
                if (!oldDocument) {
                    this.createElement = docCreateElementBackup;
                    return this.createElement.apply(this, arguments);
                } else {
                    return processElement.call(me, docCreateElementBackup.apply(this, arguments));
                }
            };

            document.getElementsByTagName = function (tagName) {
                if (tagName.toLowerCase() === 'html') {
                    // This array could lead to problems
                    return processElements.call(me, [dom]);
                }
                return processElements.call(me, dom.getElementsByTagName(tagName));
            };
            document.getElementById = function (id) {
                return getSingleElement.call(me, getElementById.call(me, dom, id));
            };
            document.getElementsByClassName = function (className) {
                return processElements.call(me, dom.getElementsByClassName(className));
            };
            document.querySelector = function (selector) {
                return getSingleElement.call(me, dom.querySelector(selector));
            };
            document.querySelectorAll = function (selector) {
                return processElements.call(me, dom.querySelectorAll(selector));
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

            processElement.call(this, document);
        };

    /**
     * This method will override the document API to use the virtual one, instead of the real one.
     *
     * @param {String} [body] HTML template to be added into the virtual dom when installing it
     * @memberof VirtualDom
     */
    this.install = function (body) {
        var dom;

        if (isAlreadyInstalled.call(this)) {
            throw 'Virtual dom already installed';
        }

        dom = document.createElement('html');
        dom.innerHTML = body ? body : '';

        stubDomApi.call(this, dom);
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

        delete document.events;
        oldDocument = null;
    };

    /**
     * Uninstall and install the virtual dom with a new html
     * @param {String} [body] HTML template to be added into the virtual dom when installing it
     * @memberof VirtualDom
     */
    this.resetDom = function (body) {
        this.uninstall();
        this.install(body);
    };
};

/**
 * Decorator. Add the functionality of triggering events
 *
 * @constructor VirtualDomEvent
 */
window.getJasmineRequireObj().VirtualDomEvent = function (virtualDom) {
    var merge = function (target, source) {
            var result = target,
                property;

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

        hasListeners = function (element, event) {
            return element.events && element.events[event];
        },

        callListeners = function (element, eventObject) {
            var i,
                listeners = element.events[eventObject.type];

            for (i = 0; i < listeners.length; i++) {
                listeners[i].call(element, merge.call(this, eventObject, {
                    currentTarget: element
                }));
            }
        },

        dispatchEvent = function (element, eventObject) {
            if (hasListeners.call(this, element, eventObject.type)) {
                callListeners.call(this, element, eventObject);
            }

            if (shouldEventBubble.call(this, element)) {
                dispatchEvent.call(this, element.parentElement, eventObject);
            }
        },

        copyObjectFrom = function (source) {
            var result = {},
                property;

            /* jshint forin: false */
            for (property in source) {
                result[property] = source[property];
            }
            /* jshint forin: true */

            return result;
        },

        prepareEvent = function (eventObject, element, config) {
            var eventCopy = merge.call(this, copyObjectFrom.call(this, eventObject), config);

            return merge.call(this, eventCopy, {
                target: element,
                srcElement: element,
                toElement: element
            });
        };

    merge.call(this, this, virtualDom);

    /**
     * Trigger any kind of event from any element, native or custom events
     * @param {Object} element Dom Element
     * @param {String} event Event name
     * @param {Object} config parameters to be added to the event object
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

        dispatchEvent.call(this, element, prepareEvent.call(this, eventObject, element, config));

        return eventObject.preventDefault.calls.count() === 1;
    };
};

(function (global) {
    var require = global.getJasmineRequireObj();
    global.jasmine.virtualDom = new require.VirtualDomEvent(new require.VirtualDom());
})(window);
