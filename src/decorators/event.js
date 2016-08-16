/**
 * DEcorator. Add the functionality of triggering events
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

    merge.call(this, virtualDom);

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
