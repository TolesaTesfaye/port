document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav ul li a");
  const mainContent = document.getElementById("content");
  const themeToggle = document.getElementById("theme-toggle");
  const backToTop = document.getElementById("back-to-top");

  // Load section content
  navLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");
      mainContent.innerHTML = '<div class="loader">Loading...</div>';

      try {
        const response = await fetch(section);
        if (!response.ok) throw new Error("Section not found");
        const content = await response.text();
        mainContent.innerHTML = content;

        // Remove existing section-specific CSS
        const existingCss = document.querySelector("link[data-section]");
        if (existingCss) existingCss.remove();

        // Load section-specific CSS
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = section.replace(".html", ".css");
        cssLink.dataset.section = section;
        document.head.appendChild(cssLink);

        // Update active link
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        // Initialize Typed.js for About section
        if (section === "about.html" && typeof Typed !== "undefined") {
          new Typed("#typed-text", {
            strings: ["Web Developer", "UI Enthusiast", "Problem Solver"],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1000,
            loop: true,
          });
        }

        // Initialize scroll animations
        initScrollAnimations();
      } catch (error) {
        mainContent.innerHTML =
          '<p class="error">Section not found. Please try again.</p>';
        console.error(error);
      }
    });
  });

  // Load "About" section by default
  navLinks[0].click();

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.innerHTML = document.body.classList.contains("dark")
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  });

  // Back to top
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Show/hide back-to-top button
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  // Scroll animations for sections
  function initScrollAnimations() {
    const elements = document.querySelectorAll(
      ".welcome-hero, .about-details, .fun-fact, .contact-form, .experience-item, .project-card, .service-card, .skill-item"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
  }
});
