
const helloButton = document.getElementById("helloButton");

if (helloButton) {
    helloButton.addEventListener("click", function () {
        alert("Welcome to K9INE Labs! Thanks for visiting.");
    });
}

/* K9INE LABS: INTERACTIVE 3D CARDS */

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
});

/* K9INE LABS: MOUSE PARALLAX */

const hero = document.querySelector(".hero");

if (hero) {
    hero.addEventListener("mousemove", (event) => {
        const rect = hero.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        hero.style.setProperty("--mouse-x", `${x * 20}px`);
        hero.style.setProperty("--mouse-y", `${y * 20}px`);
    });

    hero.addEventListener("mouseleave", () => {
        hero.style.setProperty("--mouse-x", "0px");
        hero.style.setProperty("--mouse-y", "0px");
    });
}

/* K9INE LABS: FIRST THREE.JS SCENE */

const sceneContainer = document.getElementById("three-container");

if (sceneContainer && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        60,
        sceneContainer.clientWidth / sceneContainer.clientHeight,
        0.1,
        100
    );

    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(
        sceneContainer.clientWidth,
        sceneContainer.clientHeight
    );

    sceneContainer.appendChild(renderer.domElement);

    // Create a real 3D shape
    const geometry = new THREE.TorusKnotGeometry(
        1.2, 0.35, 100, 16
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.35,
        roughness: 0.35,
        wireframe: true
    });

    const object = new THREE.Mesh(geometry, material);
    scene.add(object);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x8b7bd1, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xa78bfa, 35);
    pointLight.position.set(3, 3, 5);
    scene.add(pointLight);

    // A cool rim light gives the knot more depth.
    const rimLight = new THREE.PointLight(0x4f46e5, 24);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);


// Track the mouse across the hero section.
    let targetMouseX = 0;
    let targetMouseY = 0;
    if (hero) {
        hero.addEventListener("mousemove", (event) => {
            const rect = hero.getBoundingClientRect();
            targetMouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            targetMouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        });
        hero.addEventListener("mouseleave", () => {
            targetMouseX = 0;
            targetMouseY = 0;
        });
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function animate() {
        requestAnimationFrame(animate);
        // Keep the 3D sculpture moving on touch devices, even when the
        // system requests reduced motion. Use a gentler speed in that case.
        object.rotation.x += reducedMotion ? 0.0005 : 0.002;
        object.rotation.y += reducedMotion ? 0.0008 : 0.0035;
        camera.position.x += ((reducedMotion ? 0 : targetMouseX * 1.0) - camera.position.x) * 0.025;
        camera.position.y += ((reducedMotion ? 0 : -targetMouseY * 0.65) - camera.position.y) * 0.025;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        const width = sceneContainer.clientWidth;
        const height = sceneContainer.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}
