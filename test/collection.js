/** @namespace QUnit */
QUnit.module( 'Collection class' );
QUnit.test("Initialization", function(assert) {
    var without_elements = new Collection();
    assert.ok(without_elements instanceof Collection, "Constructor call creates a Collection instance");
    assert.ok(without_elements instanceof Indexed, "Collection is also an Indexed instance");
    assert.strictEqual( without_elements.isEmpty(), true, "Indexed is empty after initialization.");

    var with_elements = new Collection({elements: [10, 20, 30]});
    assert.ok(with_elements instanceof Collection, "Constructor call with config creates a Collection instance");
    assert.strictEqual( with_elements.isEmpty(), false, "Indexed is empty when initialized with elements");
});


QUnit.test( "Add / remove elements", function(assert) {
    var collection = new Collection();
    assert.strictEqual( collection.elem(0), undefined, "Getting non existing element returns undefined.");
    assert.strictEqual( collection.add(12), collection, "Add() method returns the collection for chaining.");
    assert.strictEqual( collection.elem(0), 12, "Added element can be retrieved.");
    assert.strictEqual( collection.length(), 1, "Addition updates length.");
    assert.strictEqual( collection.isEmpty(), false, "Collection is not empty after addition.");
    collection.add(22);
    assert.strictEqual( collection.length(), 2, "Addition updates length.");
    assert.strictEqual( collection.elem(0), 12, "Existing element does not change during addition.");
    assert.strictEqual( collection.elem(1), 22, "New element is added to the end of elements.");

    assert.strictEqual( collection.remove(0), collection, "Remove() method returns the collection for chaining.");
    assert.deepEqual( collection.elements, [22], "Element array can be retrieved.");
    assert.strictEqual( collection.elem(0), 22, "Removed position is filled by subsequent elements.");
    assert.strictEqual( collection.elem(1), undefined, "Getting out of bounds element returns undefined.");
    assert.strictEqual( collection.remove(1), collection, "Remove() method ignores non existing index.");
    assert.strictEqual( collection.length(), 1, "Removal updates length.");
    assert.strictEqual( collection.isEmpty(), false, "Collection is not empty after deletion.");

    assert.strictEqual( collection.clear(), collection, "Clear() method returns the collection for chaining.");
    assert.strictEqual( collection.length(), 0, "Collection has no elements after clearing.");
    assert.strictEqual( collection.isEmpty(), true, "Collection is empty after clearing.");
});
