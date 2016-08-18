describe('Event', function () {

    var instanciate = function (virtualDom) {
        var require = window.getJasmineRequireObj();

        return new require.VirtualDomEvent(virtualDom);
    };

    it('should be defined', function () {
        expect(window.getJasmineRequireObj().VirtualDomEvent).toBeDefined();
    });

    it('should decorate the base virtual dom', function () {
        var virtualDom = {};

        virtualDom = instanciate(virtualDom);

        expect(virtualDom.trigger).toBeDefined();
    });

    describe('after installing', function () {

        var decoratedVirtualDom,
            virtualDom,

            initRealVirtualDom = function () {
                var require = window.getJasmineRequireObj();
                return new require.VirtualDom();
            };

        beforeEach(function () {
            var body = '<head></head><body>' +
                '<div id="myContainer" class="container">Hi!</div>' +
                '<div class="container">Hi2!</div>' +
                '<div id="selector">' +
                '<div id="child1" class="child">Yeeeeepa</div>' +
                '<div class="child">Yeeeeepa2</div>' +
                '</div>' +
                '</body>';

            virtualDom = initRealVirtualDom();
            virtualDom.install(body);

            decoratedVirtualDom = instanciate({});
        });

        afterEach(function () {
            virtualDom.uninstall();
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

                decoratedVirtualDom.trigger(htmlEl, 'click');

                expect(htmlCallback).toHaveBeenCalled();

                decoratedVirtualDom.trigger(container, 'click');

                expect(clickCallback).toHaveBeenCalled();
                expect(clickCallback2).toHaveBeenCalled();

                decoratedVirtualDom.trigger(container, 'blur');

                expect(blurCallback).toHaveBeenCalled();

                decoratedVirtualDom.trigger(container, 'focus');

                expect(focus).toHaveBeenCalled();

                decoratedVirtualDom.trigger(container, 'custom');

                expect(customCallback).toHaveBeenCalled();
            });

            it('should work with event delegation', function () {
                var container = document.getElementById('selector'),
                    child = document.getElementsByClassName('child')[0],
                    event,
                    clickCallback = function (e) {
                        event = e;
                    };

                container.addEventListener('click', clickCallback);
                decoratedVirtualDom.trigger(child, 'click');

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

                    result = decoratedVirtualDom.trigger(container, 'custom');

                    expect(result).toBe(false);
                });
            });

            describe('otherwise', function () {

                it('should return true', function () {
                    var container = document.getElementById('myContainer'),
                        result;

                    container.addEventListener('custom', function () {});

                    result = decoratedVirtualDom.trigger(container, 'custom');

                    expect(result).toBe(true);
                });
            });

            it('should disable real behaviour of elements', function () {
                var link,
                    event = new Event('click', {
                        bubbles: true,
                        cancelable: true
                    });

                virtualDom.resetDom('<a id="link" href="" />');

                spyOn(window, 'Event').and.returnValue(event);

                link = document.getElementById('link');

                // we need to avoid that the page reload while writing the test
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                });
                //

                decoratedVirtualDom.trigger(link, 'click');

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
                    decoratedVirtualDom.trigger(container, 'click', {
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
    });
});
