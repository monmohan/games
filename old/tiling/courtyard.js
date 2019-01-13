function Table(r, c, d) {
    this.numRows = r;
    this.numColumns = c;
    this.htmlFrag = "<TABLE border='1' id='tilingquad'>";
    this.data = d;


}


Table.TOP_LEFT = 1;
Table.BOT_LEFT = 2;
Table.TOP_RIGHT = 3;
Table.BOT_RIGHT = 4;


function Quad(rowFrom, rowTo, colFrom, colTo, shapeType) {
    this.rowFrom = rowFrom;
    this.colFrom = colFrom;
    this.rowTo = rowTo;
    this.colTo = colTo;
    this.shapeType = shapeType;


}

var dummy1 = new Quad();


function buildTable(numRow) {
    //console.log(numRow, this.numColumns);
    if (numRow == (this.numRows)) {
        return;
    }
    this.htmlFrag += "<tr>";

    for (var count = 0; count < this.numColumns; count++) {
        this.htmlFrag += "<td id='td" + numRow + count + "'>";
        this.htmlFrag += this.data[numRow][count];
        this.htmlFrag += "</td>";
    }

    this.htmlFrag += "</tr>";

    this.buildTable(++numRow, this.numColumns);

}

function render(targetDiv) {

    this.buildTable(0);

    this.htmlFrag += "</TABLE>";

   // console.log("Showing table HTML");

  //  console.log(this.htmlFrag);
    targetDiv.innerHTML = this.htmlFrag;
    var tlq = document.getElementById('tilingquad');
    //tlq.addEventListener('click', handleClick, false);
}

function handleClick(event) {

    event.target.className = "bgred";
}
function paintCell() {
    
    var args = paintCell.arguments;
    for (var i = 0; i < args.length; i += 2) {
        var tdId = "td" + args[i] + args[i + 1];
        //alert("painting " + tdId);
        var tdHandle=document.getElementById(tdId);
        var docClass=tdHandle.className;
         if (docClass== "bgblack"){
          //do nothing
             var foo;
             //alert("Not painting the single tile");
         }else{

              tdHandle.className="bgred";
         }

    }

    alert("Placed L-Shaped Tile..Keep pressing OK to place more..")

}

function placeSingleTile(row, col) {
    this.singleTileRow = row;
    this.singleTileColumn = col;
    var tdId = "td" + row + col;
    //alert("painting " + tdId);
    document.getElementById(tdId).className = "bgblack";

}

function tile(q) {

    //paint the single tile quad
    //paint rest of the L-shaped quad

    if ((q.colTo - q.colFrom) == 1) {
        //paint the single tile quad, being lazy here can also check for single tile and ignore
        this.paintCell(q.rowFrom, q.colFrom, q.rowFrom, q.colTo, q.rowTo, q.colFrom,q.rowTo,q.colTo);

       return;
    }

    var midRow = Math.floor(q.rowFrom + (q.rowTo - q.rowFrom) / 2);
    var midCol = Math.floor(q.colFrom + (q.colTo - q.colFrom) / 2);
    var singleTileQuadType = Table.TOP_LEFT;
    var LShapedQuadType = Table.BOT_RIGHT;
    var singleTileQuad;
    var LShapedQuad;
    if (this.singleTileRow <= midRow) {
        singleTileQuadType = this.singleTileColumn <= midCol ? Table.TOP_LEFT : Table.TOP_RIGHT;
        LShapedQuadType = singleTileQuadType == Table.TOP_LEFT ? Table.BOT_RIGHT : Table.BOT_LEFT;
        if (singleTileQuadType == Table.TOP_LEFT) {
            singleTileQuad = new Quad(q.rowFrom, midRow, q.colFrom, midCol, singleTileQuadType);

        } else {
            singleTileQuad = new Quad(q.rowFrom, midRow, midCol+1, q.colTo, singleTileQuadType);

        }


    } else {
        singleTileQuadType = this.singleTileColumn <= midCol ? Table.BOT_LEFT : Table.BOT_RIGHT;
        LShapedQuadType = singleTileQuadType == Table.BOT_LEFT ? Table.TOP_RIGHT : Table.TOP_LEFT;
        if (singleTileQuadType == Table.BOT_LEFT) {
            singleTileQuad = new Quad(midRow+1, q.rowTo, q.colFrom, midCol, singleTileQuadType);

        } else {
            singleTileQuad = new Quad(midRow+1, q.rowTo, midCol+1, q.colTo, singleTileQuadType);
           
        }

    }
    LShapedQuad = new Quad(q.rowFrom, q.rowTo, q.colFrom,q.colTo, LShapedQuadType);
    this.tile(singleTileQuad);
   
    this.tileLShape(LShapedQuad);


}

function tileLShape(q) {
    if ((q.colTo - q.colFrom) == 1) {
        //paint it
        var type = q.shapeType;
        if (type == Table.TOP_LEFT) {
            this.paintCell(q.rowFrom, q.colFrom, q.rowFrom, q.colTo, q.rowTo, q.colFrom);
        }

        if (type == Table.BOT_LEFT) {
            this.paintCell(q.rowFrom, q.colFrom, q.rowTo, q.colTo, q.rowTo, q.colFrom);
        }

        if (type == Table.TOP_RIGHT) {
            this.paintCell(q.rowFrom, q.colFrom, q.rowFrom, q.colTo, q.rowTo, q.colTo);
        }

        if (type == Table.BOT_RIGHT) {
            this.paintCell(q.rowFrom, q.colTo, q.rowTo, q.colFrom, q.rowTo, q.colTo);
        }
        return;

    } else {
        //break it further
        var midRow = Math.floor(q.rowFrom + (q.rowTo - q.rowFrom) / 2);
        var midCol = Math.floor(q.colFrom + (q.colTo - q.colFrom) / 2);
        
            //create top left sub Quad
        var
        topLeft = new Quad(q.rowFrom, midRow, q.colFrom, midCol, Table.TOP_LEFT);

            //create bottom left sub quad
        var
        botLeft = new Quad(midRow + 1, q.rowTo, q.colFrom, midCol, Table.BOT_LEFT);

        var
        topRight = new Quad(q.rowFrom, midRow, midCol + 1, q.colTo, Table.TOP_RIGHT);


        var
        botRight = new Quad(midRow + 1, q.rowTo, midCol + 1, q.colTo, Table.BOT_RIGHT);

            //Calculate the central quad statistics
        var cenRowFrom = Math.floor((q.rowFrom + (midRow - q.rowFrom) / 2) + 1);
        var cenRowTo = Math.floor((midRow + (q.rowTo - midRow) / 2));
        var cenColFrom = Math.floor((q.colFrom + (midCol - q.colFrom) / 2) + 1);
        var cenColTo = Math.floor((midCol + (q.colTo - midCol) / 2));

        var
        central = new Quad(cenRowFrom, cenRowTo, cenColFrom, cenColTo, q.shapeType);


        if (q.shapeType == Table.TOP_LEFT) {
            this.tileLShape(topLeft);
            this.tileLShape(botLeft);
            this.tileLShape(topRight);
            this.tileLShape(central);

        }
        if (q.shapeType == Table.TOP_RIGHT) {
            this.tileLShape(topLeft);
            this.tileLShape(topRight);
            this.tileLShape(botRight);
            this.tileLShape(central);
        }
        if (q.shapeType == Table.BOT_LEFT) {
            this.tileLShape(topLeft);
            this.tileLShape(botLeft);
            this.tileLShape(botRight);
            this.tileLShape(central);

        }
        if (q.shapeType == Table.BOT_RIGHT) {
            this.tileLShape(topRight);
            this.tileLShape(botLeft);
            this.tileLShape(botRight);
            this.tileLShape(central);

        }


    }
}
//dummy object to initialize 
var dummy = new Table();

Table.prototype.render = render;
Table.prototype.buildTable = buildTable;
Table.prototype.paintCell = paintCell;
Table.prototype.tileLShape = tileLShape;
Table.prototype.placeSingleTile = placeSingleTile;
Table.prototype.tile = tile;





