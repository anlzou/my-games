// 旋转立方体
function initCube() {
    const result = initThreeScene('three-container');
    if (!result) return;
    const { scene, camera } = result;

    // 创建彩色立方体
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const colors = [
        0xff4444, 0x44ff44, 0x4444ff,
        0xffff44, 0xff44ff, 0x44ffff
    ];
    const materials = colors.map(color => new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.15,
        shininess: 60
    }));
    const cube = new THREE.Mesh(geometry, materials);
    
    // 添加线框
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.4 }));
    cube.add(line);

    scene.add(cube);

    // 添加星星背景
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
        starsPositions[i] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 4.5;

    // 动画
    startAnimation(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.015;
        stars.rotation.y += 0.0002;
    });
}
