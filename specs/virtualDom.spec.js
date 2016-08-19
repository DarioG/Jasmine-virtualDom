describe('VirtualDom', function () {

    var jasVirtualDom,
        html,
        domMocker,

        instanciate = function () {
            var require = window.getJasmineRequireObj();
            return new require.VirtualDom({
                domMocker: domMocker
            });
        };

    beforeEach(function () {
        domMocker = function () {};

        domMocker.prototype.mockWith = jasmine.createSpy();
        domMocker.prototype.unMock = jasmine.createSpy();

        jasVirtualDom = instanciate();

        html = {
            innerHTML: ''
        };

        spyOn(document, 'createElement').and.returnValue(html);
    });

    it('should be defined', function () {
        expect(window.getJasmineRequireObj().VirtualDom).toBeDefined();
    });

    describe('installing', function () {

        describe('when no body is passed in', function () {

            it('should add only a empty head and body', function () {
                jasVirtualDom.install();

                expect(html.innerHTML).toEqual('');

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

            it('should add the html passed in', function () {
                expect(html.innerHTML).toEqual(body);
            });

            it('should mock the API', function () {
                expect(domMocker.prototype.mockWith).toHaveBeenCalledWith(html);
            });

            describe('trying to installing again', function () {

                it('should throw an exception', function () {
                    expect(function () {
                        jasVirtualDom.install(body);
                    }).toThrow('Virtual dom already installed');
                });
            });

            describe('uninstalling', function () {

                it('should relase the mocks', function () {
                    jasVirtualDom.uninstall();

                    expect(domMocker.prototype.unMock).toHaveBeenCalled();
                });

                describe('trying to installing again', function () {

                    it('should not throw an exception', function () {
                        jasVirtualDom.uninstall();

                        expect(function () {
                            jasVirtualDom.install(body);
                        }).not.toThrow();
                    });
                });
            });

            describe('resetDom(body)', function () {

                beforeEach(function () {
                    spyOn(jasVirtualDom, 'install');
                    spyOn(jasVirtualDom, 'uninstall');

                    jasVirtualDom.resetDom();
                });

                it('should uninstall', function () {
                    expect(jasVirtualDom.uninstall).toHaveBeenCalled();
                });

                it('should add the new html', function () {
                    expect(jasVirtualDom.install).toHaveBeenCalled();
                });
            });
        });
    });
});
