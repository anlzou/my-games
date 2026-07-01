// 发光球体
function initSphere() {
    const result = initThreeScene('three-container');
    if (!result) return;
    const { scene, camera } = result;

    // 主球体
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.3,
        shininess: 100,
        specular: 0xffffff,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 外发光层
    const glowGeometry = new THREE.SphereGeometry(1.7, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // 粒子环
    const ringParticles = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 2.5 + Math.random() * 0.5;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius * 0.3;
        positions[i * 3 + 2] = Math.sin(angle) * radius * 0.5;
        
        const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.8, 0.5);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }
    ringParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ringParticles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(ringParticles, particleMat);
    scene.add(particles);

    // 星空
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1500;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
        starsPositions[i] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 5;

    let time = 0;
    startAnimation(() => {
        time += 0.01;
        sphere.rotation.x = time * 0.3;
        sphere.rotation.y = time * 0.5;
        glow.rotation.x = -time * 0.2;
        glow.rotation.y = time * 0.3;
        particles.rotation.y += 0.005;
        stars.rotation.y += 0.0001;
        
        // 呼吸效果
        const pulse = 1 + Math.sin(time * 1.5) * 0.03;
        sphere.scale.set(pulse, pulse, pulse);
    });
}
