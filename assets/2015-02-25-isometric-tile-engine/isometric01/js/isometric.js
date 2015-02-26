// A simple isometric tile renderer
var Isometric = {
  tileColumnOffset: 64, // pixels
  tileRowOffset: 32, // pixels

  originX: 0, // offset from left
  originY: 0, // offset from top

  Xtiles: 10,
  Ytiles: 10,

  context: undefined,
  canvas: undefined,

  load: function() {
    this.canvas = $('#isocanvas');
    this.context = this.canvas[0].getContext("2d");

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
    for(var Xi = 0; Xi < this.Xtiles; Xi++) {
      for(var Yi = 0; Yi < this.Ytiles; Yi++) {
        var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
        var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;

        // Draw tile outline
        var color = '#999';
        this.drawLine(offX, offY + this.tileRowOffset / 2, offX + this.tileColumnOffset / 2, offY, color);
        this.drawLine(offX + this.tileColumnOffset / 2, offY, offX + this.tileColumnOffset, offY + this.tileRowOffset / 2, color);
        this.drawLine(offX + this.tileColumnOffset, offY + this.tileRowOffset / 2, offX + this.tileColumnOffset / 2, offY + this.tileRowOffset, color);
        this.drawLine(offX + this.tileColumnOffset / 2, offY + this.tileRowOffset, offX, offY + this.tileRowOffset / 2, color);
      }
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
  }
};