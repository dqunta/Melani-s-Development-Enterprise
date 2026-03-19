document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    const navLinks = document.querySelectorAll(".site-nav a");
    const yearEl = document.getElementById("year");
    const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (navToggle && nav) {
        const closeMenu = () => {
            body.classList.remove("nav-open");
            navToggle.setAttribute("aria-expanded", "false");
            nav.setAttribute("aria-hidden", "true");
        };

        const toggleMenu = () => {
            const isOpen = body.classList.toggle("nav-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            nav.setAttribute("aria-hidden", String(!isOpen));
        };

        nav.setAttribute("aria-hidden", "true");

        navToggle.addEventListener("click", () => {
            toggleMenu();
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("click", (event) => {
            if (!body.classList.contains("nav-open")) {
                return;
            }

            if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && body.classList.contains("nav-open")) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024 && body.classList.contains("nav-open")) {
                closeMenu();
            }
        });
    }

    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const revealItems = document.querySelectorAll("[data-reveal]");
    if (revealItems.length) {
        if (motionReduced || !("IntersectionObserver" in window)) {
            revealItems.forEach((item) => item.classList.add("is-visible"));
        } else {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.16,
                rootMargin: "0px 0px -40px 0px"
            });

            revealItems.forEach((item) => revealObserver.observe(item));
        }
    }

    const parallaxItems = Array.from(document.querySelectorAll("[data-speed]"));
    if (parallaxItems.length && !motionReduced) {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;

            parallaxItems.forEach((item) => {
                const speed = Number(item.dataset.speed || 0);
                const rect = item.getBoundingClientRect();
                const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
                item.style.transform = `translate3d(0, ${offset * -0.18 + scrollY * speed * 0.03}px, 0)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        updateParallax();
        window.addEventListener("scroll", requestTick, { passive: true });
        window.addEventListener("resize", requestTick);
    }

    const whatsappForm = document.getElementById("whatsappForm");
    if (whatsappForm) {
        const dateInput = document.getElementById("date");
        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");
        const serviceInput = document.getElementById("service");
        const locationInput = document.getElementById("location");
        const notesInput = document.getElementById("notes");

        if (dateInput) {
            const today = new Date();
            today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
            const minDate = today.toISOString().split("T")[0];
            dateInput.min = minDate;
        }

        whatsappForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const message = [
                "Hello Melani's Development Enterprise,",
                "",
                `Name: ${nameInput ? nameInput.value.trim() : ""}`,
                `Phone: ${phoneInput ? phoneInput.value.trim() : ""}`,
                `Service: ${serviceInput ? serviceInput.value.trim() : ""}`,
                `Location: ${locationInput ? locationInput.value.trim() : ""}`,
                `Preferred Date: ${dateInput ? dateInput.value : ""}`,
                "",
                "Notes:",
                notesInput && notesInput.value.trim() ? notesInput.value.trim() : "None"
            ].join("\n");

            const url = `https://wa.me/27682942301?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank", "noopener");
        });
    }
});
