async function loadJSON(path) {
    try {
        const response = await fetch(path, { cache: "no-store" });

        if (!response.ok) {
            console.warn("Could not load:", path, response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.warn("Content loading error:", error);
        return null;
    }
}

function setText(selector, value) {
    const element = document.querySelector(selector);

    if (element && value) {
        element.textContent = value;
    }
}

/* =========================
   HOME PAGE EDITABLE CONTENT
========================= */

async function loadHomeContent() {
    const home = await loadJSON("/content/home.json");

    if (home) {
        setText(".hello-text", home.hello);

        const nameElement = document.querySelector(".hero-name");
        if (nameElement && home.firstName && home.lastName) {
            nameElement.innerHTML = `${home.firstName}<br><span>${home.lastName}</span>`;
        }

        const roleElement = document.querySelector(".hero-role");
        if (roleElement && home.roleMain && home.roleAccent) {
            roleElement.innerHTML = `${home.roleMain} <span>${home.roleAccent}</span>`;
        }

        setText(".hero-description", home.description);
    }

    /* About section */

    const about = await loadJSON("/content/about.json");

    if (about && Array.isArray(about.paragraphs)) {
        const aboutSection = document.querySelector("#about");

        if (aboutSection) {
            const heading = aboutSection.querySelector("h2");
            aboutSection.innerHTML = "";

            if (heading) {
                aboutSection.appendChild(heading);
            }

            about.paragraphs.forEach(text => {
                const paragraph = document.createElement("p");
                paragraph.textContent = text;
                aboutSection.appendChild(paragraph);
            });
        }
    }

    /* Skills section */

    const skills = await loadJSON("/content/skills.json");

    if (skills && Array.isArray(skills.categories)) {
        const skillsSection = document.querySelector("#skills");

        if (skillsSection) {
            const heading = skillsSection.querySelector("h2");
            const cardsContainer = skillsSection.querySelector(".cards");

            if (heading && skills.sectionTitle) {
                heading.textContent = skills.sectionTitle;
            }

            if (cardsContainer) {
                cardsContainer.innerHTML = "";

                skills.categories.forEach(category => {
                    const card = document.createElement("div");
                    card.className = "card";

                    const skillItems = Array.isArray(category.skills)
                        ? category.skills.map(skill => `<p>${skill}</p>`).join("")
                        : "";

                    card.innerHTML = `
                        <h3>${category.title || "Skill Category"}</h3>
                        ${skillItems}
                    `;

                    cardsContainer.appendChild(card);
                });
            }
        }
    }

    /* Contact section */

    const contact = await loadJSON("/content/contact.json");

    if (contact) {
        const contactSection = document.querySelector("#contact");

        if (contactSection) {
            contactSection.innerHTML = `
                <h2>Contact</h2>

                <p>Email: <a href="mailto:${contact.email}">${contact.email}</a></p>

                <p>
                    LinkedIn:
                    <a href="${contact.linkedinUrl}" target="_blank" rel="noopener noreferrer">
                        ${contact.linkedinText}
                    </a>
                </p>

                <p>
                    Fiverr:
                    <a href="${contact.fiverrUrl}" target="_blank" rel="noopener noreferrer">
                        ${contact.fiverrText}
                    </a>
                </p>

                <p>Location: ${contact.location}</p>
            `;
        }
    }
}

/* =========================
   PROJECT CATEGORY PAGES
   WITH MULTIPLE IMAGE GALLERY
========================= */

async function loadProjectCategory(jsonPath) {
    const grid = document.querySelector(".detail-project-grid");

    if (!grid) {
        console.warn("Project grid not found");
        return;
    }

    const data = await loadJSON(jsonPath);

    if (!data) {
        console.warn("JSON file not loaded. Keeping fallback projects.");
        return;
    }

    const projects = data.projects || data.items;

    if (!Array.isArray(projects) || projects.length === 0) {
        console.warn("No projects found in JSON. Keeping fallback projects.");
        return;
    }

    grid.innerHTML = "";

    projects.forEach(project => {
        const title = project.title || "Untitled Project";
        const description = project.description || "";
        const software = project.software || "Not specified";

        let projectImages = [];

        if (Array.isArray(project.images) && project.images.length > 0) {
            projectImages = project.images
                .filter(item => item && item.image)
                .map(item => ({
                    image: item.image,
                    caption: item.caption || title
                }));
        }

        if (projectImages.length === 0 && project.image) {
            projectImages = [
                {
                    image: project.image,
                    caption: title
                }
            ];
        }

        if (projectImages.length === 0) {
            projectImages = [
                {
                    image: "/images/bim1.jpg",
                    caption: title
                }
            ];
        }

        const firstImage = projectImages[0].image;

        const thumbnails = projectImages.map((item, index) => {
            return `
                <img
                    src="${item.image}"
                    alt="${item.caption}"
                    class="project-thumb ${index === 0 ? "active" : ""}"
                    data-src="${item.image}"
                >
            `;
        }).join("");

        const card = document.createElement("div");
        card.className = "detail-project-card";

        card.innerHTML = `
            <div class="project-gallery">
                <img src="${firstImage}" alt="${title}" class="project-main-img">

                ${
                    projectImages.length > 1
                        ? `<div class="project-thumbs">${thumbnails}</div>`
                        : ""
                }
            </div>

            <div class="detail-content">
                <h3>${title}</h3>

                <p>${description}</p>

                <p><strong>Software:</strong> ${software}</p>
            </div>
        `;

        grid.appendChild(card);

        const mainImg = card.querySelector(".project-main-img");
        const thumbImgs = card.querySelectorAll(".project-thumb");

        thumbImgs.forEach(thumb => {
            thumb.addEventListener("click", () => {
                mainImg.src = thumb.dataset.src;

                thumbImgs.forEach(t => t.classList.remove("active"));
                thumb.classList.add("active");
            });
        });
    });
}

/* =========================
   SCROLL ANIMATION
========================= */

function initAnimations() {
    const animatedItems = document.querySelectorAll(
        ".hero-left, .hero-right, .hero-stats, .card, .project-card, .experience-box, .research-box, .detail-project-card"
    );

    animatedItems.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(30px)";
        item.style.transition = "0.7s ease";
    });

    function revealItems() {
        animatedItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (itemTop < windowHeight - 90) {
                item.style.opacity = "1";
                item.style.transform = "translateY(0)";
            }
        });
    }

    window.addEventListener("scroll", revealItems);
    window.addEventListener("load", revealItems);
    revealItems();
}

/* =========================
   PAGE DETECTION
   Supports:
   /bim-projects.html
   /bim-projects
========================= */

document.addEventListener("DOMContentLoaded", async () => {
    const currentPage = window.location.pathname.replace(/\/$/, "");

    if (
        currentPage.includes("bim-projects.html") ||
        currentPage.endsWith("/bim-projects")
    ) {
        await loadProjectCategory("/content/bim-projects.json");

    } else if (
        currentPage.includes("structural-projects.html") ||
        currentPage.endsWith("/structural-projects")
    ) {
        await loadProjectCategory("/content/structural-projects.json");

    } else if (
        currentPage.includes("cad-projects.html") ||
        currentPage.endsWith("/cad-projects")
    ) {
        await loadProjectCategory("/content/cad-projects.json");

    } else {
        await loadHomeContent();
    }

    initAnimations();
});
