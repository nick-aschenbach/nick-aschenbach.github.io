---
layout: post
title: "Something to Show at the End of the Day"
date: 2014-07-26 09:43:50 -0700
comments: true
categories: CNC wood
---
Sometimes it is difficult as a software engineer to feel connected to our work product. At the end of the day, what can be demonstrated and communicated to others? It is a little easier when developing user interfaces as at least we have something we can show visually. A more cynical view is that all we did today is change some bits in a computer. This is why I like working with wood. I come up with an idea and am rewarded by seeing its physical instantiation.

{% img left /assets/2014-07-26-wood-boards-from-voronoi-diagrams/images/voronoi.png 300 auto Voronoi Diagram %}

I find that projects that engage both the analytical and creative parts of my brain are especially fun. Last summer I started making some custom wooden parts based on Voronoi Diagrams (at left).

First, a number of seed points are generated. Then the space is divided into Voronoi regions, which are sets of points closest to a seed point than any other. Typically, each region has a randomly generated color. The black dots in the image indicate the location of the seed points.

First, we will create a small helper class that will encapsulate a point's position and help us calculate the distance to a given pixel. 

<!-- more -->

{% codeblock lang:rb %}
class Point
  attr_reader :x, :y
  def initialize(x, y)
    @x = x
    @y = y
  end

  def distanceTo(x, y)
    deltaX = (x - @x).abs
    deltaY = (y - @y).abs
    Math.sqrt(deltaX ** 2 + deltaY ** 2) # Euclidean distance
    # deltaX + deltaY # Manhattan distance
  end

  def self.random(max_x, max_y)
    Point.new(Random.rand(max_x), Random.rand(max_y))
  end
end
{% endcodeblock %}

I've added a class factory method that returns new random Points. This will help us later when we generate seed points.

Let's take a look at the main part of the Voronoi Diagram generation algorithm:

{% codeblock lang:rb %}
require 'chunky_png'
require_relative 'point'

# Image size and voronoi seed sites
width = 512
height = 512
sites = 20

# Create seed points and associated colors
seed_points = sites.times.map { Point.random(width, height) }
seed_region_colors = sites.times.map { ChunkyPNG::Color.rgb(Random.rand(256), Random.rand(256), Random.rand(256)) }

# Initialize a new image
png = ChunkyPNG::Image.new(width, height, ChunkyPNG::Color::TRANSPARENT)

# Iterate over all pixels in the image
(0...width).each do |x|
  (0...height).each do |y|
    closest_index = -1
    closest_distance = width * height + 1
    # Determine the closest seed point
    seed_points.each_with_index do |point, index|
      distance = point.distanceTo(x, y)
      if distance < closest_distance
        closest_distance = distance
        closest_index = index
      end
    end
    png[x, y] = seed_region_colors[closest_index]
  end
end

# Show seed points
seed_points.each do |point|
  png.circle(point.x, point.y, 2, ChunkyPNG::Color::BLACK, ChunkyPNG::Color::BLACK)
end
{% endcodeblock %}

The `width`, `height` and `sites` are parameters to the Voronoi diagram. They determine the width and height of the image as well as the number of seed points.

It should be noted that this code is particularly inefficient; it is written more for clarity than for speed. Several efficient algorithms exist. One of the best known is [Fortune's algorithm](http://en.wikipedia.org/wiki/Fortune%27s_algorithm) and runs in O(n log n) time. Several open source implementations are available online.

We use [Chunky PNG](https://github.com/wvanbergen/chunky_png) to help us create the PNG output file.

<strong>Fabricated Wooden Boards</strong>

{% img right /assets/2014-07-26-wood-boards-from-voronoi-diagrams/images/wall-hanging.jpg Voronoi Wall Hanging %}
The first wall art piece is fabricated from 1/2" thick cherry and paduak

Vector files are required to import designs into my CAD / CAM software. I used Raymond Hill's [Javascript Voronoi](https://github.com/gorhill/Javascript-Voronoi) library, [Raphaël](http://raphaeljs.com) and [Raphaël Export](https://github.com/ElbertF/Raphael.Export) to generate SVG files. Two software tools were used to massage the geometry into something that could be machined: Autodesk's [AutoCAD](http://www.autodesk.com/products/autocad/)&reg; and Vectric's [Aspire](http://www.vectric.com/products/aspire.html)&reg;. The parts had to be machined precisely on a CNC router so that they could be nested and glued together as portrayed in the images below.

{% img /assets/2014-07-26-wood-boards-from-voronoi-diagrams/images/cutting-board.jpg Voronoi Cutting Board %}
The second cutting board is fabricated from 1/2" thick cherry and carbonized bamboo plywood
