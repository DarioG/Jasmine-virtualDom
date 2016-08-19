describe('domMocker', function () {

    var dom,
        oldAPI,
        domMocker;

    beforeEach(function () {
        var require = window.getJasmineRequireObj();

        dom = document.createElement('html');

        dom.innerHTML = '<head></head><body>' +
            '<div id="myContainer" class="container">Hi!</div>' +
            '<div class="container">Hi2!</div>' +
            '<div id="selector">' +
            '<div id="child1" class="child">Yeeeeepa</div>' +
            '<div class="child">Yeeeeepa2</div>' +
            '</div>' +
            '</body>';

        oldAPI = {
            getElementsByTagName: document.getElementsByTagName,
            getElementById: document.getElementById,
            getElementsByClassName: document.getElementsByClassName,
            querySelector: document.querySelector,
            querySelectorAll: document.querySelectorAll,
            addEventListener: document.addEventListener,
            createElement: document.createElement
        };

        spyOn(HTMLElement.prototype, 'addEventListener');

        domMocker = new require.domMocker();
        domMocker.mockWith(dom);
    });

    describe('mockWith(dom)', function () {

        describe('document.getElementById', function () {

            describe('if the element exists in the virtual Dom', function () {

                it('should return it', function () {
                    var div = document.getElementById('myContainer');

                    expect(div.tagName).toBe('DIV');
                    expect(div.innerText).toBe('Hi!');
                });

                it('should mock also "addEventListener"', function () {
                    var div = document.getElementById('myContainer');

                    expect(div.events).toEqual({});
                });

                describe('attaching events', function () {

                    var div;

                    beforeEach(function () {
                        div = document.getElementById('myContainer');
                    });

                    it('should call to the original one', function () {
                        var args,
                            callback = function () {};

                        div.addEventListener('click', callback);
                        args = HTMLElement.prototype.addEventListener.calls.mostRecent().args;

                        expect(args[0]).toBe('click');
                        expect(args[1]).toBe(callback);
                    });

                    it('should add diferent events', function () {
                        var callback = function () {};

                        div.addEventListener('click', callback);
                        div.addEventListener('blur', callback);

                        expect(div.events.click[0]).toBe(callback);
                        expect(div.events.blur[0]).toBe(callback);
                    });

                    it('should add many callbacks for the same event', function () {
                        var callback = function () {};

                        div.addEventListener('click', callback);
                        div.addEventListener('click', callback);

                        expect(div.events.click[0]).toBe(callback);
                        expect(div.events.click[1]).toBe(callback);
                    });
                });

                it('should return always the same element', function () {
                    var el = document.getElementById('child1'),
                        callback = function () {},
                        events;

                    el.addEventListener('click', callback);
                    events = el.events;

                    expect(document.getElementById('child1').events).toEqual(events);
                });
            });

            describe('otherwise', function () {

                it('should return undefined', function () {
                    expect(document.getElementById('undefined')).toBeNull();
                });
            });
        });

        describe('document.getElementsByTagName', function () {

            describe('if the elements exist in the virtual Dom', function () {

                it('should return it', function () {
                    var elements = document.getElementsByTagName('div'),
                        div = elements[0];

                    expect(div.tagName).toBe('DIV');
                    expect(div.innerText).toBe('Hi!');
                });

                it('should return always the same collection', function () {
                    var collection = document.getElementsByClassName('child');

                    expect(collection).toBe(document.getElementsByClassName('child'));
                });

                it('should prepare the element to attaching events', function () {
                    var elements = document.getElementsByTagName('div'),
                        div = elements[0];

                    expect(div.events).toEqual({});
                });
            });

            describe('otherwise', function () {

                it('should return empty array', function () {
                    var result = document.getElementsByTagName('li');

                    expect(result.length).toEqual(0);
                });
            });

            describe('when the tag name is "html"', function () {

                it('should return the proper element', function () {
                    var result = document.getElementsByTagName('html');

                    expect(result.length).toBe(1);
                    expect(result[0]).toBe(dom);
                });

                it('should be prepared for events', function () {
                    var result = document.getElementsByTagName('html');

                    expect(result[0].events).toEqual({});
                });
            });
        });

        describe('document.getElementsByClassName', function () {

            describe('if the elements exist in the virtual Dom', function () {

                it('should return it', function () {
                    var divs = document.getElementsByClassName('container');

                    expect(divs.length).toBe(2);
                    expect(divs[0].innerText).toBe('Hi!');
                    expect(divs[0].tagName).toBe('DIV');
                    expect(divs[1].innerText).toBe('Hi2!');
                    expect(divs[1].tagName).toBe('DIV');
                });

                it('should prepare elements for events', function () {
                    var divs = document.getElementsByClassName('container');

                    expect(divs[0].events).toEqual({});
                });

                it('should return always the same collection', function () {
                    var collection = document.getElementsByClassName('container');

                    expect(collection).toBe(document.getElementsByClassName('container'));
                });
            });
        });

        describe('querySelector', function () {

            describe('it the element exists in the virtual Dom', function () {

                it('should return it', function () {
                    var div = document.querySelector('#selector .child');

                    expect(div.innerText).toBe('Yeeeeepa');
                    expect(div.tagName).toBe('DIV');
                });

                it('should prepare element for events', function () {
                    var divs = document.querySelector('#selector .child');

                    expect(divs.events).toEqual({});
                });

                it('should return always the same element', function () {
                    var div = document.querySelector('#selector .child');

                    expect(div).toBe(document.querySelector('#selector .child'));
                });
            });

            describe('otherwise', function () {

                it('should return null', function () {
                    var div = document.querySelector('#selector .nochild');

                    expect(div).toBe(null);
                });
            });
        });

        describe('querySelectorAll', function () {

            describe('it the elements exist in the virtual Dom', function () {

                it('should return it', function () {
                    var divs = document.querySelectorAll('#selector .child');

                    expect(divs.length).toBe(2);
                    expect(divs[0].innerText).toBe('Yeeeeepa');
                    expect(divs[0].tagName).toBe('DIV');
                    expect(divs[1].innerText).toBe('Yeeeeepa2');
                    expect(divs[1].tagName).toBe('DIV');
                });

                it('should prepare elements for events', function () {
                    var divs = document.querySelectorAll('#selector .child');

                    expect(divs[0].events).toEqual({});
                });

                it('should return the same elements', function () {
                    var selector = '#selector .child',
                        divs = document.querySelectorAll(selector),
                        callback = function () {};

                    divs[0].addEventListener('click', callback);
                    divs = document.querySelectorAll(selector);

                    expect(divs[0].events.click[0]).toBe(callback);
                });
            });
        });

        it('should mock document.addEventListener', function () {
            var callback = function () {};

            document.addEventListener('keyup', callback);

            expect(document.events.keyup[0]).toBe(callback);
        });

        describe('when creating element with the document api', function () {

            it('should be properly mocked', function () {
                var newEl = document.createElement('div'),
                    callback = function () {};

                expect(newEl.events).toEqual({});
                newEl.addEventListener('click', callback);

                expect(newEl.events.click[0]).toBe(callback);
            });
        });

        describe('unMock()', function () {

            it('should return the real dom', function () {
                var html;

                domMocker.unMock();

                html = document.getElementsByTagName('html')[0];

                expect(html.innerHTML).not.toEqual(dom);

                expect(oldAPI.getElementById).toBe(document.getElementById);
                expect(oldAPI.getElementsByTagName).toBe(document.getElementsByTagName);
                expect(oldAPI.getElementsByClassName).toBe(document.getElementsByClassName);
                expect(oldAPI.querySelector).toBe(document.querySelector);
                expect(oldAPI.querySelectorAll).toBe(document.querySelectorAll);
                expect(oldAPI.addEventListener).toBe(document.addEventListener);
            });

            it('should clean the mock for events from document', function () {
                domMocker.unMock();

                expect(document.events).not.toBeDefined();
            });

            xdescribe('when document.createElement has been spied in a test suite', function () {

                // test to avoid that document break the tests.
                it('should still work', function () {
                    spyOn(document, 'createElement');

                    //stupid expectation
                    document.createElement();
                    expect(document.createElement).toHaveBeenCalled();
                });
            });
        });
    });
});
