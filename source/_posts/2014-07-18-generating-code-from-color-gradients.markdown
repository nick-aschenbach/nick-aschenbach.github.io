---
layout: post
title: "Generating Code from Images of Color Gradients"
date: 2014-07-18 19:27:15 -0700
comments: true
categories: graphics metaprogramming
description: Parsing images of color gradients to create code
keywords: graphics metaprogramming color images code
---
I needed to incorporate smooth color transitions into a few projects I worked on several months ago. I wrote a 3D virtual terrain generator and wanted to color areas based on altitude. Higher elevations should be colored white (mountains), medium elevations should be colored green (grass) and lower elevations should be colored blue (water). A second application for these transitions was a series of particle systems (see video below). Changing particle color as a function of age allows effects like fading to black before a particle is removed. We will come back to particle systems later with a small demo at the end of this post.

{% youtube -urfsS1OpYo %}

To achieve color transitions in my programs, I figured that raster images with color gradients could be used. Programs like Adobe Photoshop or [GIMP](http://www.gimp.org/) are excellent tools to use for this purpose. As an aside, I also enjoy using the ColorZilla [Ultimate CSS Gradient Editor](http://www.colorzilla.com/gradient-editor/) for web projects. The problem I faced was getting red, blue and green values at each pixel along the gradient into code. 

<!-- more -->

I found quite a few libraries that could read images. ImageMagick is a powerful set of tools that enable reading and writing over 100 image formats. It has interfaces for a [number of languages](http://www.imagemagick.org/script/api.php). However, I was looking for something light-weight and self contained. 

I found an easy-to-use gem called [Chunky PNG](https://github.com/wvanbergen/chunky_png) that allows developers to read and write PNG files. Here is a snippet of code that shows how to open and read a PNG file in Ruby:

{% codeblock lang:rb %}
image = ChunkyPNG::Image.from_file(filename)
(0..image.dimension.width - 1).each do |x|
  (0..image.dimension.height - 1).each do |y|
    r = ChunkyPNG::Color.r(image[x, y])
    g = ChunkyPNG::Color.g(image[x, y])
    b = ChunkyPNG::Color.b(image[x, y])
  end
end
{% endcodeblock %}

While this gem is written in 100% Ruby, there is a gem extension library that speeds up Chunky called [Oily PNG](https://github.com/wvanbergen/oily_png). It optimizes some operations like encoding and decoding PNG files using native C code.

By taking PNG files as input and generating Java code as output, I found that I could save a lot of time and be more flexible with changing color transitions than if I had typed out the code by hand. This is easy to do:

{% codeblock lang:rb %}
def parse_image(filename)
  str = "public static Color gradient[] = {\n"
  image = ChunkyPNG::Image.from_file(filename)
  (0..image.dimension.width - 1).each do |x|
    r = ChunkyPNG::Color.r(image[x, 0])
    g = ChunkyPNG::Color.g(image[x, 0])
    b = ChunkyPNG::Color.b(image[x, 0])

    str += "  new Color(#{r}, #{g}, #{b}),\n"
  end
  str += "};";
end
{% endcodeblock %}

I ended up generating about 40 images that I used in conjuncton with a small color gradient manager library in Java. The source code and generator are available on [Github](https://github.com/nick-aschenbach/code-generated-color-gradients). This example shows its use:

{% codeblock lang:java %}
ColorGradientManager cgm = new ColorGradientManager();

// List all available color gradients
System.out.println(cmg.getAllGradients());

// Select a gradient
cgm.select("Land Sea");

// Get the colors
for (Color c : cgm.gradient()) {
  System.out.print(c + " ");
}
{% endcodeblock %}

I decided to modify the generator a little bit to output code for Javascript and used it for a simple particle system simulation (available on [Github](https://github.com/nick-aschenbach/particle-system-color-gradients)). The color gradients can be changed out dynamically via the drop down box.

<iframe src="/assets/2014-07-18-generating-code-from-color-gradients/index.html" width="300" height="300"></iframe>
