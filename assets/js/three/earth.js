// 旋转地球
function initEarth() {
    const result = initThreeScene('three-container');
    if (!result) return;
    const { scene, camera } = result;

    // 地球纹理通过 Canvas 生成
    function createEarthTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // 海洋底色
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#1a3a5c');
        gradient.addColorStop(0.3, '#1a5276');
        gradient.addColorStop(0.5, '#1c6ea4');
        gradient.addColorStop(0.7, '#1a5276');
        gradient.addColorStop(1, '#1a3a5c');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 512);

        // 随机生成大陆形状
        function drawContinent(points, color) {
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            
            // 边缘阴影
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 添加一些纹理细节
            for (let i = 0; i < 30; i++) {
                const x = points[0][0] + (Math.random() - 0.5) * 100;
                const y = points[0][1] + (Math.random() - 0.5) * 100;
                if (ctx.isPointInPath(x, y)) {
                    ctx.fillStyle = `rgba(${60 + Math.random() * 40}, ${120 + Math.random() * 40}, ${40 + Math.random() * 30}, 0.3)`;
                    ctx.beginPath();
                    ctx.arc(x, y, 3 + Math.random() * 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const green = '#2d7d46';
        const green2 = '#3a8c54';
        const green3 = '#4a9c64';

        // 模拟各大洲 - 使用多边形近似
        // 北美洲
        drawContinent([
            [150, 60], [200, 50], [250, 70], [280, 100], [270, 140],
            [240, 160], [200, 150], [170, 130], [150, 100], [140, 80]
        ], green);

        // 南美洲
        drawContinent([
            [240, 200], [260, 190], [280, 210], [285, 250], [280, 290],
            [270, 320], [255, 340], [240, 330], [235, 300], [230, 260],
            [232, 230]
        ], green2);

        // 欧洲
        drawContinent([
            [480, 70], [500, 65], [520, 70], [530, 85], [525, 100],
            [510, 110], [490, 115], [475, 105], [470, 90]
        ], green3);

        // 非洲
        drawContinent([
            [490, 125], [510, 120], [530, 130], [540, 155], [535, 190],
            [525, 220], [510, 235], [495, 230], [485, 210], [480, 180],
            [478, 155], [482, 138]
        ], green2);

        // 亚洲
        drawContinent([
            [540, 65], [570, 55], [610, 50], [660, 55], [700, 65],
            [730, 80], [740, 100], [730, 120], [710, 130], [680, 135],
            [650, 130], [620, 120], [600, 110], [580, 105], [560, 100],
            [540, 95], [535, 80]
        ], green);

        // 亚洲东部
        drawContinent([
            [740, 65], [770, 60], [790, 70], [795, 85], [785, 100],
            [770, 110], [750, 115], [735, 105], [730, 85]
        ], green3);

        // 东南亚
        drawContinent([
            [680, 145], [695, 140], [705, 150], [700, 170],
            [690, 180], [678, 175], [672, 160]
        ], green2);

        // 澳大利亚
        drawContinent([
            [780, 250], [800, 245], [820, 255], [825, 275],
            [815, 290], [795, 295], [778, 285], [775, 265]
        ], green3);

        // 格陵兰
        drawContinent([
            [320, 30], [340, 25], [360, 30], [370, 45],
            [365, 60], [345, 65], [325, 60], [318, 45]
        ], 'rgba(200,220,230,0.8)');

        // 添加云层（半透明斑点）
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const size = 20 + Math.random() * 60;
            ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.1})`;
            ctx.beginPath();
            ctx.ellipse(x, y, size, size * 0.4, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        return new THREE.CanvasTexture(canvas);
    }

    const earthTexture = createEarthTexture();
    
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 25,
        specular: new THREE.Color(0x333333),
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // 大气层辉光
    const glowGeometry = new THREE.SphereGeometry(1.55, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // 星星
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
        starsPositions[i * 3] = (Math.random() - 0.5) * 300;
        starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
        starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;
        const brightness = 0.5 + Math.random() * 0.5;
        const tint = Math.random();
        if (tint > 0.9) {
            starColors[i * 3] = brightness;
            starColors[i * 3 + 1] = brightness * 0.8;
            starColors[i * 3 + 2] = brightness * 0.6;
        } else if (tint > 0.8) {
            starColors[i * 3] = brightness * 0.7;
            starColors[i * 3 + 1] = brightness * 0.8;
            starColors[i * 3 + 2] = brightness;
        } else {
            starColors[i * 3] = brightness;
            starColors[i * 3 + 1] = brightness;
            starColors[i * 3 + 2] = brightness;
        }
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starsMaterial = new THREE.PointsMaterial({ 
        size: 0.2, 
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 4;

    let time = 0;
    startAnimation(() => {
        time += 0.01;
        earth.rotation.y += 0.005;
        glow.rotation.y += 0.003;
        stars.rotation.y += 0.0001;
    });
}
