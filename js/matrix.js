function Matrix(config) {
    config = config || {};
    this.ElementClass = config.ElementClass || Object;
    this.width = config.width || 3;
    this.height = config.height || 3;

    var elements = [];
    for (var i = 0; i <= this.pos2index(this.width - 1, this.height - 1); i++)
        elements.push((function (ElementClass, index, cfg) {
            return (cfg.length > i ? new ElementClass(cfg[i]) : new ElementClass());
        })(this.ElementClass, i, config.elements || []));
    Indexed.call(this, {elements: elements});
}
Matrix.prototype = Object.create(Indexed.prototype);
Matrix.prototype.constructor = Matrix;

Matrix.prototype.pos2index = function (x, y) {
    return y * this.width + x;
};
Matrix.prototype.index2pos = function (index) {
    return {x: index % this.width, y: parseInt(index / this.width, 10)};
};
Matrix.prototype.cell = function (x, y) {
    var index = this.pos2index(x, y);
    return this.elem(index);
};
Matrix.prototype.row = function (row_index) {
    var self = this;
    return this.filter(function (elem, index) {
        var pos = self.index2pos(index);
        return pos.y === row_index;
    });
};
Matrix.prototype.column = function (column_index) {
    var self = this;
    return this.filter(function (elem, index) {
        return self.index2pos(index).x === column_index;
    });
};

