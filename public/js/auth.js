const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const signUpButtonMobile = document.getElementById("signUp-mobile");
const signInButtonMobile = document.getElementById("signIn-mobile");
const signInButtonMain = document.getElementById("sign-up-btn");
const resetButton = document.getElementById("btn-reset");
const resetPasswordBtn = document.getElementById("reset-password");
const container = document.getElementById("container");
const signUpContainer = document.querySelector(".sign-up-container");
const signInContainer = document.querySelector(".sign-in-container");
const formContainer = document.querySelector(".form-container");
const overlayContainer = document.querySelector(".overlay-container");
const overlayPanel = document.querySelector(".overlay-panel");
const overlay = document.querySelector(".overlay");

signUpButton.addEventListener("click", () => {
	container.classList.add("right-panel-active");
	document.querySelector(".reset-password-container").classList.remove("show");
	document.querySelector(".email-container").classList.remove("reset");
	document.querySelector(".email-container").classList.remove("reset-password");

	showAgain();
});

signInButton.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
	document.querySelector(".email-container").classList.remove("show");
	showAgain();
});

resetButton.addEventListener("click", () => {
	document.querySelector(".email-container").classList.add("reset");
});

signUpButtonMobile.addEventListener("click", (e) => {
	e.preventDefault();
	signUpContainer.style.top = "50%";
	signUpContainer.style.transform = "translateY(-50%)";
	signInContainer.style.top = "100%";
});
signInButtonMobile.addEventListener("click", (e) => {
	e.preventDefault();
	signInContainer.style.top = "-50%";
	signInContainer.style.transform = "translateY(50%)";
	signUpContainer.style.top = "-100%";
});

signInButtonMain.addEventListener("click", () => {
	document.querySelector(".email-container").classList.add("show");
});
resetPasswordBtn.addEventListener("click", () => {
	document.querySelector(".reset-password-container").classList.add("show");
	document.querySelector(".email-container").classList.add("reset-password");
});

addEventListener("load", () => {
	if (location.search.substr(1) === "signup") {
		// console.log("hai");
		overlayPanel.style.transition = "none";
		overlay.style.transition = "none";
		formContainer.style.transition = "none";
		overlayContainer.style.transition = "none";
		container.classList.add("right-panel-active");
	}
	setTimeout(() => {
		container.style.display = "initial";
	}, 100);
});

function showAgain() {
	formContainer.style.transition = "all  0.6s ease-in-out";
	overlay.style.transition = "transform  0.6s ease-in-out";
	overlayContainer.style.transition = "transform  0.6s ease-in-out";
	overlayPanel.style.transition = "transform  0.6s ease-in-out";
}
