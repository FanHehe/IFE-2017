window.g = window.global = {
	scene: null,
	camera: null,
	renderer: null,
	container: null,
	lights: {},
	colors: {
		red:0xf25346,
		blue:0x68c3c0,
		pink:0xF5986E,
		white:0xd8d0d1,
		brown:0x59332e,
	},
};
var init = function init () {
	createScene();
	createLights();
	var sea = createSea();
	var sky = createSky();
	var polit = createPolit();
	var plane = createAirPlane();
	plane.mesh.add(polit.mesh);
	g.sea = sea;
	g.sky = sky;
	g.polit = polit;
	g.plane = plane;
	g.mousePos = { x: 0, y: 0 };
	window.addEventListener('mousemove', handleMouseMove, false);
	loop();
};
var resize = function resize () {
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	g.renderer.setSize(WIDTH, HEIGHT);
	g.camera.aspect = WIDTH / HEIGHT;
	g.camera.updateProjectionMatrix();
};
var handleMouseMove = function (e) {
	var tx = (e.clientX / window.innerWidth) * 2 - 1;
	var ty = -(e.clientY / window.innerHeight) * 2 + 1;
	g.mousePos.x = tx;
	g.mousePos.y = ty;
};
var updatePlane = function updatePlane() {
	
	var targetX = normalize(g.mousePos.x, -1, 1, -100, 100);
	var targetY = normalize(g.mousePos.y, -1, 1, 125, 275);
	g.plane.propeller.rotation.x += 0.3;
	g.plane.mesh.position.x = targetX;
	g.plane.mesh.position.y += (targetY - g.plane.mesh.position.y) * 0.1;
	g.plane.mesh.rotation.x = (g.plane.mesh.position.y - targetY) * 0.0064;
	g.plane.mesh.rotation.z = (targetY - g.plane.mesh.position.y) * 0.0128;
};
function normalize (v, vmin, vmax, tmin, tmax) {
	var dv = vmax - vmin;
	var nv = Math.max(vmin, Math.min(v, vmax));
	var pc = ( nv - vmin ) / dv;
	var dt = tmax - tmin;
	return tmin + pc * dt;
};
var createScene = function createScene() {
	// 场景
	var scene = g.scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
	// 相机
	var nearPlane = 1;
	var farPlane = 1000;
	var filedOfView = 60;
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var aspectRatio = WIDTH / HEIGHT;
	var camera = g.camera = new THREE.PerspectiveCamera(filedOfView, aspectRatio, nearPlane, farPlane);
	camera.position.set(0, 200, 100);
	// 渲染器
	var renderer = g.renderer = new THREE.WebGLRenderer({ alpha: true, antilias: true });
	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;
	// 容器
	var container = g.container = document.querySelector('body');
	container.appendChild(renderer.domElement);
}
var createLights = function createLights() {
	var aLight = g.lights.ambientLight = new THREE.AmbientLight(0xdc8874, .5);
	var dLight = g.lights.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	var hLight = g.lights.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 1);
	
	dLight.castShadow = true;
	dLight.position.set(150, 210, 210);
	dLight.shadow.camera.top = 400;
	dLight.shadow.camera.left = -400;
	dLight.shadow.camera.right = 400;
	dLight.shadow.camera.bottom = -400;
	dLight.shadow.camera.far = 1000;
	dLight.shadow.camera.near = 1;
	dLight.shadow.mapSize.width = 2048;
	dLight.shadow.mapSize.height = 2048;

	g.scene.add(aLight);
	g.scene.add(dLight);
	g.scene.add(hLight);
};
var createSea = function () {
	var sea = new Sea();
	sea.mesh.position.y = -500;
	g.scene.add(sea.mesh);
	return sea;
};
var createSky = function () {
	var sky = new Sky();
	sky.mesh.position.y = -600;
	g.scene.add(sky.mesh);
	return sky;
};
var createPolit = function () {
	var pilot =  new Pilot();
	return pilot;
};
var createAirPlane = function () {
	var plane = new AirPlane();
	plane.mesh.scale.set(.15, .15, .15);
	plane.mesh.position.y = 200;
	g.scene.add(plane.mesh);
	return plane;
};
var Sea = function Sea() {
	if (!(this instanceof Sea)) return new Sea;
	var blue = g.colors.blue;
	var seaGeom = new THREE.CylinderGeometry(600, 600, 800, 50, 50);
	var seaMate = new THREE.MeshPhongMaterial({ color: blue, transparent: true, opacity: .8, shading: THREE.FlatShading });

	seaGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	seaGeom.mergeVertices();

	this.waves = [];
	for (var i =0, l = seaGeom.vertices.length; i < l; i++) {
		var v = seaGeom.vertices[i];
		this.waves.push({x: v.x, y: v.y, z: v.z, angle: Math.random() * 2* Math.PI, distance: Math.random() * 15 + 5, speed: 0.016 + Math.random()*0.032 });
	}
	this.mesh = new THREE.Mesh(seaGeom, seaMate);
	this.mesh.receiveShadow = true;
};
Sea.prototype.moveWaves = function () {
	var vs = this.mesh.geometry.vertices;
	for (var i = 0, l = vs.length; i < l; i++) {
		var v = vs[i];
		var vprops = this.waves[i];
		v.x = vprops.x + Math.cos(vprops.angle) * vprops.distance;
		v.y = vprops.y + Math.sin(vprops.angle) * vprops.distance;
	}
	this.mesh.geometry.verticesNeedUpdate = true;
	this.mesh.rotation.z += 0.005;
};
var Cloud = function Cloud () {
	if (!(this instanceof Cloud)) return new Cloud;

	this.mesh = new THREE.Object3D();
	var white = g.colors.white || 0xffffff;
	var boxGeom = new THREE.BoxGeometry(20, 20, 20);
	var boxMate = new THREE.MeshPhongMaterial({ color: white });
	var numbers = Math.floor(Math.random() * 3) + 3;
	for (var i = 0; i <= numbers; i++) {
		var m = new THREE.Mesh(boxGeom, boxMate);

		m.position.x = i * 15;
		m.position.y = Math.random() * 10;
		m.position.z = Math.random() * 10;
		m.rotation.x = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;

		var s = .1 + Math.random() * 0.9;
		m.scale.set(s, s, s);
		m.castShadow = true;
		m.receiveShadow = true;
		this.mesh.add(m);
	}
};
var Sky = function Sky() {
	if (!(this instanceof Sky)) return new Sky();

	this.nClouds = 20;
	this.mesh = new THREE.Object3D();
	var stepAngle = Math.PI * 2 / this.nClouds;
	for (var i = 0, n = this.nClouds; i < n; i++) {
		var c = new Cloud();
		var a = stepAngle * i;
		var h = Math.random() * 200 + 750;
		c.mesh.position.x = Math.sin(a) * h;
		c.mesh.position.y = Math.cos(a) * h;
		c.mesh.position.z = - Math.random() * 400 - 400;
		c.mesh.rotation.z = a + Math.PI / 2;
		var s = Math.random() * 2 + 1;
		c.mesh.scale.set(s, s, s);
		this.mesh.add(c.mesh);
	}
};
var AirPlane = function AirPlane() {
	if (!(this instanceof AirPlane)) return  new AirPlane();

	this.mesh = new THREE.Object3D();
	var red = g.colors.red;
	var white = g.colors.white;
	var brown = g.colors.brown;
	var shading = THREE.FlatShading;
	// 机舱
	var cockpitGeom = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
	var cockpitMate = new THREE.MeshPhongMaterial({ color: red, shading: shading });

	cockpitGeom.vertices[4].y -= 10;
	cockpitGeom.vertices[4].z += 10;
	cockpitGeom.vertices[5].y -= 10;
	cockpitGeom.vertices[5].z -= 10;
	cockpitGeom.vertices[6].y += 10;
	cockpitGeom.vertices[6].z -= 10;
	cockpitGeom.vertices[7].y += 10;
	cockpitGeom.vertices[7].z -= 10;
	var cockpit = new THREE.Mesh(cockpitGeom, cockpitMate);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);
	// 引擎
	var engineGeom = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
	var engineMate = new THREE.MeshPhongMaterial({ color: white, shading: shading });
	var engine = new THREE.Mesh(engineGeom, engineMate);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);
	// 机尾
	var tailGeom = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
	var tailMate = new THREE.MeshPhongMaterial({ color: red, shading: shading });
	var tail = new THREE.Mesh(tailGeom, tailMate);
	tail.position.set(-35, 25, 0);
	tail.castShadow = true;
	tail.receiveShadow = true;
	this.mesh.add(tail);
	// 机翼
	var sideWingGeom = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
	var sideWingMate = new THREE.MeshPhongMaterial({ color: red, shading: shading });
	var sideWing = new THREE.Mesh(sideWingGeom, sideWingMate);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	this.mesh.add(sideWing);
	// 螺旋桨
	var propellerGeom = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
	var propellerMate = new THREE.MeshPhongMaterial({ color: brown, shading: shading });
	this.propeller = new THREE.Mesh(propellerGeom, propellerMate);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;
	// 桨叶
	var bladeGeom = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
	var bladeMate = new THREE.MeshPhongMaterial({ color: brown, shading: shading });
	var blade = new THREE.Mesh(bladeGeom, bladeMate);
	blade.position.set(10, 0, 0);
	blade.castShadow = true;
	blade.receiveShadow = true;

	this.propeller.add(blade);
	this.propeller.position.set(50, 0, 0);
	this.mesh.add(this.propeller);
};
var Pilot = function Pilot() {
	if (!(this instanceof Pilot)) return new Pilot();
	this.mesh = new THREE.Object3D();
	this.hairTop = new THREE.Object3D();
	this.mesh.name = 'polit';

	this.angleHairs = 0;
	var pink = g.colors.pink;
	var brown = g.colors.brown;
	var shading  = THREE.FlatShading;
	// 身体
	var bodyGeom = new THREE.BoxGeometry();
	var bodyMate = new THREE.MeshPhongMaterial({ color: brown, shading: shading });
	var body = new THREE.Mesh(bodyGeom, bodyMate);
	// 脸部
	var faceGeom = new THREE.BoxGeometry();
	var faceMate = new THREE.MeshPhongMaterial({ color: pink, shading: shading });
	var face = new THREE.Mesh(faceGeom, faceMate);
	// 头发丝
	var hairGeom = new THREE.BoxGeometry();
	var hairMate = new THREE.MeshPhongMaterial({ color: brown, shading: shading });
	var hair = new THREE.Mesh(hairGeom, hairMate);
	// 头发容器
	var hairs = new THREE.Object3D();
	for (var i = 0; i < 12; i++) {
		var h = hair.clone();
		var col = i % 3;
		var row = Math.floor(i / 3);
		var startPosX = -4;
		var startPosZ = -4;
		h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
		this.hairTop.add(h);
	}
	var hairSideGeom = new THREE.BoxGeometry(12,4,2);
	hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
	var hairSideR = new THREE.Mesh(hairSideGeom, hairMate);
	var hairSideL = hairSideR.clone();
	hairSideR.position.set(8,-2,6);
	hairSideL.position.set(8,-2,-6);
	hairs.add(hairSideR);
	hairs.add(hairSideL);
   // 创建后脑勺的头发
   var hairBackGeom = new THREE.BoxGeometry(2,8,10);
   var hairBack = new THREE.Mesh(hairBackGeom, hairMate);
   hairBack.position.set(-1,-4,0)
   hairs.add(hairBack);
   hairs.position.set(-5,5,0);

   this.mesh.add(hairs);
};
Pilot.prototype.updateHairs = function () {
	var hairs = this.hairTop.children;
	for (var i = 0, len = hairs.length; i < len; i ++) {
		var hair = hairs[i];
		h.scale.y = 0.75 + Math.cos(this.angleHairs + i / 3) * 0.25;
	}
	this.angleHairs += 0.16;
}
function loop () {
	
	g.sea.mesh.rotation.z += 0.005;
	g.sea.moveWaves();
	g.sky.mesh.rotation.z += 0.01;
	updatePlane();
	g.renderer.render(g.scene, g.camera);
	requestAnimationFrame(loop);
}
window.addEventListener('load', init, false);
window.addEventListener('resize', resize, false);