// A simple isometric tile renderer
var Isometric = {
  tileColumnOffset: 64, // pixels
  tileRowOffset: 32, // pixels

  originX: 0, // offset from left
  originY: 0, // offset from top

  Xtiles: 10,
  Ytiles: 10,

  selectedTileX: -1,
  selectedTileY: -1,

  context: undefined,
  canvas: undefined,

  showCoordinates: true,

  load: function() {
    this.canvas = $('#isocanvas');
    this.context = this.canvas[0].getContext("2d");

    var self = this;
    $(window).on('resize', function(){
      self.updateCanvasSize();
      self.redrawTiles();
    });
    
    $(window).on('mousemove', function(e) {
      e.pageX = e.pageX - self.tileColumnOffset / 2 - self.originX;
      e.pageY = e.pageY - self.tileRowOffset / 2 - self.originY;
      tileX = Math.round(e.pageX / self.tileColumnOffset - e.pageY / self.tileRowOffset);
      tileY = Math.round(e.pageX / self.tileColumnOffset + e.pageY / self.tileRowOffset);

      self.selectedTileX = tileX;
      self.selectedTileY = tileY;
      self.redrawTiles();
    });

    $(window).on('click', function() {
      self.showCoordinates = !self.showCoordinates;
      self.redrawTiles();
    });

    this.updateCanvasSize();
    this.redrawTiles();
  },

  updateCanvasSize: function() {
    var width = $(window).width();
    var height = $(window).height();

    this.context.canvas.width  = width;
    this.context.canvas.height = height;

    this.originX = width / 2 - this.Xtiles * this.tileColumnOffset / 2;
    this.originY = height / 2;
  },

  redrawTiles: function() {
    for(var Xi = (this.Xtiles - 1); Xi >= 0; Xi--) {
      for(var Yi = 0; Yi < this.Ytiles; Yi++) {
        this.drawTile(Xi, Yi);
      }
    }
  },

  drawTile: function(Xi, Yi) {
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;

    // Draw tile interior
    if( Xi == this.selectedTileX && Yi == this.selectedTileY)
      this.context.fillStyle = 'yellow';
    else
      this.context.fillStyle = 'green';
    this.context.moveTo(offX, offY + this.tileRowOffset / 2);
    this.context.lineTo(offX + this.tileColumnOffset / 2, offY, offX + this.tileColumnOffset, offY + this.tileRowOffset / 2);
    this.context.lineTo(offX + this.tileColumnOffset, offY + this.tileRowOffset / 2, offX + this.tileColumnOffset / 2, offY + this.tileRowOffset);
    this.context.lineTo(offX + this.tileColumnOffset / 2, offY + this.tileRowOffset, offX, offY + this.tileRowOffset / 2);
    this.context.stroke();
    this.context.fill();
    this.context.closePath();

    // Draw tile outline
    var color = '#999';
    this.drawLine(offX, offY + this.tileRowOffset / 2, offX + this.tileColumnOffset / 2, offY, color);
    this.drawLine(offX + this.tileColumnOffset / 2, offY, offX + this.tileColumnOffset, offY + this.tileRowOffset / 2, color);
    this.drawLine(offX + this.tileColumnOffset, offY + this.tileRowOffset / 2, offX + this.tileColumnOffset / 2, offY + this.tileRowOffset, color);
    this.drawLine(offX + this.tileColumnOffset / 2, offY + this.tileRowOffset, offX, offY + this.tileRowOffset / 2, color);

    if(this.showCoordinates) {
      this.context.fillStyle = 'orange';
      this.context.fillText(Xi + ", " + Yi, offX + this.tileColumnOffset/2 - 9, offY + this.tileRowOffset/2 + 3);
    }
  },

  drawLine: function(x1, y1, x2, y2, color) {
    color = typeof color !== 'undefined' ? color : 'white';
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  },
};