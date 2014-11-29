function Indexed(config) {
    config = config || {};
    this.elements = config.elements || [];
}
Indexed.prototype.isValidIndex = function (index) {
    return index >= 0 && index < this.length();
};
Indexed.prototype.length = function () {
    return this.elements.length;
};

Indexed.prototype.elem = function (index) {
    return this.elements[index];
};

Indexed.prototype.each = function (callback, start, end, step) {
    start = start || 0;
    end = end || this.length() - 1;
    step = step || 1;

    for (var i = start; i <= end; i += step) {
        if (callback(this.elem(i), i)) break;
    }
    return this;
};

Indexed.prototype.findFirst = function (predicate, start, end) {
    var result = -1;
    this.each(function (elem, index) {
        var found = predicate(elem, index);
        if (found) result = index;
        return found;
    }, start, end);
    return result;
};

Indexed.prototype.indexOf = function (needle, start, end) {
    return this.findFirst(function (elem) {
        return elem === needle;
    }, start, end);
};

Indexed.prototype.range = function (start, end) {
    return this.filter(function(){return true;}, start, end);
};

Indexed.prototype.filter = function (predicate, start, end) {
    var elements = [];
    this.each(function (elem, index) {
        if (predicate(elem, index)) {
            elements.push(elem);
        }
    }, start, end);
    return elements;
};
