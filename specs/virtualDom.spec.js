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

                    it('should return always the same element', function () {
                        var el = document.getElementById('child1'),
                            callback = function () {},
                            events;

                        el.addEventListener('click', callback);
                        events = el.events;

                        expect(document.getElementById('child1').events).toEqual(events);
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

                it('should be mocked elements', function () {
                    var newEl = document.createElement('div'),
                        callback = function () {};

                    expect(newEl.events).toEqual({});
                    newEl.addEventListener('click', callback);

                    expect(newEl.events.click[0]).toBe(callback);
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
