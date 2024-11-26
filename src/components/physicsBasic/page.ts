import * as THREE from "three";
import Utils from "../Utils/index";

import * as CANNON from "cannon-es";

interface Page {
  init: (canvas: HTMLCanvasElement) => void;
  numbers: {
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
    aspectRatio: number | undefined;
    pixelRatio: number;
    oldElapsedTime: number;
    position: {
      x: number | undefined;
      y: number | undefined;
      z: number | undefined;
    };
  };
  clock: THREE.Clock;
  scene: THREE.Scene;
  o: {
    three: {
      floor: THREE.Mesh | undefined;
      // sphere: THREE.Mesh | undefined;
    };
    physics: {
      world: CANNON.World | undefined;
      material: CANNON.Material | undefined;
      // sphereBody: CANNON.Body | undefined;
    };
  };
  objectToUpdate: {
    mesh: THREE.Mesh;
    body: CANNON.Body;
  }[];
  sphereGeometry: THREE.SphereGeometry;
  sphereMaterial: THREE.MeshBasicMaterial;
  boxGeometry: THREE.BoxGeometry;
  boxMaterial: THREE.MeshBasicMaterial;
}

const page: Page = {
  init,
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    aspectRatio: undefined,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    oldElapsedTime: 0,
    position: {
      x: undefined,
      y: undefined,
      z: undefined,
    },
  },
  clock: new THREE.Clock(),
  scene: new THREE.Scene(),
  o: {
    three: {
      floor: undefined,
      // sphere: undefined,
    },
    physics: {
      world: undefined,
      material: undefined,
      // sphereBody: undefined,
    },
  },
  objectToUpdate: [],
  sphereGeometry: new THREE.SphereGeometry(1, 20, 20),
  sphereMaterial: new THREE.MeshBasicMaterial(),
  boxGeometry: new THREE.BoxGeometry(1, 1, 1, 10, 10),
  boxMaterial: new THREE.MeshBasicMaterial(),
};

function init(canvas: HTMLCanvasElement) {
  console.log("page init");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  page.numbers.canvasWidth = width;
  page.numbers.canvasHeight = height;
  page.numbers.aspectRatio = width / height;

  const camera = new THREE.PerspectiveCamera(
    75,
    page.numbers.aspectRatio,
    0.1,
    1000,
  );
  camera.position.set(-5, 4, 8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(page.numbers.canvasWidth, page.numbers.canvasHeight);

  _physicsWorld();
  _createMesh();

  _createSphere(0.5, { x: 0, y: 3, z: 0 });

  _tick(renderer, page.scene, camera);

  Utils.setupOrbitControl(camera, canvas);

  _debug();
}

function _tick(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  window.requestAnimationFrame(() => _tick(renderer, scene, camera));

  const elapsedTime = page.clock.getElapsedTime();
  const deltaTime = elapsedTime - page.numbers.oldElapsedTime;
  page.numbers.oldElapsedTime = elapsedTime;

  // page.o.physics.sphereBody?.applyForce(
  //   new CANNON.Vec3(-0.5, 0, 0),
  //   page.o.physics.sphereBody.position,
  // );
  page.o.physics.world?.step(1 / 60, deltaTime, 3);

  // page.o.three.sphere?.position.copy(page.o.physics.sphereBody!.position);

  for (const object of page.objectToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  renderer.render(scene, camera);
}

function _physicsWorld() {
  //world
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0); //地球の重力

  //materials
  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7,
    },
  );
  world.addContactMaterial(defaultContactMaterial);
  world.defaultContactMaterial = defaultContactMaterial;

  // //Sphere
  // const sphereShape = new CANNON.Sphere(0.5);
  // const sphereBody = new CANNON.Body({
  //   mass: 1,
  //   position: new CANNON.Vec3(0, 3, 0),
  //   shape: sphereShape,
  // });
  // sphereBody.applyLocalForce(
  //   new CANNON.Vec3(150, 0, 0),
  //   new CANNON.Vec3(0, 0, 0),
  // );
  // world.addBody(sphereBody);

  //floor
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body();
  floorBody.mass = 0;
  floorBody.addShape(floorShape);
  world.addBody(floorBody);
  floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5,
  );

  page.o.physics.world = world;
  page.o.physics.material = defaultMaterial;
  // page.o.physics.sphereBody = sphereBody;
}

function _createMesh() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: 0xcccccc }),
  );
  floor.rotation.x = -Math.PI / 2;
  page.scene.add(floor);

  // const sphere = new THREE.Mesh(
  //   new THREE.SphereGeometry(0.5, 10),
  //   new THREE.MeshBasicMaterial({ wireframe: true }),
  // );
  // sphere.position.set(0, 0.5, 0);
  // page.scene.add(sphere);

  page.o.three.floor = floor;
  // page.o.three.sphere = sphere;
}

function _createSphere(
  radius: number,
  position: { x: number; y: number; z: number },
) {
  const mesh = new THREE.Mesh(page.sphereGeometry, page.sphereMaterial);
  mesh.scale.setScalar(radius);
  // mesh.scale.set(radius, radius, radius);
  mesh.position.copy(position);
  page.scene.add(mesh);

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(position.x, position.y, position.z),
    shape: shape,
    material: page.o.physics.material,
  });
  // body.position.copy(position);
  page.o.physics.world?.addBody(body);

  page.objectToUpdate.push({
    mesh: mesh,
    body: body,
  });
}

function _createBox(
  width: number,
  height: number,
  depth: number,
  position: { x: number; y: number; z: number },
) {
  const mesh = new THREE.Mesh(page.boxGeometry, page.boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.position.copy(position);
  page.scene.add(mesh);

  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5),
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(position.x, position.y, position.z),
    shape: shape,
    material: page.o.physics.material,
  });
  page.o.physics.world?.addBody(body);

  page.objectToUpdate.push({
    mesh: mesh,
    body: body,
  });
}

// debug
interface DebugObject {
  createSphere: () => void;
  createBox: () => void;
}

function _debug() {
  Utils.setupGUI();

  const debugObject: DebugObject = {
    createSphere: () => {
      _createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      });
    },

    createBox: () => {
      _createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      });
    },
  };

  Utils.gui?.add(debugObject, "createSphere");
  Utils.gui?.add(debugObject, "createBox");
}
export default page;
