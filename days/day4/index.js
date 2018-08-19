import DemoControls from './DemoControls.js';
import MathUtils from './MathUtils.js';

const LEVEL_LENGTH = 10000;
const INITIAL_SPEED = 0.3;
let speed = INITIAL_SPEED;

const getRandomMesh = () => {
  const SPREAD = 30.0;
  const COLORS = [0x366873, 0x7a8d8f, 0xacc5de, 0x011526, 0xacc5de];

  const group = new THREE.Group();

  // Create some longer objects ('stripes')
  const STRIPE_COUNT = 400;
  for (var i = 0; i < STRIPE_COUNT; i++) {
    const geometry = new THREE.BoxGeometry(4.0, 1.0, 50.0);
    const material = new THREE.MeshPhongMaterial({
      color: COLORS[i % COLORS.length],
      flatShading: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = (Math.random() * (i * 100)) / 100;
    mesh.position.z = Math.random() * -LEVEL_LENGTH;
    mesh.position.x = Math.random() * SPREAD - SPREAD / 2;
    mesh.position.y = Math.random() * SPREAD - SPREAD / 2;

    group.add(mesh);
  }

  // Prepare some geometries and materials
  const geometries = [
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.TetrahedronGeometry(2, 0),
    new THREE.IcosahedronGeometry(2.5, 1)
  ];
  const materials = COLORS.map(
    color =>
      new THREE.MeshPhongMaterial({
        color,
        // specular: 0x050505,
        flatShading: true
      })
  );

  // Generate random stuff along the Z axis
  const MESH_COUNT = 1000;
  for (var i = 0; i < MESH_COUNT; i++) {
    const geometry = geometries[i % geometries.length];
    const material = materials[i % materials.length];
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.z = Math.random() * -LEVEL_LENGTH;
    mesh.position.x = Math.random() * SPREAD - SPREAD / 2;
    mesh.position.y = Math.random() * SPREAD - SPREAD / 2;

    group.add(mesh);
  }

  return group;
};

const getAmbientLight = () => {
  return new THREE.AmbientLight(0x999999);
};

const getLight = () => {
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(30);

  return dirLight;
};

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1.0, 1000);
const helper = new THREE.Object3D();
const controls = new DemoControls(helper);

scene.add(getRandomMesh());
scene.add(getAmbientLight());
scene.add(getLight());

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

setInterval(() => {
  speed += 0.1;
}, 15000);

const FOLLOW_DISTANCE = 30;

const reset = () => {
  speed = INITIAL_SPEED;

  camera.position.z = FOLLOW_DISTANCE;
  helper.position.z = 0;
};

function animate() {
  requestAnimationFrame(animate);

  // Move and rotate the helper
  controls.update();
  helper.position.z -= speed;

  // Have camera follow and look at the helper
  camera.position.copy(helper.position);
  camera.quaternion.copy(helper.quaternion);
  camera.translateZ(FOLLOW_DISTANCE);

  // Reset level when camera has moved far enough
  if (camera.position.z < -LEVEL_LENGTH) {
    reset();
  }

  renderer.render(scene, camera);
}

reset();
animate();
