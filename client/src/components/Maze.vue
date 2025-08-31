<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { socket } from '../socket';

const canvas = ref(null);

let renderer, scene, camera, controls;
let animationFrameId;

function setupScene(maze, solution) {
  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2c3e50);

  // 2. Camera
  const width = maze[0].length;
  const height = maze.length;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(width / 2, height, width);
  camera.lookAt(width / 2, 0, height / 2);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true });
  renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7); // Adjust size as needed

  // 4. Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 5;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI / 2;

  // 5. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(50, 50, 50);
  scene.add(directionalLight);

  // 6. Maze Geometry
  const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8e44ad });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (maze[y][x] === 1) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(x, 0.5, y);
        scene.add(wall);
      }
    }
  }

  // 7. Solution Path Geometry
  const points = solution.map(p => new THREE.Vector3(p.x, 0.5, p.y));
  const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const pathMaterial = new THREE.LineBasicMaterial({ color: 0xe74c3c, linewidth: 3 });
  const solutionLine = new THREE.Line(pathGeometry, pathMaterial);
  scene.add(solutionLine);

  // 8. Ground Plane
  const planeGeometry = new THREE.PlaneGeometry(width, height);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x27ae60, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(width / 2 - 0.5, 0, height / 2 - 0.5);
  scene.add(plane);

  // Start animation
  animate();
}

function animate() {
  animationFrameId = requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
}

onMounted(() => {
  socket.on('maze data', ({ maze, solution }) => {
    setupScene(maze, solution);
  });
  socket.emit('get maze');
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', onWindowResize);
  if (renderer) {
    renderer.dispose();
  }
  socket.off('maze data');
});
</script>

<style scoped>
canvas {
  display: block;
  margin: 0 auto;
  border: 2px solid #34495e;
  border-radius: 8px;
}
</style>
