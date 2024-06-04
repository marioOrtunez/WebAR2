// Setup Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
scene.add(light);

// Ground plane
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

// Load 3D model
const loader = new THREE.FBXLoader();
loader.load('resources/models/PAwn_FBX.fbx', function (object) {
    object.scale.set(0.1, 0.1, 0.1);  // Adjust model scale
    scene.add(object);

    window.addEventListener('click', (event) => {
        // Place the object on click
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([plane]);
        if (intersects.length > 0) {
            object.position.copy(intersects[0].point);
        }
    });
});

camera.position.set(0, 1.6, 3);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Capture button functionality
document.getElementById('capture').addEventListener('click', () => {
    renderer.domElement.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'scene.png';
        link.click();
    });
});
