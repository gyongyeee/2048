/** @namespace QUnit */
QUnit.module( 'Indexed class' );
QUnit.test( "Initialization", function(assert) {
    var without_elements = new Indexed();
    assert.ok(without_elements instanceof Indexed, "Constructor call creates a Indexed instance");
    assert.strictEqual( without_elements.length(), 0, "Indexed has no elements after initialization.");

    var with_elements = new Indexed({elements:[1,2,3]});
    assert.ok(with_elements instanceof Indexed, "Constructor call with config creates a Indexed instance");
    assert.strictEqual( with_elements.length(), 3, "Elements supplied with config are stored in the Indexed");
});

QUnit.test( "Index validation", function(assert) {
    var indexed = new Indexed({elements:[10,20,30]});

    assert.strictEqual(indexed.isValidIndex(-1), false, "Negative index is not valid");
    assert.strictEqual(indexed.isValidIndex(42), false, "Too big index is not valid");
    assert.strictEqual(indexed.isValidIndex(0), true, "Valid index is within 0..length-1");
    assert.strictEqual(indexed.isValidIndex(3), false, "length is not valid as index");

});
QUnit.test( "Element retrieval" , function(assert) {
    var indexed = new Indexed({elements:[10,20,30,11,21,31]});

    assert.strictEqual(indexed.length(), 6, "length() returns the number of elements passed to constructor");
    assert.strictEqual(indexed.elem(1), 20, "elem(index) returns the (zero based) nth element");
    assert.strictEqual(indexed.elem(-1), undefined, "elem(index) does not have index check");
    assert.strictEqual(indexed.elem(1), 20, "elem(index) returns the (zero based) nth element");

    var range = indexed.range(2,3);
    var rangeExpected = [30,11];
    assert.ok(Object(range) instanceof Array, "range(start,end) returns an array");
    assert.deepEqual(range, rangeExpected, "range(start,end) returns the (zero based) range of elements");

    var invalid = indexed.range(-2,10);
    var expectedInvalid = [ undefined, undefined, 10, 20, 30, 11, 21, 31, undefined, undefined, undefined, undefined, undefined ];
    assert.deepEqual(invalid, expectedInvalid, "range(start,end) does not have index check");

});
QUnit.test( "Traversal", function(assert) {
    var indexed = new Indexed({elements:[10,20,30]});
    var eachExpected = [
        { "0": 10, "1": 0 },
        { "0": 20, "1": 1 },
        { "0": 30, "1": 2 }
    ];

    var each = mock();
    indexed.each(each);
    assert.deepEqual(each.log, eachExpected, "Each() calls the callback method with element and index params");

    var each2 = mock.returns(1);
    indexed.each(each2);
    assert.deepEqual(each2.log, [eachExpected[0]], "Each() terminates when the callback method returns trueish");

    var filter = mock.calls(function(element, index) {
        return !(index % 2);
    });
    var filtered = indexed.filter(filter);
    assert.ok(Object(filtered) instanceof Array, "filter() returns an array");
    assert.deepEqual(filter.log, eachExpected, "filter() evaluates predicate for each element");
    assert.deepEqual(filtered, [eachExpected[0][0], eachExpected[2][0]], "filter Indexed contains only the matching elements");
});

QUnit.test( "Search", function(assert) {
    var indexed = new Indexed({elements:[10,20,10]});
    var never = mock.returns(false);
    var always = mock.returns(true);
    var eachExpected = [
        { "0": 10, "1": 0 },
        { "0": 20, "1": 1 },
        { "0": 10, "1": 2 }
    ];

    assert.equal(indexed.findFirst(never), -1, "findFirst returns -1 if predicate is always false");
    assert.deepEqual(never.log, eachExpected, "Predicate is called for each key and value params");
    assert.equal(indexed.findFirst(always), 0, "findFirst returns index of the first matching element");
    assert.deepEqual(always.log, [eachExpected[0]], "Predicate is called until the first match only");

    assert.equal(indexed.indexOf(15), -1, "indexOf returns -1 if elem is not found");
    assert.equal(indexed.indexOf(10), 0, "indexOf returns index of the first matching element");
});

