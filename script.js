const animatedItems = document.querySelectorAll(
    ".hero-left, .hero-right, .hero-stats, .card, .project-card, .experience-box, .research-box"
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