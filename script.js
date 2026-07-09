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
   WHATSAPP LINK
========================= */

function buildWhatsAppLink(phoneNumber, message) {
    if (!phoneNumber) return "#";

    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(
        message || "Hello Sumith, I contacted you from your portfolio website."
    );

    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/* =========================
   CONTACT CONTENT
========================= */

async function loadContactContent() {
    const contact = await loadJSON("/content/contact.json");

    if (!contact) return;

    const contactGrid = document.querySelector("#contactGrid");
    const emailBtn = document.querySelector(".email-btn");
    const whatsappBtn = document.querySelector(".whatsapp-btn");

    const whatsappLink = buildWhatsAppLink(contact.phoneNumber, contact.whatsappMessage);

    if (emailBtn && contact.email) {
        emailBtn.href = `mailto:${contact.email}`;
    }

    if (whatsappBtn && contact.phoneNumber) {
        whatsappBtn.href = whatsappLink;
    }

    if (contactGrid) {
        contactGrid.innerHTML = `
            <a class="contact-card" href="mailto:${contact.email}">
                <div class="contact-icon">
                    <i class="fa-solid fa-envelope"></i>
                </div>

                <div class="contact-details">
                    <span class="contact-label">Email</span>
                    <h4>${contact.email || ""}</h4>
                    <p>Send me an email directly</p>
                </div>
            </a>

            <a class="contact-card whatsapp-contact-card" href="${whatsappLink}" target="_blank" rel="noopener noreferrer">
                <div class="contact-icon whatsapp-icon">
                    <i class="fa-brands fa-whatsapp"></i>
                </div>

                <div class="contact-details">
                    <span class="contact-label">WhatsApp</span>
                    <h4>${contact.phoneNumber || ""}</h4>
                    <p>Message me on WhatsApp</p>
                </div>
            </a>

            <a class="contact-card" href="${contact.linkedinUrl || "#"}" target="_blank" rel="noopener noreferrer">
                <div class="contact-icon">
                    <i class="fa-brands fa-linkedin-in"></i>
                </div>

                <div class="contact-details">
                    <span class="contact-label">LinkedIn</span>
                    <h4>${contact.linkedinText || "LinkedIn"}</h4>
                    <p>View my professional profile</p>
                </div>
            </a>

            <a class="contact-card" href="${contact.fiverrUrl || "#"}" target="_blank" rel="noopener noreferrer">
                <div class="contact-icon">
                    <i class="fa-solid fa-briefcase"></i>
                </div>

                <div class="contact-details">
                    <span class="contact-label">Fiverr</span>
                    <h4>${contact.fiverrText || "Fiverr"}</h4>
                    <p>Check my freelance services</p>
                </div>
            </a>

            <div class="contact-card location-card">
                <div class="contact-icon">
                    <i class="fa-solid fa-location-dot"></i>
                </div>

                <div class="contact-details">
                    <span class="contact-label">Location</span>
                    <h4>${contact.location || ""}</h4>
                   
                </div>
            </div>
        `;
    }
}

/* =========================
   FEATURED HOME PROJECTS
   Home page 3 project cards editable by CMS
========================= */

function normalizePageLink(link) {
    if (!link) return "#";

    if (
        link.startsWith("http://") ||
        link.startsWith("https://") ||
        link.startsWith("/") ||
        link.startsWith("#")
    ) {
        return link;
    }

    return `/${link}`;
}

async function loadFeaturedProjects() {
    const data = await loadJSON("/content/featured-projects.json");

    if (!data) {
        console.warn("Featured projects JSON not loaded. Keeping fallback cards.");
        return;
    }

    const titleElement = document.querySelector("#featured-projects-title");
    const gridElement = document.querySelector("#featured-projects-grid");

    if (!gridElement) return;

    if (titleElement && data.sectionTitle) {
        titleElement.textContent = data.sectionTitle;
    }

    const projects = data.projects;

    if (!Array.isArray(projects) || projects.length === 0) {
        console.warn("No featured projects found. Keeping fallback cards.");
        return;
    }

    gridElement.innerHTML = "";

    projects.forEach(project => {
        const title = project.title || "Project";
        const description = project.description || "";
        const image = project.image || "/images/bim1.jpg";
        const buttonText = project.buttonText || "View Project";
        const buttonLink = normalizePageLink(project.buttonLink || "#");

        const card = document.createElement("a");
        card.href = buttonLink;
        card.className = "project-card project-card-link";

        card.innerHTML = `
            <div class="project-img">
                <img src="${image}" alt="${title}">
            </div>

            <h3>${title}</h3>

            <p>${description}</p>

            <span class="view-more">${buttonText} →</span>
        `;

        gridElement.appendChild(card);
    });
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

    await loadFeaturedProjects();
    await loadResearchHomeCard();
    await loadContactContent();
}

/* =========================
   RESEARCH HOME CARD
========================= */

async function loadResearchHomeCard() {
    const research = await loadJSON("/content/research.json");

    if (!research) return;

    const researchSection = document.querySelector("#research");

    if (!researchSection) return;

    const heading = researchSection.querySelector("h2");
    const cardImage = researchSection.querySelector(".research-card-image img");
    const cardTitle = researchSection.querySelector(".research-card-content h3");
    const cardDescription = researchSection.querySelector(".research-card-content p");
    const cardButton = researchSection.querySelector(".research-view-btn");

    if (heading && research.sectionTitle) {
        heading.textContent = research.sectionTitle;
    }

    if (cardImage && research.homeImage) {
        cardImage.src = research.homeImage;
        cardImage.alt = research.homeTitle || "Research Project";
    }

    if (cardTitle && research.homeTitle) {
        cardTitle.textContent = research.homeTitle;
    }

    if (cardDescription && research.homeDescription) {
        cardDescription.textContent = research.homeDescription;
    }

    if (cardButton && research.buttonText) {
        cardButton.textContent = `${research.buttonText} →`;
        cardButton.href = "/research-project.html";
    }
}

/* =========================
   RESEARCH DETAIL PAGE
========================= */

async function loadResearchDetailPage() {
    const research = await loadJSON("/content/research.json");

    if (!research) return;

    setText(".research-detail-title", research.detailTitle);
    setText(".research-detail-subtitle", research.detailSubtitle);

    const descriptionBox = document.querySelector(".research-description");

    if (descriptionBox && Array.isArray(research.detailDescription)) {
        descriptionBox.innerHTML = "";

        research.detailDescription.forEach(paragraph => {
            const p = document.createElement("p");
            p.textContent = paragraph;
            descriptionBox.appendChild(p);
        });
    }

    const infoBox = document.querySelector(".research-info-box");

    if (infoBox) {
        infoBox.innerHTML = `
            <p><strong>Tools:</strong> ${research.tools || ""}</p>
            <p><strong>Research Areas:</strong> ${research.researchAreas || ""}</p>
            <p><strong>Future Direction:</strong> ${research.futureDirection || ""}</p>
        `;
    }

    const gallery = document.querySelector(".research-detail-gallery .project-gallery");

    if (gallery) {
        let images = [];

        if (Array.isArray(research.images) && research.images.length > 0) {
            images = research.images
                .filter(item => item && item.image)
                .map(item => ({
                    image: item.image,
                    caption: item.caption || research.detailTitle || "Research image"
                }));
        }

        if (images.length === 0 && research.homeImage) {
            images = [
                {
                    image: research.homeImage,
                    caption: research.detailTitle || "Research image"
                }
            ];
        }

        if (images.length > 0) {
            const firstImage = images[0].image;

            const thumbs = images.map((item, index) => `
                <img
                    src="${item.image}"
                    alt="${item.caption}"
                    class="project-thumb ${index === 0 ? "active" : ""}"
                    data-src="${item.image}"
                >
            `).join("");

            gallery.innerHTML = `
                <img src="${firstImage}" alt="${research.detailTitle || "Research Project"}" class="project-main-img">

                ${
                    images.length > 1
                    ? `<div class="project-thumbs">${thumbs}</div>`
                    : ""
                }
            `;

            const mainImg = gallery.querySelector(".project-main-img");
            const thumbImgs = gallery.querySelectorAll(".project-thumb");

            thumbImgs.forEach(thumb => {
                thumb.addEventListener("click", () => {
                    mainImg.src = thumb.dataset.src;

                    thumbImgs.forEach(t => t.classList.remove("active"));
                    thumb.classList.add("active");
                });
            });
        }
    }
}

/* =========================
   PROJECT CATEGORY PAGES
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
        ".hero-left, .hero-right, .hero-stats, .card, .project-card, .research-card-home, .experience-box, .research-box, .detail-project-card, .research-detail-layout"
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

    } else if (
        currentPage.includes("research-project.html") ||
        currentPage.endsWith("/research-project")
    ) {
        await loadResearchDetailPage();

    } else {
        await loadHomeContent();
    }

    initAnimations();
});
