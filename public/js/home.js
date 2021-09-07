const btnJumbotron = document.querySelectorAll(".btn.jumbotron");
const video = document.querySelector(".wistia_embed");
const logo = document.getElementById("logo");

btnJumbotron.forEach((btn) => {
  btn.addEventListener("click", () => {
    location.href = "./signin-and-signup.html?signup";
  });
});