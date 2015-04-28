var level = 0;
var object_list = [];

// Entry point
var init3D = function() {
  // Event handlers
  var mouse = {x: 0, y: 0}
  document.addEventListener('mousemove', function(event) {
    mouse.x = (event.clientX / window.innerWidth ) - 0.5
    mouse.y = (event.clientY / window.innerHeight) - 0.5
  }, false);

  $('#up-button').click(function() {
    level++;
    clean_up_scene(scene);
  });

  $('#down-button').click(function() {
    level--;
    clean_up_scene(scene);
  });

  // Define scene, camera and renderer
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  var renderer = new THREE.WebGLRenderer({antialias: true});

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Draw scene components
  draw_level(scene);
  draw_wireframes(scene);
  draw_lights(scene);

  // Render frames in a tight loop
  var render = function() {
    requestAnimationFrame(render);
    var delta = 0.1;

    camera.position.x += (mouse.x * 25 - camera.position.x) * (delta * 3);
    camera.position.y += (mouse.y * 25 - camera.position.y) * (delta * 3);
    camera.lookAt(scene.position)

    renderer.render(scene, camera);
  };

  render();
};

// Clean up the scene
var clean_up_scene = function(scene) {
  for (var i = 0; i < object_list.length; i++) {
    scene.remove(object_list[i]);
  }
  object_list.length = 0;

  if (level < 0) level = 0;
  if (level > 34) level = 34;

  draw_level(scene);
  $('#level-title').text('Level ' + (level + 1));
};

// Draw bricks (defined in levels.js)
var draw_level = function(scene) {
  for (var i = 0; i < 28; i++) {
    for (var j = 0; j < 11; j++) {
      var color_index = level_data[level][i][j];
      if (color_index == 0) continue;

      var shininess = 10;
      if (color_index >= 9) shininess = 50; // Gold and silver

      var material = new THREE.MeshPhongMaterial({
        color: color_data[color_index],
        specular: 0x232322,
        shininess: 50
      });
      var geometry = new THREE.BoxGeometry(2, 1, 0.5);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = 1.5;
      mesh.position.x += j * 2.2 - 12;
      mesh.position.y += i * -1.2 + 18;
      scene.add(mesh);
      object_list.push(mesh);
    }
  }
};

// Draw level bound box
var draw_wireframes = function(scene) {
  var material = new THREE.LineBasicMaterial({
    color: 0xcccccc
  });

  var wireframes = new THREE.Geometry();
  wireframes.vertices.push(new THREE.Vector3(-13.25, 18.75, 0));
  wireframes.vertices.push(new THREE.Vector3(11.25, 18.75, 0));
  wireframes.vertices.push(new THREE.Vector3(11.25, -15.5, 0));
  wireframes.vertices.push(new THREE.Vector3(-13.25, -15.5, 0));
  wireframes.vertices.push(new THREE.Vector3(-13.25, 18.75, 0));
  scene.add(new THREE.Line(wireframes, material));

  var wireframes = new THREE.Geometry();
  wireframes.vertices.push(new THREE.Vector3(-13.25, 18.75, 2));
  wireframes.vertices.push(new THREE.Vector3(11.25, 18.75, 2));
  wireframes.vertices.push(new THREE.Vector3(11.25, -15.5, 2));
  wireframes.vertices.push(new THREE.Vector3(-13.25, -15.5, 2));
  wireframes.vertices.push(new THREE.Vector3(-13.25, 18.75, 2));
  scene.add(new THREE.Line(wireframes, material));

  var wireframes = new THREE.Geometry();
  wireframes.vertices.push(new THREE.Vector3(-13.25, 18.75, 0));
  wireframes.vertices.push(new THREE.Vector3(-13.25, 18.75, 2));
  scene.add(new THREE.Line(wireframes, material));

  var wireframes = new THREE.Geometry();
  wireframes.vertices.push(new THREE.Vector3(11.25, 18.75, 0));
  wireframes.vertices.push(new THREE.Vector3(11.25, 18.75, 2));
  scene.add(new THREE.Line(wireframes, material));

  var wireframes = new THREE.Geometry();
  wireframes.vertices.push(new THREE.Vector3(11.25, -15.5, 0));
  wireframes.vertices.push(new THREE.Vector3(11.25, -15.5, 2));
  scene.add(new THREE.Line(wireframes, material));

  var wireframes = new THREE.Geometry();
  wireframes.vertices.push(new THREE.Vector3(-13.25, -15.5, 0));
  wireframes.vertices.push(new THREE.Vector3(-13.25, -15.5, 2));
  scene.add(new THREE.Line(wireframes, material));
};

// Put in the scene lights
var draw_lights = function(scene) {
  // For back lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));

  // Pointed at brick faces
  var light = new THREE.DirectionalLight(0xffffff, 0.35);
  light.position.set(0.5, 0.5, 5);
  scene.add(light);
};