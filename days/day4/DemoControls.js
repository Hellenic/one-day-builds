/**
 * Based on DeviceOrientationControls.js on Three.js examples
 */

const ZEE = new THREE.Vector3(0, 0, 1);
const Q0 = new THREE.Quaternion();
const Q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis
const ALPHA_OFFSET = THREE.Math.degToRad(-90); // radians

export default class DemoControls {
  constructor(object) {
    this.object = object;

    this.object.rotation.reorder('YXZ');

    this.enabled = true;
    this.deviceOrientation = null;
    this.screenOrientation = window.orientation || 0;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('orientationchange', () => {
      this.screenOrientation = window.orientation || 0;
    });
    window.addEventListener('deviceorientation', event => {
      if (event.alpha && event.beta && event.gamma) {
        this.deviceOrientation = event;
      }
    });

    // TODO This method is not consistent with the rest
    window.addEventListener('mousemove', event => {
      const screenWidthHalf = window.innerWidth / 2;
      const screenHeightHalf = window.innerHeight / 2;
      const x = (event.x - screenWidthHalf) / screenWidthHalf;
      const y = (event.y - screenHeightHalf) / screenHeightHalf;

      const axis = new THREE.Vector3(-y, -x, 0.0);
      this.object.quaternion.setFromAxisAngle(axis, 1.0);
    });
  }

  update() {
    if (this.enabled === false) {
      return;
    }

    const device = this.deviceOrientation;
    if (!device) {
      return;
    }

    const degToRad = THREE.Math.degToRad;

    // Calculate & normalize the orientation
    var alpha = device.alpha ? degToRad(device.alpha) + ALPHA_OFFSET : 0; // Z
    var beta = device.beta ? degToRad(device.beta) : 0; // X'
    var gamma = device.gamma ? degToRad(device.gamma) : 0; // Y''
    var orient = this.screenOrientation ? degToRad(this.screenOrientation) : 0; // O

    // Set object quaternion to orientation
    const euler = new THREE.Euler();
    euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

    const { quaternion } = this.object;
    quaternion.setFromEuler(euler); // orient the device
    quaternion.multiply(Q1); // camera looks out the back of the device, not the top
    quaternion.multiply(Q0.setFromAxisAngle(ZEE, -orient)); // adjust for screen orientation
  }
}
