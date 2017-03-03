function handleLoad () {
	window.g = {};
	var scene = window.g.scene = createScene();
	var lights = window.g.lights = createLights();
	var camera = window.g.camera = createCamera();
	var renderer  = window.g.renderer = createRenderer();
	var container = window.g.container = document.querySelector('body');
	loadCarWithMaterial();
	scene.add(camera);
	scene.add(...lights);
	container.appendChild(renderer.domElement);
	draw();
};
function handleResize() {
	g.renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('load', handleLoad, false);
window.addEventListener('resize', handleResize, false);

function createRenderer () {
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000);
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	return renderer;
}
function createScene () {
	var scene = new THREE.Scene();
	return scene;
}
function createLights () {
	var lights = [];
	var dLight = new THREE.DirectionalLight(0xffffff);
	dLight.position.set(1,4,1);
	dLight.castShadow = true;
	dLight.name = 'directionalLight';
	lights.push(dLight);
	return lights;
}
function createCamera () {
	var width = window.innerWidth, height = window.innerHeight;
	var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
	camera.position.set(200, 200, 200);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	return camera;
}
function Box () {
	if (!(this instanceof Box)) return new Box();
	var boxGeom = new THREE.BoxGeometry(100, 40, 40);
	var boxMate = new THREE.MeshPhongMaterial({ color: 0xff00ff });
	this.mesh = new THREE.Mesh(boxGeom, boxMate);
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;
	this.mesh.rotation.y = Math.PI / 2;
}
function loadCar () {
	var loader = new THREE.OBJLoader();
	loader.load('http://og04901z9.bkt.clouddn.com/file.obj', function (obj) {
		obj.scale.set(50, 50, 50);
		obj.castShadow = true;
		obj.receiveShadow = true;
		obj.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.material.side = THREE.DoubleSide;
			}
		});
		document.querySelector('.loading').classList.toggle('hide');
		g.car = obj;
		g.scene.add(obj);
	});
}
function loadCarWithMaterial () {
	var objLoader = new THREE.OBJLoader();
	var mtlLoader = new THREE.MTLLoader();
	objLoader.setPath('http://og04901z9.bkt.clouddn.com/');
	mtlLoader.setPath('http://og04901z9.bkt.clouddn.com/');
	mtlLoader.load('file.mtl', function ( materials) {
		materials.preload();
		objLoader.setMaterials(materials);
		objLoader.load('file.obj', function (obj) {
			document.querySelector('.loading').classList.toggle('hide');
			window.car = obj;
			obj.scale.set(50, 50, 50);
			obj.castShadow = true;
			obj.receiveShadow = true;
			obj.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material.side = THREE.DoubleSide;
				}
			});
			g.scene.add(obj);
		});
	});
	// var obj = new Promise(function (resolve) {
	// 	objLoader.load('file.obj', function (data) { resolve(data); });
	// });
	// var mtl = new Promise(function (resolve) {
	// 	mtlLoader.load('file.mtl', function (data) { resolve(data); });
	// });
	// Promise.all([obj, mtl]).then(function (data) {
	// 	var objIndex = 0;
	// 	if (!(data[objIndex] instanceof THREE.Object3D)) ++objIndex;
	// 	data[objIndex].setMaterials(data[(objIndex + 1) % 2]);
	// 	window.car = data[objIndex];
	// 	g.scene.add(data[objIndex]);
	// 	return data[objIndex];
	// });
}
function draw () {
	g.renderer.render(g.scene, g.camera);
	if (g.car) {
		g.car.rotation.y += 0.01;
		if (g.car.rotation.y > Math.PI * 2) g.car.rotation.y -= Math.PI * 2;
	}
	requestAnimationFrame(draw);
}