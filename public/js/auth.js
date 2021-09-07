const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const signUpButtonMobile = document.getElementById("signUp-mobile");
const signInButtonMobile = document.getElementById("signIn-mobile");
const signUpButtonMain = document.getElementById("sign-up-btn");
const resetButton = document.getElementById("btn-reset");
const resetPasswordBtn = document.getElementById("reset-password");
const container = document.getElementById("container");
const signUpContainer = document.querySelector(".sign-up-container");
const signInContainer = document.querySelector(".sign-in-container");
const formContainer = document.querySelector(".form-container");
const overlayContainer = document.querySelector(".overlay-container");
const overlayPanel = document.querySelector(".overlay-panel");
const overlay = document.querySelector(".overlay");
const showPasswords = document.querySelectorAll("#show-password");
const hidePasswords = document.querySelectorAll("#hide-password");
const getBody = document.getElementsByTagName("body");

let userAge = Cookies.get("age");

let scriptLivechat;

function getLiveChat() {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "//js-na1.hs-scripts.com/20480110.js";
  script.id = "hs-script-loader";
  script.async = true;
  script.defer = true;
  getBody[0].appendChild(script);
}

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
  document.querySelector(".reset-password-container").classList.remove("show");
  document.querySelector(".email-container").classList.remove("reset");
  document.querySelector(".email-container").classList.remove("reset-password");
  if (userAge && userAge < 13) {
    document.querySelector(".parent-consent-container").classList.add("show");
    getLiveChat();
    scriptLivechat = getBody[0].lastElementChild;
  }
  showAgain();
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
  document.querySelector(".email-container").classList.remove("show");
  document.querySelector(".parent-consent-container").classList.remove("show");

  if (scriptLivechat) {
    setTimeout(() => {
      location.reload();
    }, 500);
  }
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
  if (userAge && userAge < 13) {
    document.querySelector(".parent-consent-container").classList.add("show");
    getLiveChat();
    getLiveChatWidget = getBody[0].lastElementChild;
  }
});
signInButtonMobile.addEventListener("click", (e) => {
  e.preventDefault();

  signInContainer.style.top = "-50%";
  signInContainer.style.transform = "translateY(50%)";
  signUpContainer.style.top = "-100%";
});

// register
const birthDate = document.getElementById("birth-date");
const signUpContinueBtn = document.getElementById("sign-up-next-btn");
const indentifyUser = document.getElementById("gender");

let signUpName, signUpPassword, signUpEmail;
let userIdentify = indentifyUser.value;

signUpButtonMain.addEventListener("click", () => {
  signUpName = document.getElementById("sign-up-name");
  signUpEmail = document.getElementById("sign-up-email");
  signUpPassword = document.getElementById("sign-up-password");
  // you can do more to validate the input (I create use this just for test)
  if (
    signUpEmail.value !== "" &&
    signUpName.value !== "" &&
    signUpPassword.value !== ""
  ) {
    document.querySelector(".sign-up-next-container").classList.add("show");
  } else {
    alert("Input must not be empty");
  }
});

indentifyUser.addEventListener("change", function () {
  userIdentify = this.value;
});

birthDate.addEventListener("change", function () {
  userAge = getAge(this.value);
});

signUpContinueBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (indentifyUser && userAge) {
    Cookies.set("age", userAge, { expires: 999999 });
    document.querySelector(".sign-up-next-container").classList.remove("show");
    if (userAge < 13) {
      setTimeout(() => {
        document
          .querySelector(".parent-consent-container")
          .classList.add("show");
      }, 500);
      getLiveChat();
      getLiveChatWidget = getBody[0].lastElementChild;
    } else {
      document.querySelector(".email-container").classList.add("show");
    }
  }
});

// reset password

resetPasswordBtn.addEventListener("click", () => {
  document.querySelector(".reset-password-container").classList.add("show");
  document.querySelector(".email-container").classList.add("reset-password");
});

addEventListener("load", () => {
  if (location.search.substr(1) === "signup") {
    // console.log("hai");
    if (window.innerWidth > 768) {
      overlayPanel.style.transition = "none";
      overlay.style.transition = "none";
      formContainer.style.transition = "none";
      overlayContainer.style.transition = "none";
      container.classList.add("right-panel-active");
    } else {
      signUpContainer.style.top = "50%";
      signUpContainer.style.transform = "translateY(-50%)";
      signInContainer.style.top = "100%";
    }
  }
  setTimeout(() => {
    container.style.display = "initial";
  }, 100);
});

function showAgain() {
  formContainer.style.transition = "all 0.6s ease-in-out";
  overlay.style.transition = "transform  0.6s ease-in-out";
  overlayContainer.style.transition = "transform  0.6s ease-in-out";
  overlayPanel.style.transition = "transform  0.6s ease-in-out";
}

// show password

showPasswords.forEach((showPassword, i) => {
  showPassword.addEventListener("click", () => {
    let inputPassword;
    if (i === 0) {
      inputPassword = document.querySelector(".sign-up-input.password input");
    } else {
      inputPassword = document.querySelector(".sign-in-input.password input");
    }
    showPassword.classList.remove("hide");
    hidePasswords[i].classList.add("show");
    inputPassword.type = "text";
  });
});

hidePasswords.forEach((hidePassword, i) => {
  hidePassword.addEventListener("click", () => {
    let inputPassword;
    if (i === 0) {
      inputPassword = document.querySelector(".sign-up-input.password input");
    } else {
      inputPassword = document.querySelector(".sign-in-input.password input");
    }
    hidePassword.classList.remove("show");
    showPasswords[i].classList.add("hide");
    inputPassword.type = "password";
  });
});

// get age
function getAge(date) {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
