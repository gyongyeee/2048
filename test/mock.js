/**
 * Creates a function which registers all invocation
 * @example
 *      var fn = mock();
 *      fn('param1');
 *      fn(1, 2);
 *      assert.deepEqual( fn.log, [['param1'], [1,2]]);
 */
function mock() {
    return mock.returns(null);
}
mock.returns = function (value) {
    return mock.calls(function () {
        return value;
    });
};
mock.calls = function (callback) {
    var log = [];

    function logger() {
        log.push(arguments);
        return callback.apply(this, arguments);
    }

    logger.log = log;
    return logger;
};
