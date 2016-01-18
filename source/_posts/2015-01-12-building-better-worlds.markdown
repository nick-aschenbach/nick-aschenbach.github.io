---
layout: post
title: "Building Better Worlds with Terragen 3"
date: 2015-01-12 21:13:04 -0800
comments: true
categories: terrain graphics
description: Using Terragen 3 to create photo-realistic looking 3D environments 
keywords: terragen proceedural worlds graphics games
---

For years I have been interested in modeling terrain. I wrote 2D and 3D fractal terrain generators for fun when I was in school. To help inspire a side project I am working on, I utilized an excellent rendering engine for natural environments and terrain called [Terragen 3](http://planetside.co.uk/products/terragen3) from Planetside Software. Here are a couple of screen shots from their [image gallery](http://planetside.co.uk/galleries/terragen-gallery):

[{% img /assets/2015-01-12-building-better-worlds/images/lake.jpg 300 auto %}](/assets/2015-01-12-building-better-worlds/images/lake.jpg)
[{% img /assets/2015-01-12-building-better-worlds/images/desert.jpg 300 auto %}](/assets/2015-01-12-building-better-worlds/images/desert.jpg)
[{% img /assets/2015-01-12-building-better-worlds/images/village.jpg 300 auto %}](/assets/2015-01-12-building-better-worlds/images/village.jpg)
[{% img /assets/2015-01-12-building-better-worlds/images/volcano.jpg 300 auto %}](/assets/2015-01-12-building-better-worlds/images/volcano.jpg)

<!-- more -->

I found the [free version](http://planetside.co.uk/products/download-tg3) fairly capable. There are some limitations over the pay version of the software that include restricting resolution, render detail and degree to which anti-aliasing is applied. However, what impressed me most is how easy it is to get started (user interface pictured below left).

When you load the program it creates a simple environment for you. To render this basic scene, click the `View->Render` menu. Click `Render` button and wait. On my Macbook Pro, the rendering took approximately 40 seconds (pictured below right). A shortcut for the Render command is ⌘R. There is a rough view in the upper right that shows an approximation of how the rendered scene will appear.

[{% img /assets/2015-01-12-building-better-worlds/images/ui.png 300 auto %}](/assets/2015-01-12-building-better-worlds/images/ui.png)
[{% img /assets/2015-01-12-building-better-worlds/images/basic.jpg 300 auto %}](/assets/2015-01-12-building-better-worlds/images/basic.jpg)

The node network displayed in the lower right part of the interface is a hierarchial display of the scene. This includes Renderers, Cameras and scene elements like clouds, terrain and shaders. Double clicking on the `Render 01` node in the `Renderers` pane brings up the properties (to change the resolution, etc). This is limited to a maximum of 1280x900 in the free version.

The same configuration page is also available via the `Renderers` button on the bar at the top of the window. Adding new elements is easy. For example, to add clouds to the scene click `Atmosphere` and then the `Add cloud layer` button. I find the 3D / Volumetric clouds to be more interesting than the 2D ones.

I spent some time following Vladimir Chopine's video tutorials on youtube. This was a good starting point for me:

{% youtube HnRFJ4Vptt8 %}

I followed along with a couple of videos and with some trial and error created this rendering:

[{% img left /assets/2015-01-12-building-better-worlds/images/mountain.jpg auto auto %}](/assets/2015-01-12-building-better-worlds/images/mountain.jpg)

Here is the Terragen 3 [file](/assets//2015-01-12-building-better-worlds/images/layered_colors3.tgd) I used to generate the above rendering. Mainly I focused on creating shaders for the elements in the scene (grass, snow, sand). I played with the atmospheric, lighting and cloud elements until I found something that I liked. The rendering took about 11 minutes to complete on my laptop.

Terragen supports import and export FBX, Wavefront OBJ, Lightwave LWO2 and their own native TGO format. It can also import and export heightfield / DEM formats including real geographical data from GeoTIFFs. This makes it easy to communicate with other modeling packages like Rhino, Maya, 3D Studio Max, Blender and Cinema 4D.
