// 3D 模型模块通用功能
// ==================== 3D 模型配置 ====================

const threeModels = [
    { id: 'cube', name: '旋转立方体', desc: '经典彩色立方体', icon: '📦', file: 'cube' },
    { id: 'sphere', name: '发光球体', desc: '带光效的球体', icon: '🔮', file: 'sphere' },
    { id: 'torus', name: '扭结环', desc: '复杂扭结曲面', icon: '🔄', file: 'torus' },
    { id: 'earth', name: '旋转地球', desc: '3D 地球模型', icon: '🌍', file: 'earth' },
];

// 获取当前3D模型ID
function getCurrentModelId() {
    const path = window.location.pathname;
    const match = path.match(/\/three\/(.+)\.html$/);
    return match ? match[1] : 'cube';
}

// Three.js 场景通用设置
let scene, camera, renderer, animationId;
let isModelPage = false;

function initThreeScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    // 清除之前的内容
    container.innerHTML = '';

    scene = new THREE.Scene();
    
    const width = container.clientWidth;
    const height = container.clientHeight || 500;
    
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0f0c29, 1);
    container.appendChild(renderer.domElement);

    // 添加基础光照
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0x00d4ff, 0.5);
    directionalLight2.position.set(-5, -3, 5);
    scene.add(directionalLight2);

    // 窗口自适应
    window.addEventListener('resize', onResize);

    return { scene, camera, renderer };
}

function onResize() {
    if (!camera || !renderer) return;
    const container = renderer.domElement.parentElement;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function startAnimation(callback) {
    function animate() {
        animationId = requestAnimationFrame(animate);
        if (callback) callback();
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    animate();
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function cleanupThreeScene() {
    stopAnimation();
    window.removeEventListener('resize', onResize);
    if (renderer) {
        renderer.dispose();
        const container = renderer.domElement.parentElement;
        if (container) {
            container.removeChild(renderer.domElement);
        }
        renderer = null;
    }
    scene = null;
    camera = null;
}
