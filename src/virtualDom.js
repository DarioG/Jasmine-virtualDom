/**
 * Wrapper on top of the Document object model javascript API,
 *   to make our life easier when we need to interact with such API in our tests
 *
 * @constructor VirtualDom
 */
window.getJasmineRequireObj().VirtualDom = function (dependencies) {
    var mocker,

        isAlreadyInstalled = function () {
            return !!mocker;
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

        mocker = new dependencies.domMocker();
        mocker.mockWith(dom);
    };

    /**
     * @memberof VirtualDom
     */
    this.uninstall = function () {
        mocker.unMock();

        mocker = null;
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
