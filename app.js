let scene, camera, renderer, arToolkitSource, arToolkitContext, markerRoot, mesh, raycaster, mouse, model;

init();
animate();

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.Camera();
    scene.add(camera);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam'
    });

    arToolkitSource.init(() => {
        setTimeout(() => {
            onResize();
        }, 2000);
    });

    window.addEventListener('resize', () => {
        onResize();
    });

    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'https://cdn.rawgit.com/jeromeetienne/AR.js/master/data/camera_para.dat',
        detectionMode: 'mono'
    });

    arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    markerRoot = new THREE.Group();
    scene.add(markerRoot);

    let geometry = new THREE.PlaneGeometry(1, 1, 4, 4);
    let material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    markerRoot.add(mesh);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    document.addEventListener('click', onClick, false);

    let loader = new THREE.FBXLoader();
    loader.load('resources/models/pawn.fbx', (object) => {
        model = object;
        model.scale.set(0.1, 0.1, 0.1); // Escala el modelo según sea necesario
    });

    document.getElementById('snapshotButton').addEventListener('click', takeSnapshot);
}

function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
}

function onClick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObject(mesh);

    if (intersects.length > 0 && model) {
        let intersect = intersects[0];
        let newModel = model.clone();
        newModel.position.copy(intersect.point);
        markerRoot.add(newModel);
    }
}

function takeSnapshot() {
    renderer.domElement.toBlob((blob) => {
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'snapshot.png';
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (arToolkitSource.ready !== false)
        arToolkitContext.update(arToolkitSource.domElement);
    renderer.render(scene, camera);
}
