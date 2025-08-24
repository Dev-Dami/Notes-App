document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".feature", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
  });

  gsap.from(".feature svg", {
    scale: 0,
    rotate: -45,
    duration: 0.6,
    stagger: 0.2,
    ease: "back.out(1.7)",
  });
});
