let mouseParallax = document.querySelector(".mouse-parallax");
let bg = mouseParallax.querySelector(".mouse-parallax-bg");
let textContainer = mouseParallax.querySelector(".text-container");

mouseParallax.addEventListener("mouseenter", function () {
  window.addEventListener("mousemove", parallax);
});

mouseParallax.addEventListener("mouseleave", function () {
  window.removeEventListener("mousemove", parallax);
  bg.style.transform = "translate(0, 0)";
  textContainer.style.transform = "translate(-50%, -50%)";
});

function parallax(e) {
  let x = e.clientX / window.innerWidth - 0.5; // Повертаємо значення від -0.5 до 0.5
  let y = e.clientY / window.innerHeight - 0.5; // Повертаємо значення від -0.5 до 0.5
  bg.style.transform = "translate(" + x * 50 + "px, " + y * 50 + "px)";
  textContainer.style.transform =
    "translate(-50%, -50%) translate(" + -x * 50 + "px, " + -y * 50 + "px)"; // Змінюємо знаки
}
