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
  };
  clock: THREE.Clock;
  scene: THREE.Scene;
  o: {
    three: {
      floor: THREE.Mesh | undefined;
      sphere: THREE.Mesh | undefined;
    };
    physics: {
      world: CANNON.World | undefined;
      sphereBody: CANNON.Body | undefined;
    };
  };
}

const page: Page = {
  init,
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    aspectRatio: undefined,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    oldElapsedTime: 0,
  },
  clock: new THREE.Clock(),
  scene: new THREE.Scene(),
  o: {
    three: {
      floor: undefined,
      sphere: undefined,
    },
    physics: {
      world: undefined,
      sphereBody: undefined,
    },
  },
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
  camera.position.set(-5, 2, 10);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(page.numbers.canvasWidth, page.numbers.canvasHeight);

  _physicsWorld();
  _createMesh();
  _tick(renderer, page.scene, camera);

  Utils.setupOrbitControl(camera, canvas);
  Utils.setupGUI();
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

  page.o.physics.sphereBody?.applyForce(
    new CANNON.Vec3(-0.5, 0, 0),
    page.o.physics.sphereBody.position,
  );
  page.o.physics.world?.step(1 / 60, deltaTime, 3);

  page.o.three.sphere?.position.copy(page.o.physics.sphereBody!.position);

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

  //Sphere
  const sphereShape = new CANNON.Sphere(0.5);
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
  });
  sphereBody.applyLocalForce(
    new CANNON.Vec3(150, 0, 0),
    new CANNON.Vec3(0, 0, 0),
  );
  world.addBody(sphereBody);

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
  page.o.physics.sphereBody = sphereBody;
}

function _createMesh() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: 0xcccccc }),
  );
  floor.rotation.x = -Math.PI / 2;
  page.scene.add(floor);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 10),
    new THREE.MeshBasicMaterial({ wireframe: true }),
  );
  sphere.position.set(0, 0.5, 0);
  page.scene.add(sphere);

  page.o.three.floor = floor;
  page.o.three.sphere = sphere;
}

export default page;
