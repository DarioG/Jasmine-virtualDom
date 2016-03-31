describe('VirtualDom', function () {

    var realDom,
        oldAPI;

    beforeEach(function () {
        realDom = document.getElementsByTagName('html')[0];

        oldAPI = {
            getElementsByTagName: document.getElementsByTagName,
            getElementById: document.getElementById,
            getElementsByClassName: document.getElementsByClassName,
            querySelector: document.querySelector,
            querySelectorAll: document.querySelectorAll
        };
    });

    it('should be defined', function () {
        expect(window.getJasmineRequireObj().VirtualDom).toBeDefined();
    });

    describe('installing', function () {

        var body;

        beforeEach(function () {
            body = '<head></head><body>' +
                '<div id="myContainer" class="container">Hi!</div>' +
                '<div class="container">Hi2!</div>' +
                '<div id="selector">' +
                    '<div class="child">Yeeeeepa</div>' +
                    '<div class="child">Yeeeeepa2</div>' +
                '</div>' +
            '</body>';

            jasmine.virtualDom.install(body);
        });

        afterEach(function () {
            jasmine.virtualDom.uninstall();
        });

        it('should add the html passed in', function () {
            var html = document.getElementsByTagName('html')[0];

            expect(html.innerHTML).toEqual(body);
            expect(realDom.innerHTML).not.toEqual(body);
        });

        describe('trying to installing again', function () {

            it('should throw an exception', function () {
                expect(function () {
                    jasmine.virtualDom.install(body);
                }).toThrow('Virtual dom already installed');
            });
        });

        describe('document.getElementsByTagName', function () {

            describe('if the elements exist in the virtual Dom', function () {

                it('should return it', function () {
                    var div = document.getElementsByTagName('div')[0];

                    expect(div.tagName).toBe('DIV');
                    expect(div.innerText).toBe('Hi!');
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

        describe('uninstalling', function () {

            it('should return the real dom', function () {
                var html;

                jasmine.virtualDom.uninstall(body);

                html = document.getElementsByTagName('html')[0];

                expect(html.innerHTML).not.toEqual(body);
                expect(html).toBe(realDom);

                expect(oldAPI.getElementById).toBe(document.getElementById);
                expect(oldAPI.getElementsByTagName).toBe(document.getElementsByTagName);
                expect(oldAPI.getElementsByClassName).toBe(document.getElementsByClassName);
                expect(oldAPI.querySelector).toBe(document.querySelector);
                expect(oldAPI.querySelectorAll).toBe(document.querySelectorAll);
            });
        });

        describe('trigger(element, event)', function () {

            it('should trigger all the event listeners', function () {
                var container = document.getElementById('myContainer'),
                    clickCallback = jasmine.createSpy(),
                    clickCallback2 = jasmine.createSpy(),
                    blurCallback = jasmine.createSpy(),
                    customCallback = jasmine.createSpy(),
                    focus = jasmine.createSpy();

                container.addEventListener('click', clickCallback);
                container.addEventListener('click', clickCallback2);
                container.addEventListener('blur', blurCallback);
                container.addEventListener('focus', focus);
                container.addEventListener('custom', customCallback);

                jasmine.virtualDom.trigger(container, 'click');

                expect(clickCallback).toHaveBeenCalled();
                expect(clickCallback2).toHaveBeenCalled();

                jasmine.virtualDom.trigger(container, 'blur');

                expect(blurCallback).toHaveBeenCalled();

                jasmine.virtualDom.trigger(container, 'focus');

                expect(focus).toHaveBeenCalled();

                jasmine.virtualDom.trigger(container, 'custom');

                expect(customCallback).toHaveBeenCalled();
            });
        });
    });
});
