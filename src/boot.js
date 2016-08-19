(function (global) {
    var require = global.getJasmineRequireObj();
    global.jasmine.virtualDom = new require.VirtualDomEvent(new require.VirtualDom({
        domMocker: require.domMocker
    }));
})(window);
