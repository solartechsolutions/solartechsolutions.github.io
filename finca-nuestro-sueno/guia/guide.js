const navLinks = [...document.querySelectorAll(".bottom-nav a[data-section]")];
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

const setActiveSection = (id) => {
  navLinks.forEach((link) => {
    if (link.dataset.section === id) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
};

setActiveSection("inicio");

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveSection(visible.target.id);
  },
  { rootMargin: "-20% 0px -55%", threshold: [0.05, 0.2, 0.5] }
);

sections.forEach((section) => observer.observe(section));
