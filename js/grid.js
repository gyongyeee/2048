function Position(config) {
    config = config || {};
    this.x = config.x;
    this.y = config.y;
}
Position.prototype.getX = function() {
    return this.x;
};
Position.prototype.getY = function() {
    return this.y;
};

function Cell(config) {
    config = config || {};
    Position.call(this, config);
    this.tile = config.tile || null;
}
Cell.prototype = Object.create(Position.prototype);
Cell.prototype.setTile = function(value) {
    this.tile = value;
    return this;
};
Cell.prototype.getTile = function() {
    return this.tile;
};
Cell.prototype.clearTile = function () {
    this.setTile(null);
    return this;
};
Cell.prototype.isAvailable = function() {
    return !this.tile;
};
Cell.prototype.isOccupied = function() {
    return !this.isAvailable();
};


function CellCollection(config) {
    Collection.call(this, config);
}
CellCollection.prototype = Object.create(Collection.prototype);
CellCollection.prototype.availableCells = function(){
    return this._filtered(function(cell){
        return cell.isAvailable();
    });
};
CellCollection.prototype.occupiedCells = function(){
    return this._filtered(function(cell){
        return cell.isOccupied();
    });
};

function Grid(config) {
    config = config || {};
    var size = config.size || 5;

    this.size = size;
    this.cells = cells;
}

// Inserts a tile at its position
Grid.prototype.insertTile = function (cell) {
    this.cell(cell.x, cell.y).tile = cell.tile;
    return this;
};

Grid.prototype.removeTile = function (cell) {
    this.cell(cell.x, cell.y).tile = null;
    return this;
};

Grid.prototype.withinBounds = function (position) {
    return position.x >= 0 && position.x < this.size &&
        position.y >= 0 && position.y < this.size;
};