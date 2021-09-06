const btn = Array.from(document.querySelectorAll(".btn"));
const btnArrows = Array.from(document.querySelectorAll(".btn-arrow svg"));
const btnSignup = document.querySelector(".btn.btn-signup");
const btnSigin = document.querySelector(".btn.btn-signin");
const nav = document.getElementsByTagName("nav")[0];
const navHam = document.getElementById("nav-menu-btn");

btnSignup.addEventListener("click", (e) => {
  location.href = "./signin-and-signup.html?signup";
});
btnSigin.addEventListener("click", () => {
  location.href = "./signin-and-signup.html?signin";
});

btn.forEach((btn, i) => {
  btn.addEventListener("mouseenter", () => {
    btnArrows[i].style.animation = "arrowIn .3s";
  });
  btn.addEventListener("mouseleave", () => {
    btnArrows[i].style.animation = "arrowOut .3s";
  });
});

// nav
navHam.addEventListener("click", () => {
  const navChilds = Array.from(navHam.children);
  for (let i = 0; i < 3; i++) {
    navChilds[i].classList.toggle("show");
  }

  if (navChilds[0].classList.contains("show")) {
    nav.style.visibility = "visible";
    nav.style.pointerEvents = "initial";
    nav.style.opacity = 1;
    nav.style.transition = "all 0.5s";
    btnSignup.style.display = "flex";
    btnSignup.style.width = "100%";
    btnSigin.style.display = "flex";
    btnSigin.style.width = "100%";
    nav.appendChild(btnSignup);
    nav.appendChild(btnSigin);
  } else {
    nav.style.visibility = "hidden";
    nav.style.pointerEvents = "none";
    nav.style.opacity = 0;
  }
});
