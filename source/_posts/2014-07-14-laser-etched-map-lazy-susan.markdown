---
layout: post
title: "Maps, Lasers and Bamboo"
date: 2014-07-14 22:41:29 -0700
comments: true
categories: graphics terrain CNC wood
description: A project to create a lazy susan with a laser etch contour map of colorado
keywords: cnc wood laser etch fabrication colorado
---
{% img right /images/colorado-mountains.jpg Snowy view towards Devil's Thumb Ranch %}

I spent a week over the winter at 8,500 feet in the mountains at Old Sky Valley Ranch near Tabernash, Colorado. It is an inspiring place and I undertook a project with fellow GIS developer Nicholas Hallahan (https://github.com/hallahan/ http://www.spatialdev.com/#about) to craft a gift for one of the ranch families.

The project involved quite a bit of GIS modeling and graphic design work. The spatial data was obtained from a variety of sources including the USGS National Map Viewer (http://viewer.nationalmap.gov/viewer/) where we found the contour data. We also obtained some of the road, hydrology, and cadastral (building footprints) data from the Grand County, CO GIS Department (http://co.grand.co.us/170/Digital-Data-Sets). Much of the fine grained details of this data were missing, such as some of the less develped roads and the precision of bends of the rivers and streams. This was achieved by hand digitizing from satellite imagery features that were missing in OpenStreetMap and then importing that final product. This part was a lot of fun, and in turn we got a new feeling and perspective of the geography of the area.

<!-- more -->

{% img right /images/colorado-mid-scale.jpg 350 auto Mid scale map %}

Once all of the source data was gathered, we used ArcGIS to filter out unwanted features and narrow down the area of the data to the extent of the map we wanted to produce. The work was further cleaned up in Adobe Illustrator.

Although ArcGIS is well equipped to edit vector data, it focuses on this data in a geographic context, and we needed to specify details in the final, printable vector format. This is where Adobe Illustrator comes in. Here we were able to carefully specify line widths as well as place labels for these lines. The most important part of this process was separating different features into different layers that would be cut (burned) with different settings and intensities by the laser.

Computer Numerical Controlled (CNC) machine tools are robots that help automate the process of making custom parts. They typically involve the use of computer aided design (CAD) and computer aided manufacturing (CAM) software tools. The main benefit of CNC tools is both that they automate the manufacturing process and are precise. In recent years CNC machines have become much more affordable. For example, small CNC routers that can cut wood, plastics and light metals are commercially available for a few thousand dollars (USD).

Creating the lazy susan involved several steps that included both a CNC router and CNC laser. Carbonized 3/4" thick three-ply natural bamboo plywood sheet was selected due to its light color and durability. A 17" diameter circle was cut out on a CNC router. We used ADX Portland (http://www.adxportland.com) for their CNC laser service (they have an 18" x 24" table). We were able to index the part on the laser table by first cutting a 17" diameter disk in a thin piece of cardboard. We could then locate the same-sized bamboo disk into the hole we cut in the cardboard.

CNC lasers can be configured to cut in either a vector or raster mode. Vectors cutting is best for lines and arcs that are precisely (aka mathematically) defined. Raster cutting is better for laser engraving and is ideal for filled areas and photographs. Our project required both raster and vector cut modes. The raster mode was used to fill in the lakes and the interiors of the letters. The vector mode was used for the contour lines and letter outlines. 

Map details look best when line weights are taken into consideration. While the laser typically cuts lines the same thickness in vector mode, we found that we could cut wider lines by defocusing the laser. This was achieved by setting the Z-home position roughly 1/8" or 3/16" above the part instead of on the part. Without this hack, we would have needed to do the burning in a "raster" mode in which the machine burns in a pixel-based mannor similiar to what you would see with an ink jet printer. This would have taken a very long time, and we were charged by the minute.

To finish up the part we went back to the CNC router to pocket it out for the lazy susan mechanism. The 9" turntable was obtained from Tap Plastics (http://www.tapplastics.com/). While the pocket diameter was 9-1/16", the depth was slightly less than the height of the mechanism. This allows the turntable to support the bamboo piece up off of the table. Finally, mineral oil was used to finish the part and protect it. Mineral oil is both food safe, readily available (check your local drug store) and brings out color the natural bamboo.

{% img /images/lazy-susan-collage.jpg Finished lazy susan %}