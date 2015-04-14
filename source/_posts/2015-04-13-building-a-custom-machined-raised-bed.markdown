---
layout: post
title: "Building a Custom Machined Raised Bed"
date: 2015-04-13 20:42:10 -0700
comments: true
categories: cnc wood gardening
---

Looking forward to sunshine and warmer temperatures, I decided to take on a project over the weekend to build
a small raised bed so we could try planting some peppers and herbs this spring. My wife asked that the bed be
around 18" tall. I went to work in my project notebook and came up with the following hand sketch:

{% img /assets/2015-04-13-building-a-custom-machined-raised-bed/hand-sketch.jpg auto auto %}

I wanted to use 4" x 4" posts for the corners and 2" x 6" boards for the walls of the planter box. There were a
couple of design elements that I wanted to incorporate. First, I wanted the 2" x 6" boards to be recessed into
the post. Also, I wanted to put a 45 degree chamfer on the top of each 4" x 4" for decoration. I decided
that the overall dimensions should be around 36" x 60" so I could maximize utilization of the 8 foot lengths
of the 2" x 6" stock board size.

**Materials**

<!-- more -->

I went to Home Depot to source the lumber. I found all of the boards to be quite wet as if they had just been brought
in from outside and tried to find boards that were relatively straight. Turning the boards vertically and looking down
the edge makes it easy to identify which ones were straighter.

The boards were cut to the following dimensions and quantities:


    1 @ 4" x 4" x 96" (around $9 / each) cut to 4 pieces @ 18" long
    6 @ 2" x 6" x 96" (around $8 / each) split into 6 pieces @ 36" long and 6 pieces @ 60" long


I asked that the sawyer cut the pieces the same size. I did not care that the pieces were exactly 36" or 60", but
it was important to me that they were all the same. The parts came out with about 0.125" of variation. A more
experienced sawyer using a stop on the saw, should be able to cut the parts to close tolerances.

{% img left /assets/2015-04-13-building-a-custom-machined-raised-bed/soil.jpg 300 auto %}

I also purchased potting soil, which is sold in 3 cubic foot bags at Home Depot. The soil should be
be a few inches below the 18" post. Here is how I calculated the amount of soil I needed for the project:

    16" x 36" x 60" = 34,560 in^3 / (1,728 in^3 / 1 foot^3)
    = 20 feet^3

The calculation suggested that about six or seven bags were needed. I decided to go for three bags of garden soil
($8.50 / each) and three bags of raised bed and potting mix ($10 / each). The garden soil would comprise the lower
layer and the raised bed mix would be on the top.

With the boards and soil in hand, I headed home for the next part of the project.

**Fabrication**

The key to putting a slot the 4" x 4" post would be to create a small fixture that would hold the part in place
during the machining process. My CNC router imparts several pounds of force into the work and it is important
that the work is held securely in place to ensure a good quality part. The 4" x 4" posts were about 3.625" square.
I came up with the following shop drawing:

{% img /assets/2015-04-13-building-a-custom-machined-raised-bed/drawing.png auto auto %}

I used a 23.5" x 11.25" scrap of plywood for the base of the fixture. I held this down using
my table's vacuum fixture and cut a trace of approximate size of the 4" x 4" x 18" board about 0.02" deep. The
critical dimension here is the 3.625" width. I fastened a 2" x 2" block right along the long edge of the trace and then
put an angle bracket along the end.

{% img /assets/2015-04-13-building-a-custom-machined-raised-bed/fixture.jpg auto auto %}

Finally I wrapped a 4" x 4" x 18" cut piece in paper and put it up against the two edges. The paper allows for about
0.01" extra spacing. Then I installed two final angle brackets ensuring a snug fit. It is important to be able
to move all of the 4" x 4"s in and out of the fixture. I tested each 4" x 4" and rotated each 90 degrees in the
tool.

I put two screws though the angle brackets into the work to hold it in place while the router was running. The
run time was about 10 minutes per pocket. This video shows the pocket being machining:
{% youtube b4Hyl-paMj4 %}

The next operation was to put a 0.25" x 45 degree chamfer on the top of each post. This operation was performed on
the manual router table:

{% img /assets/2015-04-13-building-a-custom-machined-raised-bed/chamfer.jpg auto auto %}

Finally, I needed to added some pilot holes and countersunk holes to make assembly easier. First I made marks at
5.5" and 11" inches. These are the approximate locations of the boards from the edge of the pocket (close to
the top of the post). Then I added marks roughly 2" on center. For one pocket I drilled through holes at 1" and 3"
from the top of each board. Then for the other pocket I drilled holes at 2" and 4" from the top of each board. This
ensured that the screws would not intersect in the middle of the post:

{% img /assets/2015-04-13-building-a-custom-machined-raised-bed/holes.jpg auto auto %}

The last operation was to reverse drill the pilot holes with a countersink bit on the drill press. I recessed the
countersink roughly 0.5" into the board to hide the 4" galvanized screws that I purchased. The
one pound box ($7.50) contained 50 screws and I needed 48 to do the job (12 boards x 4 fasteners per board):

{% img /assets/2015-04-13-building-a-custom-machined-raised-bed/countersink.jpg auto auto %}

**Assembly**

With the fabrication complete, I took all of the parts outside on the sidewalk. Assembly was a snap. I started by
turning the 4" x 4" posts upside down so the chamfered top was on the sidewalk. I put each 2" x 6" post into the slot,
tapped the 4" x 4" posts towards each other and then put in the 4" long screws. I fastened each board one at a
time, working my way up:

{% img /assets/2015-04-13-building-a-custom-machined-raised-bed/assembly.jpg auto auto %}

After about 20 minutes with the drill, the raised bed frame was complete. I flipped the assembly over and positioned
it next to the sidewalk. We put cardboard in the bottom of the box after reading good things about it. Finally, the
six bags of soil went into the box. After each bag we used the rake and a shovel to even things out.

{% img /assets/2015-04-13-building-a-custom-machined-raised-bed/installed.jpg auto auto %}