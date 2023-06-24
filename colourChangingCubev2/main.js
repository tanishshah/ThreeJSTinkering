import * as THREE from 'three';

// shaders
export function fragmentShader() {
    return `
    uniform float time;
	varying vec2 vUv;
	void main() {
		vec2 grid = vUv;
		vec3 col = vec3(abs(cos(time))*grid.x, abs(exp(time)*sin(time)), grid.y*abs(sin(time)));
		gl_FragColor = vec4(col, 1.0);
	}
    `
}

export function vertexShader() {
    return `
    varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
    `
}

// parameters for the camera
const fov = 50;
const aspectRatio = window.innerWidth/ window.innerHeight;
const camera_near = 0.1;
const camera_far = 2000;

// create the scene
const scene = new THREE.Scene();

// create the camera
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, camera_near, camera_far);
camera.position.z = 8;

// setup the render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// geometry for the cube
const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.ShaderMaterial( {

	uniforms: {
		time: { value: performance.now() / 1000 },
	},
	fragmentShader: fragmentShader(),
	vertexShader: vertexShader()

} );

// create the cube
const cube = new THREE.Mesh(geometry, material);

// setup the sence
scene.add(cube);

// render
function render() {
	renderer.render(scene, camera);
}

// add animations, render
function display() {
	requestAnimationFrame(display);
    cube.material.uniforms.time.value = performance.now() / 1000;
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	cube.rotation.z += 0.01;

	render();
}

display();
