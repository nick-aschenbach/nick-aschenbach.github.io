---
layout: post
title: "Simple Isometric Tiling"
date: 2015-02-25 22:40:30 -0800
comments: true
categories: graphics games terrain
---

In this post I share a few simple javascript examples of isometric tiling commonly used to create the illusion
of 3D graphics in games.

For years, side-scrolling video games use a projection where the camera is aligned along one of the axes. Many original
game titles like Tetris, Zelda, Super Mario Bros place the camera either above the player looking down along a
vertical axis or looking directly from the side. Basic techniques like shading and parallax scrolling (where foreground
images scroll faster than background images) help to provide a sense of depth.

{% img /assets/2015-02-25-isometric-tile-engine/images/mario.gif auto 300 %}

An [isometric projection](http://en.wikipedia.org/wiki/Isometric_projection) is a popular way of visualizing 3D objects
on a 2D screen. This involves rotating the camera 45 degrees to one side and then angling down roughly 30 degrees. This
approach is used in several role playing and strategy games (Sim City 2000 pictured below). Q*bert, released in 1982,
was perhaps one of the first games that used isometric graphics.

{% img /assets/2015-02-25-isometric-tile-engine/images/simcity.png auto 300 %}

<!-- more -->

**Drawing the Grid**

A common pattern is to use tiles that are two times wider than they are tall. Also, I find that lines with a slope of 2:1
(two pixels horizontally : one vertical) look better as pixel art. This ratio makes it relatively easy to calculate
the screen position of a tile and to find the position of the mouse over a tile.

Here is a simple example with 128x64 tiles on a HTML5 canvas:

<iframe src="/assets/2015-02-25-isometric-tile-engine/isometric01/index.html" width="100%" height="375"></iframe>

This snippet describes how to position the diamond / rhombus shapes in a grid
([full source](/assets/2015-02-25-isometric-tile-engine/isometric01/js/isometric.js)):

{% codeblock lang:js %}
tileColumnOffset: 64,
tileRowOffset: 32,

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
}
{% endcodeblock %}

When we use actual graphical tiles `redrawTiles`, the draw order will need to be changed so that tiles in the back
are rendered before ones in the front. Let's extend the work by adding colors, coordinates and some mouse listeners:

<iframe src="/assets/2015-02-25-isometric-tile-engine/isometric02/index.html" width="100%" height="375"></iframe>

Here is the salient code that handles canvas drawing
([full source](/assets/2015-02-25-isometric-tile-engine/isometric02/js/isometric.js)):

{% codeblock lang:js %}
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
{% endcodeblock %}

Determining the location of the mouse over a canvas tile (tileX, tileY) is determined by a few calculations in a
mouse move listener:

{% codeblock lang:js %}
$(window).on('mousemove', function(e) {
  e.pageX = e.pageX - self.tileColumnOffset / 2 - self.originX;
  e.pageY = e.pageY - self.tileRowOffset / 2 - self.originY;
  tileX = Math.round(e.pageX / self.tileColumnOffset - e.pageY / self.tileRowOffset);
  tileY = Math.round(e.pageX / self.tileColumnOffset + e.pageY / self.tileRowOffset);
{% endcodeblock %}

**Graphical Tiles**

[Open Game Art](http://opengameart.org/content/isometric-tiles) has over a hundred free tile sets worth investigating.
However, [Kenny.nl](http://www.kenney.nl/assets) provides a handful of professional looking isometric tile sets. The
quality is just excellent. He provides both individual isometric tiles and sprite sheets. XML metadata is also provided
that indicates tile location and size in the sprite sheets.

<iframe src="/assets/2015-02-25-isometric-tile-engine/isometric03/index.html" width="100%" height="400px"></iframe>

The code is very similar between the last two examples. A few small tweaks are needed to ensure that
tile height is consistent. Also, using tile sprite sheets would result in a performance enhancement due to the
fact that each image is loaded individually with the current implementation. However, the goal here was to keep things
as simple as possible.

The main Javascript files are:

- `isometric.js` which initializes the map and handles rendering and event handling
- `map.js` which stores a 2D array of map data and an array of image locations.

The source code and images for this are available on
[Github](https://github.com/nick-aschenbach/simple-isometric-tile-engine).

**Additional Resources**

- [Drawing Isometric Game Worlds](http://stackoverflow.com/questions/892811/drawing-isometric-game-worlds) has some
pointers on the math and layout.
- [Isometric Primer for Game Developers](http://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-a-primer-for-game-developers--gamedev-6511)
provides a good foundation and covers bounds detection, depth sorting and animation
- [Overviewer](https://github.com/overviewer/Minecraft-Overviewer), a tool for mapping Minecraft worlds using Google
Maps has excellent [design documentation](http://docs.overviewer.org/en/latest/design/designdoc/) that covers its
sprite rendering engine.