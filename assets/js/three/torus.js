// 扭结环
function initTorus() {
    const result = initThreeScene('three-container');
    if (!result) return;
    const { scene, camera } = result;

    // 主扭结
    const geometry = new THREE.TorusKnotGeometry(1.3, 0.4, 128, 16);
    const material = new THREE.MeshPhongMaterial({
        color: 0xc77dff,
        emissive: 0x7b2cbf,
        emissiveIntensity: 0.3,
        shininess: 80,
        specular: 0x00d4ff,
        wireframe: false,
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    // 线框层
    const wireframeGeometry = new THREE.TorusKnotGeometry(1.35, 0.45, 32, 8);
    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
    });
    const wireframeKnot = new THREE.Mesh(wireframeGeometry, wireframeMat);
    scene.add(wireframeKnot);

    // 流动粒子
    const particleCount = 800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        const radius = 2.5 + Math.random() * 2;
        positions[i * 3] = Math.sin(theta) * Math.cos(phi) * radius;
        positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
        positions[i * 3 + 2] = Math.cos(theta) * radius;
        
        const c = new THREE.Color().setHSL(0.75 + Math.random() * 0.2, 0.8, 0.5);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
        sizes[i] = 0.03 + Math.random() * 0.05;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    camera.position.z = 5;

    let time = 0;
    startAnimation(() => {
        time += 0.01;
        knot.rotation.x = time * 0.5;
        knot.rotation.y = time * 0.8;
        wireframeKnot.rotation.x = time * 0.5 + 0.1;
        wireframeKnot.rotation.y = time * 0.8 + 0.1;
        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;
    });
}
