function Collection(config) {
    config = config || {};
    Indexed.call(this, {elements: config.elements});
}
Collection.prototype = Object.create(Indexed.prototype);

Collection.prototype.isEmpty = function () {
    return this.length() == 0;
};
Collection.prototype.add = function (elem) {
    this.elements.push(elem);
    return this;
};
Collection.prototype.remove = function (index) {
    this.elements.splice(index, 1);
    return this;
};
Collection.prototype.clear = function () {
    this.elements = [];
    return this;
};
