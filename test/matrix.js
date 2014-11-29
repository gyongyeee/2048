/** @namespace QUnit */
QUnit.module( "Matrix class" );
QUnit.test( "Initialization", function( assert ) {
    var symmetric = new Matrix();
    assert.ok(symmetric instanceof Matrix, "Constructor call creates a Matrix instance");
    assert.ok(symmetric instanceof Indexed, "Matrix is a subclass of Indexed");
    assert.strictEqual(symmetric.ElementClass, Object, "Default ElementClass is Object");
    assert.strictEqual(symmetric.width, 3, "Default width is 3");
    assert.strictEqual(symmetric.height, 3, "Default height is 3");
    assert.ok(symmetric.elements[0] instanceof Object, "Matrix is initialized with elements");

    var asymmetric = new Matrix({ElementClass: Number, width: 4, height: 5});
    assert.ok(asymmetric instanceof Matrix, "Constructor accepts configuration parameter");
    assert.strictEqual(asymmetric.ElementClass, Number, "ElementClass is set by config");
    assert.strictEqual(asymmetric.width, 4, "width is set by config");
    assert.strictEqual(asymmetric.height, 5, "height is set by config");
    assert.ok(asymmetric.elements[0] instanceof Number, "Matrix is initialized with elements of ElementClass");

    var ElementClass = mock.calls(function(elem){
        this.value = (0 + elem);
    });
    var partial = new Matrix({ElementClass: ElementClass, width: 2, height: 2, elements:[11]});
    var expectedLog = [ { "0": 11 }, {}, {}, {} ];
    assert.deepEqual(ElementClass.log, expectedLog, "Element constructor called for each element");
    assert.ok(partial.elements[0] instanceof ElementClass, "Matrix is initialized with elements of ElementClass");
});
QUnit.test( "Position / index conversion", function(assert){
    var matrix = new Matrix({width: 3, height: 4});
    assert.deepEqual(matrix.index2pos(0), {x:0, y:0}, "first position is (0,0)");
    assert.deepEqual(matrix.pos2index(0, 0), 0, "first index is 0");
    assert.deepEqual(matrix.index2pos(1), {x:1, y:0}, "incrementing index increments x");
    assert.deepEqual(matrix.pos2index(1,0), 1, "incrementing x increments index");
    assert.deepEqual(matrix.index2pos(3), {x:0, y:1}, "when index is incremented to width, y increased");
    assert.deepEqual(matrix.pos2index(0, 1), 3, "increasing y adds width to index");
    assert.deepEqual(matrix.index2pos(12), {x:0, y:4}, "there is no validation during index to position conversion");
    assert.deepEqual(matrix.pos2index(0,4), 12, "there is no validation during position to index conversion");
});
QUnit.test( "Cell accessors", function( assert ){
    var elements = [
        11, 12, 13, 14,
        21, 22, 23, 24,
        31, 32, 33, 34
    ];
    var matrix = new Matrix({ElementClass: Number, width: 4, height: 3, elements: elements});

    var cell = matrix.cell(3, 2);
    assert.ok(cell instanceof Number, "cell(row,column) returns a single element of type ElementClass");
    assert.equal(cell, 34, "cell(row,column) coordinates are zero based");
    cell.key = 'value';
    assert.strictEqual(matrix.cell(3,2).key, 'value', "cell(row,column) returns reference");
    assert.strictEqual(matrix.cell(6,3), undefined, "cell(row,column) does not have index check");
});
QUnit.test( "Row accessors", function( assert ){
    var elements = [
        11, 12, 13, 14,
        21, 22, 23, 24,
        31, 32, 33, 34
    ];
    var expectedrow = [31, 32, 33, 34];
    var matrix = new Matrix({ElementClass: Number, width: 4, height: 3, elements: elements});

    var row = matrix.row(2);
    assert.ok(Object(row) instanceof Array, "row(index) returns an array");
    assert.deepEqual(row, expectedrow, "row index is zero based");
});
QUnit.test( "Column accessors", function( assert ){
    var elements = [
        11, 12, 13, 14,
        21, 22, 23, 24,
        31, 32, 33, 34
    ];
    var expectedcol = [13, 23, 33];
    var matrix = new Matrix({ElementClass: Number, width: 4, height: 3, elements: elements});

    var col = matrix.column(2);
    assert.ok(Object(col) instanceof Array, "column(index) returns an array");
    assert.deepEqual(col, expectedcol, "column index is zero based");
});