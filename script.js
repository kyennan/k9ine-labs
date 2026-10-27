
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

/* K9INE LABS: CINEMATIC THREE.JS SCENE */
const sceneContainer = document.getElementById("three-container");

if (sceneContainer && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    const phoneMedia = window.matchMedia("(max-width: 700px)");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phoneMedia.matches ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    sceneContainer.appendChild(renderer.domElement);

    // A luminous sculpted knot with a fine wireframe skin.
    const sculpture = new THREE.Group();
    scene.add(sculpture);
    const geometry = new THREE.TorusKnotGeometry(1.12, 0.31, 120, 20, 2, 3);
    const core = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
        color: 0x7352d5, metalness: 0.42, roughness: 0.3,
        emissive: 0x37218a, emissiveIntensity: 0.65
    }));
    sculpture.add(core);
    const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0xd3c4ff, wireframe: true, transparent: true, opacity: 0.38,
        depthWrite: false
    }));
    wire.scale.setScalar(1.012);
    sculpture.add(wire);

    // Two slender orbit rings give the shape more depth and motion.
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6, transparent: true, opacity: 0.38, depthWrite: false
    });
    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.009, 5, 96), orbitMaterial);
    orbitA.rotation.set(0.8, 0.4, 0.3);
    scene.add(orbitA);
    const orbitB = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.007, 5, 96),
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.26, depthWrite: false }));
    orbitB.rotation.set(-0.55, 0.7, -0.4);
    scene.add(orbitB);

    const ambient = new THREE.AmbientLight(0xb6a5ff, 1.5);
    scene.add(ambient);
    const key = new THREE.PointLight(0xc4b5fd, 48);
    key.position.set(3, 3, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0x4f46e5, 34);
    rim.position.set(-3, -2, -2);
    scene.add(rim);

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

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = motionPreference.matches;
    const clock = new THREE.Clock();
    let frameId = null;
    let running = false;
    let sceneInView = true;
    let lastRenderTime = 0;
    const phoneFrameInterval = 1000 / 30; // Cap mobile rendering at 30 FPS.
    function resizeScene() {
        const width = sceneContainer.clientWidth;
        const height = sceneContainer.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phoneMedia.matches ? 1.25 : 1.75));
        renderer.setSize(width, height);
        if (motionPreference.matches) renderer.render(scene, camera);
    }
    resizeScene();
    window.addEventListener("resize", resizeScene);

    function animate(now) {
        if (!running) return;
        frameId = requestAnimationFrame(animate);
        // Skip excess frames on phones to reduce GPU and battery usage.
        if (phoneMedia.matches && now - lastRenderTime < phoneFrameInterval) return;
        lastRenderTime = now;
        const delta = Math.min(clock.getDelta(), 0.05);
        const speed = reducedMotion ? 0.35 : (phoneMedia.matches ? 1.65 : 1);
        sculpture.rotation.x += delta * 0.12 * speed;
        sculpture.rotation.y += delta * 0.24 * speed;
        orbitA.rotation.z += delta * 0.06 * speed;
        orbitB.rotation.y += delta * 0.09 * speed;
        const time = clock.elapsedTime;
        sculpture.position.y = Math.sin(time * 0.7 * speed) * 0.12;
        camera.position.x += ((reducedMotion ? 0 : targetMouseX * 0.65) - camera.position.x) * 0.025;
        camera.position.y += ((reducedMotion ? 0 : -targetMouseY * 0.4) - camera.position.y) * 0.025;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }
    function syncRendering() {
        const shouldRun = !document.hidden && sceneInView && !motionPreference.matches;
        if (shouldRun === running) return;
        running = shouldRun;
        if (running) {
            clock.getDelta(); // Discard time spent paused.
            lastRenderTime = 0;
            frameId = requestAnimationFrame(animate);
        } else if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    }
    if ("IntersectionObserver" in window) {
        const sceneObserver = new IntersectionObserver((entries) => {
            sceneInView = entries[0].isIntersecting;
            syncRendering();
        }, { rootMargin: "150px 0px" });
        sceneObserver.observe(sceneContainer);
    }
    document.addEventListener("visibilitychange", syncRendering);
    motionPreference.addEventListener("change", () => {
        if (motionPreference.matches) renderer.render(scene, camera);
        syncRendering();
    });
    if (motionPreference.matches) renderer.render(scene, camera);
    syncRendering();
}

/* K9INE LABS: REPLAYABLE SCROLL REVEALS */
// Observe each section continuously so it can animate again when revisited.
// Respect reduced-motion preferences: no hidden content or forced animation.
if ("IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealItems = document.querySelectorAll(
        "#about .section-eyebrow, #about .about-layout > div, " +
        "#projects .section-eyebrow, #projects h2, #projects .section-intro, " +
        "#projects .project-card, " +
        "#contact .section-eyebrow, #contact h2, " +
        "#contact > p:not(.section-eyebrow), #contact .contact-panel"
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("reveal-visible", entry.isIntersecting);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach((item) => {
        // Items already in view stay visible at startup.
        const rect = item.getBoundingClientRect();
        const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
        item.classList.add("reveal-ready");
        if (onScreen) item.classList.add("reveal-visible");
        revealObserver.observe(item);
    });
}

/* NAVIGATION 2.0 */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = siteNav ? Array.from(siteNav.querySelectorAll('a[href^="#"]')) : [];

function closeMobileNav() {
    if (!navToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
}
if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const open = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    navLinks.forEach(link => link.addEventListener("click", closeMobileNav));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMobileNav();
    });
    document.addEventListener("click", event => {
        if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) closeMobileNav();
    });
    window.matchMedia("(min-width: 601px)").addEventListener("change", closeMobileNav);
}

const navSections = navLinks
    .map(link => document.getElementById(link.hash.slice(1)))
    .filter(Boolean);
function updateActiveNav() {
    const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 240);
    let currentId = navSections[0] ? navSections[0].id : "";
    navSections.forEach(section => {
        if (section.offsetTop <= marker) currentId = section.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) {
        currentId = navSections[navSections.length - 1]?.id || currentId;
    }
    navLinks.forEach(link => {
        const active = link.hash === "#" + currentId;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    });
}
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", updateActiveNav);
updateActiveNav();
