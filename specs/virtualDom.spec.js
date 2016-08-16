describe('VirtualDom', function () {

    var realDom,
        oldAPI,
        jasVirtualDom,

        instanciate = function () {
            var require = window.getJasmineRequireObj();
            return new require.VirtualDom();
        };

    beforeEach(function () {
        realDom = document.getElementsByTagName('html')[0];
        jasVirtualDom = instanciate();

        oldAPI = {
            getElementsByTagName: document.getElementsByTagName,
            getElementById: document.getElementById,
            getElementsByClassName: document.getElementsByClassName,
            querySelector: document.querySelector,
            querySelectorAll: document.querySelectorAll,
            addEventListener: document.addEventListener,
            createElement: document.createElement
        };
    });

    it('should be defined', function () {
        expect(window.getJasmineRequireObj().VirtualDom).toBeDefined();
    });

    describe('installing', function () {

        describe('when no body is passed in', function () {

            it('should add only a empty head and body', function () {
                var html;

                jasVirtualDom.install();

                html = document.getElementsByTagName('html')[0];

                expect(html.innerHTML).toEqual('<head></head><body></body>');

                jasVirtualDom.uninstall();
            });
        });

        describe('when body is passed in', function () {

            var body;

            beforeEach(function () {
                body = '<head></head><body>' +
                    '<div id="myContainer" class="container">Hi!</div>' +
                    '<div class="container">Hi2!</div>' +
                    '<div id="selector">' +
                    '<div id="child1" class="child">Yeeeeepa</div>' +
                    '<div class="child">Yeeeeepa2</div>' +
                    '</div>' +
                    '</body>';

                jasVirtualDom.install(body);
            });

            afterEach(function () {
                jasVirtualDom.uninstall();
            });

            it('should add the html passed in', function () {
                var html = document.getElementsByTagName('html')[0];

                expect(html.innerHTML).toEqual(body);
                expect(realDom.innerHTML).not.toEqual(body);
            });

            describe('when document.createElement has been spied', function () {

                // test to avoid that document break the tests.
                it('should still work', function () {
                    spyOn(document, 'createElement');

                    document.createElement();

                    expect(document.createElement).toHaveBeenCalled();
                });
            });

            describe('trying to installing again', function () {

                it('should throw an exception', function () {
                    expect(function () {
                        jasVirtualDom.install(body);
                    }).toThrow('Virtual dom already installed');
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
                });

                describe('otherwise', function () {

                    it('should return empty array', function () {
                        var result = document.getElementsByTagName('li');

                        expect(result.length).toEqual(0);
                    });
                });
            });

            describe('document.getElementById', function () {

                describe('if the element exists in the virtual Dom', function () {

                    it('should return it', function () {
                        var div = document.getElementById('myContainer');

                        expect(div.tagName).toBe('DIV');
                        expect(div.innerText).toBe('Hi!');
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
                });
            });

            describe('querySelector', function () {

                describe('it the element exists in the virtual Dom', function () {

                    it('should return it', function () {
                        var div = document.querySelector('#selector .child');

                        expect(div.innerText).toBe('Yeeeeepa');
                        expect(div.tagName).toBe('DIV');
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
                });
            });

            // describe('document.body', function () {

            //     it('should return the virtual body', function () {
            //         var bodyTag = document.getElementsByTagName('body')[0];

            //         expect(bodyTag).toBe(document.body);
            //     });
            // });

            // describe('document.head', function () {

            //     it('should return the virtual body', function () {
            //         var headTag = document.getElementsByTagName('head')[0];

            //         expect(headTag).toBe(document.head);
            //     });
            // });

            describe('uninstalling', function () {

                it('should return the real dom', function () {
                    var html;

                    jasVirtualDom.uninstall();

                    html = document.getElementsByTagName('html')[0];

                    expect(html.innerHTML).not.toEqual(body);
                    expect(html).toBe(realDom);

                    expect(oldAPI.getElementById).toBe(document.getElementById);
                    expect(oldAPI.getElementsByTagName).toBe(document.getElementsByTagName);
                    expect(oldAPI.getElementsByClassName).toBe(document.getElementsByClassName);
                    expect(oldAPI.querySelector).toBe(document.querySelector);
                    expect(oldAPI.querySelectorAll).toBe(document.querySelectorAll);
                    expect(oldAPI.addEventListener).toBe(document.addEventListener);
                    // expect(oldAPI.body).toBe(document.body);
                    // expect(oldAPI.head).toBe(document.head);
                });
            });

            describe('trigger(element, event)', function () {

                it('should trigger all the event listeners', function () {
                    var htmlEl = document.getElementsByTagName('html')[0],
                        container = document.getElementById('myContainer'),
                        htmlCallback = jasmine.createSpy(),
                        clickCallback = jasmine.createSpy(),
                        clickCallback2 = jasmine.createSpy(),
                        blurCallback = jasmine.createSpy(),
                        customCallback = jasmine.createSpy(),
                        focus = jasmine.createSpy();

                    htmlEl.addEventListener('click', htmlCallback);
                    container.addEventListener('click', clickCallback);
                    container.addEventListener('click', clickCallback2);
                    container.addEventListener('blur', blurCallback);
                    container.addEventListener('focus', focus);
                    container.addEventListener('custom', customCallback);

                    jasVirtualDom.trigger(htmlEl, 'click');

                    expect(htmlCallback).toHaveBeenCalled();

                    jasVirtualDom.trigger(container, 'click');

                    expect(clickCallback).toHaveBeenCalled();
                    expect(clickCallback2).toHaveBeenCalled();

                    jasVirtualDom.trigger(container, 'blur');

                    expect(blurCallback).toHaveBeenCalled();

                    jasVirtualDom.trigger(container, 'focus');

                    expect(focus).toHaveBeenCalled();

                    jasVirtualDom.trigger(container, 'custom');

                    expect(customCallback).toHaveBeenCalled();
                });

                it('should trigger also events attached to the document', function () {
                    var callback = jasmine.createSpy();

                    document.addEventListener('keyup', callback);

                    jasVirtualDom.trigger(document, 'keyup');

                    expect(callback).toHaveBeenCalled();
                });

                describe('when we get the same element twice from the dom', function () {

                    it('should trigger the events', function () {
                        var el = document.getElementById('child1'),
                            callback = jasmine.createSpy();

                        el.addEventListener('click', callback);

                        jasVirtualDom.trigger(document.getElementById('child1'), 'click');

                        expect(callback).toHaveBeenCalled();
                    });
                });

                it('should trigger events in elements created with the document api', function () {
                    var container = document.getElementById('myContainer'),
                        callback = jasmine.createSpy(),
                        newEl = document.createElement('div');

                    newEl.addEventListener('click', callback);

                    container.appendChild(newEl);

                    jasVirtualDom.trigger(newEl, 'click');

                    expect(callback).toHaveBeenCalled();
                });

                it('should work with event delegation', function () {
                    var container = document.getElementById('selector'),
                        child = document.getElementsByClassName('child')[0],
                        event,
                        clickCallback = function (e) {
                            event = e;
                        };

                    container.addEventListener('click', clickCallback);
                    jasVirtualDom.trigger(child, 'click');

                    expect(event.target.id).toBe(child.id);
                    expect(event.srcElement.id).toBe(child.id);
                    expect(event.toElement.id).toBe(child.id);
                    expect(event.currentTarget).toBe(container);
                });

                describe('when at least one of the listeners is preventDefault', function () {

                    it('should return false', function () {
                        var container = document.getElementById('myContainer'),
                            result;

                        container.addEventListener('custom', function (e) {
                            e.preventDefault();
                        });

                        result = jasVirtualDom.trigger(container, 'custom');

                        expect(result).toBe(false);
                    });
                });

                describe('otherwise', function () {

                    it('should return true', function () {
                        var container = document.getElementById('myContainer'),
                            result;

                        container.addEventListener('custom', function () {});

                        result = jasVirtualDom.trigger(container, 'custom');

                        expect(result).toBe(true);
                    });
                });

                it('should disable real behaviour of elements', function () {
                    var link,
                        event = new Event('click', {
                            bubbles: true,
                            cancelable: true
                        });

                    jasVirtualDom.resetDom('<a id="link" href="" />');

                    spyOn(window, 'Event').and.returnValue(event);

                    link = document.getElementById('link');

                    // we need to avoid that the page reload while writing the test
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                    });
                    //

                    jasVirtualDom.trigger(link, 'click');

                    // this method is spied in the trigger method
                    expect(event.preventDefault.calls.count()).toBe(2);

                    // To check that the temporary event listener is removed
                    link.dispatchEvent(event);
                    expect(event.preventDefault.calls.count()).toBe(3);
                });

                describe('when passing in some config', function () {

                    it('should add it to the event object', function () {
                        var config,
                            container = document.getElementById('myContainer'),
                            callback = function (e) {
                                config = e;
                            };

                        container.addEventListener('click', callback);
                        jasVirtualDom.trigger(container, 'click', {
                            config1: 'config1',
                            config2: 'config2',
                            config3: 'config3',
                            config4: 'config4'
                        });

                        expect(config.config1).toEqual('config1');
                        expect(config.config2).toEqual('config2');
                        expect(config.config3).toEqual('config3');
                        expect(config.config4).toEqual('config4');
                    });
                });
            });

            describe('resetDom(body)', function () {

                it('should clean the previous dom', function () {
                    var container;

                    jasVirtualDom.resetDom();
                    container = document.getElementById('myContainer');

                    expect(container).toBeNull();
                });

                it('should add the new html', function () {
                    var container;

                    jasVirtualDom.resetDom('<head></head><body>' +
                        '<div id="myNewContainer" class="container">Hi!</div>' +
                        '</body>');
                    container = document.getElementById('myNewContainer');

                    expect(container).toBeDefined();
                });
            });
        });
    });
});
