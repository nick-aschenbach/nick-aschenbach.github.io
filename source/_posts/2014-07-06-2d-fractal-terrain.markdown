---
layout: post
title: "2D Fractal Terrain Generation"
date: 2014-07-06 08:26:04 -0700
comments: true
categories: graphics terrain
---
A while ago I discovered a simple algorithm to generate infinite fractal terrain. One application for this is to produce mountain-like backgrounds for 2D side-scrolling video games. 

{% img right /images/fractal-2d.png Evolution of a fractal mountain %}

This is called the midpoint displacement algorithm. It works by recursively breaking a line into smaller and smaller segments and at each step changing the Y-value up or down by a random amount. The amount of change is reduced by some amount at each step to produce a rough or smooth looking mountain scape.

The blue lines (pictured right) indicate the location and amount of displacement from the previous iteration. 

Here is an outline of the algorithm:

0. Find the midpoint for the line segment
0. Assign the midpoint to the average of the endpoints (L + R) / 2
0. Generate a random number between -1 to 1 and multiply by the displacement value. Add this to the midpoint value.
0. Recursively subdivide this line and reduce the displacement value by a fixed amount (a roughness parameter)
0. Repeat previous until fractal is sufficiently detailed

Note that the roughness parameter needs to greater than zero and less than one. Higher values result in rougher terrain and lower values result in smoother terrain. Typical values may range between 0.5 to 0.75 and depend on depth of recursion.

Also, note that you will have to determine what sufficiently detailed means. Arrays sized 2^N + 1 are typically used to represent terrain height values. A good stopping point is when all array indicies are populated with values.

Let's take a look at a Javascript implementation of the algorithm above. 

{% codeblock lang:js %}
function generateTerrain(leftIndex, rightIndex, displacement) {
  if((leftIndex + 1) == rightIndex) return;
  var midIndex = Math.floor((leftIndex + rightIndex) / 2);
  var change = (Math.random() * 2 - 1) * displacement;
  terrain_array[midIndex] = (terrain_array[leftIndex] + terrain_array[rightIndex]) / 2 + change;

  displacement = displacement * roughness;
  generateTerrain(leftIndex, midIndex, displacement);
  generateTerrain(midIndex, rightIndex, displacement);
}
{% endcodeblock %}

The if block on line two prevents infinite recursion. Also note, that we define a global array of floating point values called terrain_array. All values in the array are initialized to zero. We also defined a global variable for roughness.

Here is the code in action:

<canvas id="canvas"></canvas>

I added animation to show how easy it is to adapt this algorithm for side scrolling action. The code is available on <a href="https://github.com/nick-aschenbach/2d-fractal-terrain">github</a>.    

<script>
  var array_size = Math.pow(2, 9) + 1;
  var terrain_array = [];
  var roughness = 0.55;
  var initial_displacement = 50;
  var count = 0;

  $(function() {
    initializeArray();
    generateTerrain(0, array_size - 1, initial_displacement);
    drawTerrain();
  });

  function initializeArray() {
    for(var i = 0; i < array_size; i++) {
      terrain_array.push(0);
    }
  }

  function generateTerrain(leftIndex, rightIndex, displacement) {
    if((leftIndex + 1) == rightIndex) return;
    var midIndex = Math.floor((leftIndex + rightIndex) / 2);
    var change = (Math.random() * 2 - 1) * displacement;
    terrain_array[midIndex] = (terrain_array[leftIndex] + terrain_array[rightIndex]) / 2 + change;

    displacement = displacement * roughness;
    generateTerrain(leftIndex, midIndex, displacement);
    generateTerrain(midIndex, rightIndex, displacement);
  }

  function drawTerrain() {
    var canvas = $('#canvas');
    canvas.width(array_size);
    canvas.height(4 * initial_displacement);

    var context = canvas[0].getContext("2d");
    context.canvas.width  = canvas.width();
    context.canvas.height = canvas.height();

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width(), canvas.height());

    var gradient = context.createLinearGradient(0,0,0,initial_displacement * 4);
    gradient.addColorStop(0, "purple");
    gradient.addColorStop(1, "#333");
    context.strokeStyle = 'grey';
    context.fillStyle = gradient;
    context.beginPath();
    context.lineWidth = 0.5;
    context.moveTo(i, terrain_array[count % array_size] + 2 * initial_displacement);
    for(var i = 1; i < array_size; i++) {
      context.lineTo(i, terrain_array[(count + i) % array_size] + 2 * initial_displacement);
    }
    context.lineTo(i, 4 * initial_displacement);
    context.lineTo(0, 4 * initial_displacement);
    context.closePath();

    context.fill();
    context.stroke();

    count++;
    setTimeout(drawTerrain, 30);
  }
</script>
