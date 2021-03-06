/**
 * Service to mock the document API
 *
 * @constructor domMocker
 */
window.getJasmineRequireObj().domMocker = function () {
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

        isAlreadyMocked = function (el) {
            return el.events;
        },

        processElement = function (el) {
            if (!isAlreadyMocked.call(this, el)) {
                return stubElement.call(this, el);
            }

            return el;
        },

        getSingleElement = function (el) {
            return el ? processElement.call(this, el) : null;
        },

        processElements = function (elements) {
            var i,
                length = elements.length;

            for (i = 0; i < length; i++) {
                processElement.call(this, elements[i]);
            }

            return elements;
        };

    /**
     * @param  {HTMLElement} dom Virtual dom
     * @memberof domMocker
     */
    this.mockWith = function (dom) {
        var docCreateElementBackup = document.createElement;

        oldDocument = {
            getElementsByTagName: document.getElementsByTagName,
            getElementById: document.getElementById,
            querySelector: document.querySelector,
            querySelectorAll: document.querySelectorAll,
            getElementsByClassName: document.getElementsByClassName,
            addEventListener: document.addEventListener
        };

        document.getElementsByTagName = function (tagName) {
            if (tagName.toLowerCase() === 'html') {
                // This array could lead to problems
                return processElements.call(this, [dom]);
            }
            return processElements.call(this, dom.getElementsByTagName(tagName));
        };

        document.getElementById = function (id) {
            return getSingleElement.call(this, getElementById.call(this, dom, id));
        };

        document.getElementsByClassName = function (className) {
            return processElements.call(this, dom.getElementsByClassName(className));
        };

        document.querySelector = function (selector) {
            return getSingleElement.call(this, dom.querySelector(selector));
        };

        document.querySelectorAll = function (selector) {
            return processElements.call(this, dom.querySelectorAll(selector));
        };

        processElement.call(this, document);

        document.createElement = function () {
            return processElement.call(this, docCreateElementBackup.apply(this, arguments));
        };
    };

    /**
     * @memberof domMocker
     */
    this.unMock = function () {
        var method;

        for (method in oldDocument) {
            if (oldDocument.hasOwnProperty(method)) {
                document[method] = oldDocument[method];
            }
        }

        delete document.events;
    };
};
