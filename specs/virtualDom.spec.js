describe('VirtualDom', function () {

    var realDom;

    beforeEach(function () {
        realDom = document.getElementsByTagName('html')[0];
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
            jasmine.virtualDom.uninstall(body);
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
            });
        });
    });
});
