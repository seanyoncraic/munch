// Polyfill to accommodate for IE not supporting custom events constructed like new Event
// A polyfill is a browser fallback, made in javascript, that allows functionality you expect to work in modern browsers to work in older browsers.
(function () {
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    };
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();
