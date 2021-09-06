const btnJumbotron = document.querySelector(".btn.jumbotron");
const video = document.querySelector(".wistia_embed");
const logo = document.getElementById("logo");

btnJumbotron.addEventListener("click", () => {
  location.href = "./signin-and-signup.html?signup";

});

if (innerWidth < 768) {
  video.src =
    "https://fast.wistia.net/embed/iframe/28ybf5yawr?seo=false&videoFoam=true&autoPlay=true&wvideo=hashedid";
} else {
  video.src =
    "https://fast.wistia.net/embed/iframe/28ybf5yawr?seo=false&videoFoam=true&autoPlay=false";
}
