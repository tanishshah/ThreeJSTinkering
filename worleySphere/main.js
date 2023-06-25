import * as THREE from 'three';

// shaders
export function fragmentShader() {
    return `
    uniform float time;
	uniform float shift;

	varying vec2 vUv;
	varying float vDeltaPos;

	void main() {
		float r = vDeltaPos + 0.2*sin(time);
		float g = vDeltaPos + 0.2*cos(time);
		float b = vDeltaPos + 0.2*exp(cos(time)*sin(time));
		vec3 col = abs(vec3(0.8) - vec3(r, g, b));
		gl_FragColor = vec4(col, 1.0);
	}
    `
}

export function vertexShader() {
    return `
	uniform float time;
	uniform float shift;

    varying vec2 vUv;
	varying float vDeltaPos;

	float rand (vec3 grid) {
		return fract(sin(dot(grid, vec3(32452375.9304725, 27445422.3248,4261684.23452)))* 93253.362372);
	}

	float dist3 (vec3 pos, vec3 pos2) {
		float tmp = pow(pos.x - pos2.x, 2.0) + pow(pos.y - pos2.y, 2.0) + pow(pos.z - pos2.z, 2.0);
		return sqrt(tmp);
	}

	float worley(vec3 pos) {
		const int NUM_IND = 256;
		vec3 indices[NUM_IND];
		for (int i = 0; i < NUM_IND; i++) {
			float j = float(i);
			if (i < NUM_IND/2) {
				indices[i] = vec3(
					abs(sin(rand(vec3(0.24234,0.94358,0.4358))*time))
					*rand(vec3(j/532450.0, j/22342340.0, j/43578.23457)),
					rand(vec3(j/80325793425.0, j/232534570.0, j/4592345.345)),
					rand(vec3(j/234529723.0, j/89679824.0, j/5478.1234))
				);
			} else {
				indices[i] = vec3(
					rand(vec3(j/323450.0, j/67554820.0, j/43576.23)),
					abs(cos(time*rand(vec3(0.9342345,0.13614, 0.56487))))
					*rand(vec3(j/9572634.0, j/2486345.0, j/739578.0)),
					rand(vec3(j/546378.0, j/896205895345.0, j/683927.23))
				);
			}
		}

		float minDist = 2.0;
		for (int i = 0; i < NUM_IND; i++) {
			minDist = min(minDist, dist3(pos, indices[i]));
		}

		return minDist;
	}

	void main() {
		vDeltaPos = worley(position);
		vec3 tmp = position*shift - normal * vDeltaPos;
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(tmp, 1.0);
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


// geometry for the sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);

const material = new THREE.ShaderMaterial( {

	uniforms: {
		time: { value: performance.now() / 1000 },
		shift: { value: 2.0 }
	},
	fragmentShader: fragmentShader(),
	vertexShader: vertexShader()

} );

// create the sphere
const sphere = new THREE.Mesh(geometry, material);

// setup the scene
scene.add(sphere);

// render
function render() {
	renderer.render(scene, camera);
}

// add animations, render
function display() {
	requestAnimationFrame(display);
    sphere.material.uniforms.time.value = performance.now() / 1000;
	sphere.rotation.x += 0.01;
	sphere.rotation.y += 0.01;
	sphere.rotation.z += 0.01;

	render();
}

display();
