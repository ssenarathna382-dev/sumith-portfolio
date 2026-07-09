async function loadJSON(path) {
    try {
        const response = await fetch(path, { cache: "no-store" });

        if (!response.ok) {
            console.warn("Could not load:", path);
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

/* Home page content */

async function loadHomeContent() {
    const home = await loadJSON("/content/home.json");

    if (home) {
        setText(".hello-text", home.hello);

        const nameElement = document.querySelector(".hero-name");
        if (nameElement) {
            nameElement.innerHTML = `${home.firstName}<br><span>${home.lastName}</span>`;
        }

        const roleElement = document.querySelector(".hero-role");
        if (roleElement) {
            roleElement.innerHTML = `${home.roleMain} <span>${home.roleAccent}</span>`;
        }

        setText(".hero-description", home.description);
    }

    const about = await loadJSON("/content/about.json");

    if (about && about.paragraphs) {
        const aboutSection = document.querySelector("#about");

        if (aboutSection) {
            const heading = aboutSection.querySelector("h2");

            aboutSection.innerHTML = "";
            if (heading) aboutSection.appendChild(heading);

            about.paragraphs.forEach(text => {
                const paragraph = document.createElement("p");
                paragraph.textContent = text;
                aboutSection.appendChild(paragraph);
            });
        }
    }

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

/* Project category pages */

async function loadProjectCategory(jsonPath) {
    const data = await loadJSON(jsonPath);

    if (!data || !data.projects) return;

    const grid = document.querySelector(".detail-project-grid");
    if (!grid) return;

    grid.innerHTML = "";

    data.projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "detail-project-card";

        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">

            <div class="detail-content">
                <h3>${project.title}</h3>

                <p>${project.description}</p>

                <p><strong>Software:</strong> ${project.software}</p>
            </div>
        `;

        grid.appendChild(card);
    });
}

/* Scroll animation */

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

/* Detect current page */

document.addEventListener("DOMContentLoaded", async () => {
    const currentPage = window.location.pathname;

    if (currentPage.includes("bim-projects.html")) {
        await loadProjectCategory("/content/bim-projects.json");
    } else if (currentPage.includes("structural-projects.html")) {
        await loadProjectCategory("/content/structural-projects.json");
    } else if (currentPage.includes("cad-projects.html")) {
        await loadProjectCategory("/content/cad-projects.json");
    } else {
        await loadHomeContent();
    }

    initAnimations();
});
