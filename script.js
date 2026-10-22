
const helloButton = document.getElementById("helloButton");

helloButton.addEventListener("click", function () {
    alert("Welcome to K9INE Labs! Thanks for visiting.");
});

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
        metalness: 0.6,
        roughness: 0.25,
        wireframe: true
    });

    const object = new THREE.Mesh(geometry, material);
    scene.add(object);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xa78bfa, 40);
    pointLight.position.set(3, 3, 5);
    scene.add(pointLight);


// Track mouse movement for the 3D camera

let targetMouseX = 0;
let targetMouseY = 0;

hero.addEventListener("mouseleave", () => {
    const rect = sceneContainer.getBoundingClientRect();

    targetMouseX =
        ((event.clientX - rect.left) / rect.width - 0.5) * 2;

    targetMouseY =
        ((event.clientY - rect.top) / rect.height - 0.5) * 2;
});

hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();


function animate() {
    requestAnimationFrame(animate);

    // Rotate the 3D object
    object.rotation.x += 0.003;
    object.rotation.y += 0.005;

    // Smooth camera movement
    camera.position.x +=
        (targetMouseX * 1.2 - camera.position.x) * 0.04;

    camera.position.y +=
        (-targetMouseY * 0.8 - camera.position.y) * 0.04;

    // Always look toward the object
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
