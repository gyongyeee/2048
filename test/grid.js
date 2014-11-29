/** @namespace QUnit */
QUnit.module( "Cell class" );
QUnit.test( "Tile", function( assert ) {
    assert.ok( QUnit.is('function', Cell), "constructor exists" );
    var cell = new Cell();

    assert.strictEqual( cell.getTile(), null, "Tile is null by default" );
    assert.strictEqual( cell.isAvailable(), true, "Cell is available by default" );
    assert.strictEqual( cell.isOccupied(), false, "Cell is not occupied by default" );

    assert.strictEqual( cell.setTile(42), cell, "setTile returns the cell object for chaining" );
    assert.strictEqual( cell.getTile(), 42, "getTile returns value set by setTile" );
    assert.strictEqual( cell.isAvailable(), false, "Cell is not available if tile was set" );
    assert.strictEqual( cell.isOccupied(), true, "Cell is occupied if tile is set" );

    assert.strictEqual( cell.clearTile(), cell, "clearTile returns the cell object for chaining" );
    assert.strictEqual( cell.getTile(), null, "Tile is null when cleared" );
});


/*
QUnit.module( 'Grid class' );
QUnit.test( "Grid(size) class", function( assert ) {
    assert.equal( typeof(Grid), "function", "constructor exists" );
    var grid = new Grid({size: 3});
    assert.equal( grid.size, 3, "Size passed to constructor");
    assert.ok( Object(grid.cells) instanceof Array, "Cells array initialized" );
    assert.deepEqual(grid.cells, [], "Cells array is empty");
});

QUnit.test( "eachCell(callback) method", function(assert){
    var grid = new Grid({size: 3}), eachCell_log = [];
    assert.equal( typeof(grid.eachCell), "function", "method exists" );
    grid.eachCell(function (){
        eachCell_log.push(arguments);
    });
    assert.deepEqual(eachCell_log, [
        { "0": 0, "1": 0, "2": null }, { "0": 0, "1": 1, "2": null }, { "0": 0, "1": 2, "2": null },
        { "0": 1, "1": 0, "2": null }, { "0": 1, "1": 1, "2": null }, { "0": 1, "1": 2, "2": null },
        { "0": 2, "1": 0, "2": null }, { "0": 2, "1": 1, "2": null }, { "0": 2, "1": 2, "2": null }
    ] , "calls callback for _each empty cell")
});

QUnit.test( "availableCells() method", function(assert){
    var grid = new Grid({size: 3, cells: [[2], [null,2,4]]});
    assert.equal( typeof(grid.availableCells), "function", "method exists" );
    assert.deepEqual(grid.availableCells(), [{x:0,y:1},{x:0,y:2},{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:2,y:2}], "returns empty cells only");
});

QUnit.test( "cellsAvailable() method", function(assert){
    var grid = new Grid({size: 3});
    assert.equal( typeof(grid.cellsAvailable), "function", "method exists" );
    assert.ok( grid.cellsAvailable(), "Empty grid has available cells" );
    grid = new Grid({size: 3, cells: [[2], [null,2,4]]});
    assert.ok( grid.cellsAvailable(), "Partial grid has available cells" );
    grid = new Grid({size: 3, cells: [[2,2,2], [2,2,4], [4,4,4]]});
    assert.ok( !grid.cellsAvailable(), "Full grid has no available cells" );
});

QUnit.test( "cellContent() method", function(assert){
    var grid = new Grid({size: 3, cells:[[],[2],[4]]});
    assert.equal( typeof(grid.withinBounds), "function", "withinBounds method exists" );
    assert.equal( grid.withinBounds({x:0,y:0}), true, "(0,0) is within bounds");
    assert.equal( grid.withinBounds({x:2,y:2}), true, "(2,1) is within bounds");
    assert.equal( grid.withinBounds({x:4,y:0}), false, "(4,0) is out of bounds");
    assert.equal( grid.withinBounds({x:1,y:3}), false, "(1,3) is out of bounds");

    assert.equal( typeof(grid.cellContent), "function", "cellContent method exists" );
    assert.equal( grid.cellContent({x:0,y:0}), null, "Empty cell contains null");
    assert.equal( grid.cellContent({x:4,y:0}), null, "Out of bounds cell contains null");
    assert.equal( grid.cellContent({x:1,y:0}), 2, "Returns cell content");

    assert.equal( typeof(grid.cellOccupied), "function", "cellOccupied method exists" );
    assert.equal( grid.cellOccupied({x:0,y:0}), false, "Empty cell is not occupied");
    assert.equal( grid.cellOccupied({x:1,y:0}), true, "Non-empty cell is occupied");

    assert.equal( typeof(grid.cellAvailable), "function", "cellAvailable method exists" );
    assert.equal( grid.cellAvailable({x:0,y:0}), true, "Empty cell is available");
    assert.equal( grid.cellAvailable({x:1,y:0}), false, "Non-empty cell is available");
});

QUnit.test( "Add / remove tiles", function(assert) {
    var grid = new Grid({size: 3}), tile = {x:0,y:1};

    assert.equal( typeof(grid.insertTile), "function", "insertTile method exists" );
    grid.insertTile(tile);
    assert.equal( grid.cell(0,1), tile, "tile is inserted in the correct position");

    assert.equal( typeof(grid.removeTile), "function", "removeTile method exists" );
    grid.removeTile(tile);
    assert.equal( grid.cell(0,1), null, "tile is removed from grid");
});
/*
// Move a tile and its representation
Grid.prototype.moveTile = function (tile, cell) {
    this.cells[tile.x][tile.y] = null;
    this.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
};


Grid.prototype.vectors = {
    0: { x: 0,  y: -1 }, // up
    1: { x: 1,  y: 0 },  // right
    2: { x: 0,  y: 1 },  // down
    3: { x: -1, y: 0 }   // left
}

// Get the vector representing the chosen direction
Grid.prototype.getVector = function (direction) {
    // Vectors representing tile movement
    return this.vectors[direction];
};

// Move tiles on the grid in the specified direction
// returns true if move was successful
Grid.prototype.move = function (direction) {
    // 0: up, 1: right, 2:down, 3: left
    var self = this;

    var cell, tile;

    var vector     = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var moved      = false;
    var score      = 0;
    var won        = false;

    // Save the current tile positions and remove merger information
    this.prepareTiles();

    // Traverse the grid in the right direction and move tiles
    traversals.x.forEach(function (x) {
        traversals.y.forEach(function (y) {
            cell = self.indexes[x][y];
            tile = self.cellContent(cell);

            if (tile) {

                var positions = self.findFarthestPosition(cell, vector);
                var next      = self.cellContent(positions.next);

                // Only one merger per row traversal?
                if (next && next.value === tile.value && !next.mergedFrom) {
                    var merged = new Tile(positions.next, tile.value * 2);
                    merged.mergedFrom = [tile, next];

                    self.insertTile(merged);
                    self.removeTile(tile);

                    // Converge the two tiles' positions
                    tile.updatePosition(positions.next);

                    // Update the score
                    score += merged.value;

                    // The mighty 2048 tile
                    if (merged.value === 2048) {
                        won = true;
                    }
                } else {
                    //if (debug) {
                    //console.log(cell);
                    //console.log(tile);
                    //}
                    self.moveTile(tile, positions.farthest);
                }

                if (!self.positionsEqual(cell, tile)) {
                    self.playerTurn = false;
                    //console.log('setting player turn to ', self.playerTurn);
                    moved = true; // The tile moved from its original cell!
                }
            }
        });
    });

    return {moved: moved, score: score, won: won};
};

Grid.prototype.computerMove = function() {
    this.addRandomTile();
    this.playerTurn = true;
}

// Build a list of positions to traverse in the right order
Grid.prototype.buildTraversals = function (vector) {
    var traversals = { x: [], y: [] };

    for (var pos = 0; pos < this.size; pos++) {
        traversals.x.push(pos);
        traversals.y.push(pos);
    }

    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();

    return traversals;
};

Grid.prototype.findFarthestPosition = function (cell, vector) {
    var previous;

    // Progress towards the vector direction until an obstacle is found
    do {
        previous = cell;
        cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.withinBounds(cell) &&
        this.cellAvailable(cell));

    return {
        farthest: previous,
        next: cell // Used to check if a merge is required
    };
};

Grid.prototype.movesAvailable = function () {
    return this.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
// returns the number of matches
Grid.prototype.tileMatchesAvailable = function () {
    var self = this;

    //var matches = 0;

    var tile;

    for (var x = 0; x < this.size; x++) {
        for (var y = 0; y < this.size; y++) {
            tile = this.cellContent({ x: x, y: y });

            if (tile) {
                for (var direction = 0; direction < 4; direction++) {
                    var vector = self.getVector(direction);
                    var cell   = { x: x + vector.x, y: y + vector.y };

                    var other  = self.cellContent(cell);

                    if (other && other.value === tile.value) {
                        return true; //matches++; // These two tiles can be merged
                    }
                }
            }
        }
    }

    //console.log(matches);
    return false; //matches;
};

Grid.prototype.positionsEqual = function (first, second) {
    return first.x === second.x && first.y === second.y;
};

Grid.prototype.toString = function() {
    string = '';
    for (var i=0; i<4; i++) {
        for (var j=0; j<4; j++) {
            if (this.cells[j][i]) {
                string += this.cells[j][i].value + ' ';
            } else {
                string += '_ ';
            }
        }
        string += '\n';
    }
    return string;
}

// counts the number of isolated groups.
Grid.prototype.islands = function() {
    var self = this;
    var mark = function(x, y, value) {
        if (x >= 0 && x <= 3 && y >= 0 && y <= 3 &&
            self.cells[x][y] &&
            self.cells[x][y].value == value &&
            !self.cells[x][y].marked ) {
            self.cells[x][y].marked = true;

            for (direction in [0,1,2,3]) {
                var vector = self.getVector(direction);
                mark(x + vector.x, y + vector.y, value);
            }
        }
    }

    var islands = 0;

    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if (this.cells[x][y]) {
                this.cells[x][y].marked = false
            }
        }
    }
    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if (this.cells[x][y] &&
                !this.cells[x][y].marked) {
                islands++;
                mark({ x:x, y:y }, this.cells[x][y].value);
            }
        }
    }

    return islands;
}


// measures how smooth the grid is (as if the values of the pieces
// were interpreted as elevations). Sums of the pairwise difference
// between neighboring tiles (in log space, so it represents the
// number of merges that need to happen before they can merge).
// Note that the pieces can be distant
Grid.prototype.smoothness = function() {
    var smoothness = 0;
    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if ( this.cellOccupied( this.indexes[x][y] )) {
                var value = Math.log(this.cellContent( this.indexes[x][y] ).value) / Math.log(2);
                for (var direction=1; direction<=2; direction++) {
                    var vector = this.getVector(direction);
                    var targetCell = this.findFarthestPosition(this.indexes[x][y], vector).next;

                    if (this.cellOccupied(targetCell)) {
                        var target = this.cellContent(targetCell);
                        var targetValue = Math.log(target.value) / Math.log(2);
                        smoothness -= Math.abs(value - targetValue);
                    }
                }
            }
        }
    }
    return smoothness;
}

Grid.prototype.monotonicity = function() {
    var self = this;
    var marked = [];
    var queued = [];
    var highestValue = 0;
    var highestCell = {x:0, y:0};
    for (var x=0; x<4; x++) {
        marked.push([]);
        queued.push([]);
        for (var y=0; y<4; y++) {
            marked[x].push(false);
            queued[x].push(false);
            if (this.cells[x][y] &&
                this.cells[x][y].value > highestValue) {
                highestValue = this.cells[x][y].value;
                highestCell.x = x;
                highestCell.y = y;
            }
        }
    }

    increases = 0;
    cellQueue = [highestCell];
    queued[highestCell.x][highestCell.y] = true;
    markList = [highestCell];
    markAfter = 1; // only mark after all queued moves are done, as if searching in parallel

    var markAndScore = function(cell) {
        markList.push(cell);
        var value;
        if (self.cellOccupied(cell)) {
            value = Math.log(self.cellContent(cell).value) / Math.log(2);
        } else {
            value = 0;
        }
        for (direction in [0,1,2,3]) {
            var vector = self.getVector(direction);
            var target = { x: cell.x + vector.x, y: cell.y+vector.y }
            if (self.withinBounds(target) && !marked[target.x][target.y]) {
                if ( self.cellOccupied(target) ) {
                    targetValue = Math.log(self.cellContent(target).value ) / Math.log(2);
                    if ( targetValue > value ) {
                        //console.log(cell, value, target, targetValue);
                        increases += targetValue - value;
                    }
                }
                if (!queued[target.x][target.y]) {
                    cellQueue.push(target);
                    queued[target.x][target.y] = true;
                }
            }
        }
        if (markAfter == 0) {
            while (markList.length > 0) {
                var cel = markList.pop();
                marked[cel.x][cel.y] = true;
            }
            markAfter = cellQueue.length;
        }
    }

    while (cellQueue.length > 0) {
        markAfter--;
        markAndScore(cellQueue.shift())
    }

    return -increases;
}

// measures how monotonic the grid is. This means the values of the tiles are strictly increasing
// or decreasing in both the left/right and up/down directions
Grid.prototype.monotonicity2 = function() {
    // scores for all four directions
    var totals = [0, 0, 0, 0];

    // up/down direction
    for (var x=0; x<4; x++) {
        var current = 0;
        var next = current+1;
        while ( next<4 ) {
            while ( next<4 && !this.cellOccupied( this.indexes[x][next] )) {
                next++;
            }
            if (next>=4) { next--; }
            var currentValue = this.cellOccupied({x:x, y:current}) ?
                Math.log(this.cellContent( this.indexes[x][current] ).value) / Math.log(2) :
                0;
            var nextValue = this.cellOccupied({x:x, y:next}) ?
                Math.log(this.cellContent( this.indexes[x][next] ).value) / Math.log(2) :
                0;
            if (currentValue > nextValue) {
                totals[0] += nextValue - currentValue;
            } else if (nextValue > currentValue) {
                totals[1] += currentValue - nextValue;
            }
            current = next;
            next++;
        }
    }

    // left/right direction
    for (var y=0; y<4; y++) {
        var current = 0;
        var next = current+1;
        while ( next<4 ) {
            while ( next<4 && !this.cellOccupied( this.indexes[next][y] )) {
                next++;
            }
            if (next>=4) { next--; }
            var currentValue = this.cellOccupied({x:current, y:y}) ?
                Math.log(this.cellContent( this.indexes[current][y] ).value) / Math.log(2) :
                0;
            var nextValue = this.cellOccupied({x:next, y:y}) ?
                Math.log(this.cellContent( this.indexes[next][y] ).value) / Math.log(2) :
                0;
            if (currentValue > nextValue) {
                totals[2] += nextValue - currentValue;
            } else if (nextValue > currentValue) {
                totals[3] += currentValue - nextValue;
            }
            current = next;
            next++;
        }
    }

    return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
}

Grid.prototype.maxValue = function() {
    var max = 0;
    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if (this.cellOccupied(this.indexes[x][y])) {
                var value = this.cellContent(this.indexes[x][y]).value;
                if (value > max) {
                    max = value;
                }
            }
        }
    }

    return Math.log(max) / Math.log(2);
}

// WIP. trying to favor top-heavy distributions (force consolidation of higher value tiles)
/*
 Grid.prototype.valueSum = function() {
 var valueCount = [];
 for (var i=0; i<11; i++) {
 valueCount.push(0);
 }

 for (var x=0; x<4; x++) {
 for (var y=0; y<4; y++) {
 if (this.cellOccupied(this.indexes[x][y])) {
 valueCount[Math.log(this.cellContent(this.indexes[x][y]).value) / Math.log(2)]++;
 }
 }
 }

 var sum = 0;
 for (var i=1; i<11; i++) {
 sum += valueCount[i] * Math.pow(2, i) + i;
 }

 return sum;
 }
///

// check for win
Grid.prototype.isWin = function() {
    var self = this;
    for (var x=0; x<4; x++) {
        for (var y=0; y<4; y++) {
            if (self.cellOccupied(this.indexes[x][y])) {
                if (self.cellContent(this.indexes[x][y]).value == 2048) {
                    return true;
                }
            }
        }
    }
    return false;
}

//Grid.prototype.zobristTable = {}
//for
//Grid.prototype.hash = function() {
//}
*/