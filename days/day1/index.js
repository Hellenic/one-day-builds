const scene = new THREE.Scene();
scene.background = new THREE.Color().setHSL(0.0, 0.1, 0.1);
scene.fog = new THREE.Fog(scene.background, 1, 1000);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const LEVEL_LENGTH = 10000;
const LEVEL_WIDTH = 10;

let MOVEMENT = 0;
let PAUSED = false;
let SPEED = 0.1;
const OBSTACLES = [];

const bindKeyboard = () => {
  window.addEventListener('deviceorientation', e => {
    const threshhold = 25;
    if (e.gamma < -threshhold) {
      MOVEMENT = -1;
    } else if (e.gamma > threshhold) {
      MOVEMENT = 1;
    } else {
      MOVEMENT = 0;
    }
  });
  window.addEventListener('orientationchange', function(e) {
    PAUSED = true;
  });
  window.addEventListener('touchend', e => {
    PAUSED = !PAUSED;
  });
  window.addEventListener('keydown', e => {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      MOVEMENT = -1;
    }
    if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      MOVEMENT = 1;
    }
  });
  window.addEventListener('keyup', e => {
    MOVEMENT = 0;
    if (e.code === 'Space') {
      PAUSED = !PAUSED;
    }
  });
};

const Level = () => {
  var geometry = new THREE.BoxGeometry(LEVEL_WIDTH, 0.5, LEVEL_LENGTH);
  var material = new THREE.MeshPhongMaterial({
    color: 0x006611,
    specular: 0x050505
  });
  return new THREE.Mesh(geometry, material);
};

const createLevel = () => {
  const ground = Level();
  const geometry = new THREE.BoxGeometry(2, 4, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0x332211,
    specular: 0x050505
  });
  const group = new THREE.Group();
  group.add(ground);

  const offset = 15;
  const obstacleCount = LEVEL_LENGTH / offset;
  for (var i = 1; i <= obstacleCount; i++) {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.z = LEVEL_LENGTH / 2 - offset * i;
    mesh.position.x = Math.random() * LEVEL_WIDTH - LEVEL_WIDTH / 2;

    OBSTACLES.push(mesh);
    group.add(mesh);
  }

  return group;
};
9;
const Ship = () => {
  var geometry = new THREE.BoxGeometry(1.5, 0.4, 3);
  var material = new THREE.MeshPhongMaterial({
    color: 0x220044,
    specular: 0x050505
  });
  return new THREE.Mesh(geometry, material);
};

const AmbientLight = () => {
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);
  return hemiLight;
};

const Light = () => {
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(30);

  return dirLight;
};

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const level = createLevel();
scene.add(level);
const ship = Ship();
scene.add(ship);
scene.add(AmbientLight());
scene.add(Light());
bindKeyboard();

const resetPositions = (level, ship) => {
  ship.position.y = 0.5;
  ship.position.z = -1.5;

  level.position.z = -LEVEL_LENGTH / 2;
};
resetPositions(level, ship);

camera.position.z = 5;
camera.position.y = 3.5;
camera.rotation.x = -0.15;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const hasCollided = (object, obstacles) => {
  var originPoint = object.position.clone();
  for (var index = 0; index < object.geometry.vertices.length; index++) {
    var localVertex = object.geometry.vertices[index].clone();
    var globalVertex = localVertex.applyMatrix4(object.matrix);
    var directionVector = globalVertex.sub(object.position);

    var ray = new THREE.Raycaster(
      originPoint,
      directionVector.clone().normalize()
    );
    const collisionResults = ray.intersectObjects(obstacles);
    const hasCollided =
      collisionResults.length > 0 &&
      collisionResults[0].distance < directionVector.length();
    if (hasCollided) {
      return true;
    }
  }
  return false;
};

setInterval(() => {
  if (PAUSED === false) {
    SPEED += 0.1;
  }
}, 15000);

const reset = () => {
  MOVEMENT = 0;
  PAUSED = true;
  SPEED = 0.1;
  resetPositions(level, ship);
};
function animate() {
  if (PAUSED === false) {
    level.position.z += SPEED;

    const hasCollision = hasCollided(ship, OBSTACLES);
    if (hasCollision) {
      reset();
    }

    if (MOVEMENT !== 0) {
      const MAX_X = LEVEL_WIDTH / 2 - 0.5;
      ship.position.x += MOVEMENT / 10;
      ship.position.x = clamp(ship.position.x, -MAX_X, MAX_X);
    }

    if (level.position.z > LEVEL_LENGTH / 2) {
      reset();
      alert('Congrats, you made it through!');
    }
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
