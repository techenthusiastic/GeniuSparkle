const btn = Array.from(document.querySelectorAll(".btn"));
const btnArrows = Array.from(document.querySelectorAll(".btn-arrow svg"));
const btnSignup = document.querySelector(".btn.btn-signup");
const btnSigin = document.querySelector(".btn.btn-signin");
const nav = document.getElementsByTagName("nav")[0];
const navHam = document.getElementById("nav-menu-btn");
const liveChat = document.getElementById("live-chat");
const liveChatFooter = document.getElementById("live-chat-footer");
const getBody = document.getElementsByTagName("body");

// for livechat
function getLiveChat() {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "//js-na1.hs-scripts.com/20480110.js";
  script.id = "hs-script-loader";
  script.async = true;
  script.defer = true;
  getBody[0].appendChild(script);
}

if (liveChat) {
  liveChat.addEventListener("click", () => {
    getLiveChat();
  });
}

if (liveChatFooter) {
  liveChatFooter.addEventListener("click", () => {
    getLiveChat();
  });
}

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

// const successfulLookup = (position) => {
//   const { latitude, longitude } = position.coords;
//   fetch(
//     `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=6c1c663500df42709e572bfda5f0ed0a`
//   )
//     .then((res) => res.json())
//     .then(({ results }) => console.log(results[0].components.country));
// };
// window.navigator.geolocation.getCurrentPosition(successfulLookup, console.log);

fetch(`https://ipinfo.io?token=f6921430ab4fea`).then((res) => res.json());
// .then(console.log);

// donate

const donateOther = document.getElementById("donate-other");
if (donateOther) {
  donateOther.addEventListener("click", (e) => {
    document.querySelector(".donate-amount").classList.add("show");
  });

  window.onclick = (e) => {
    if (e.target.closest("#donate-other") === null) {
      document.querySelector(".donate-amount").classList.remove("show");
    }
  };
}

// donate payment
const donateButton = document.getElementById("btn-donate");
const donatePayment = document.querySelector(".donate-payment");
const allDonatePayments = document.querySelectorAll(".donate-payment-method");
const donateButtonPay = document.getElementById("donate-pay-button");
const donateButtonCancel = document.getElementById("donate-pay-cancel");
if (donateButton) {
  donateButton.addEventListener("click", () => {
    donatePayment.classList.add("show");
    allDonatePayments.forEach((payment, i) => {
      payment.addEventListener("click", () => {
        allDonatePayments.forEach((allPayment) => {
          if (allPayment.classList.contains("active")) {
            allPayment.classList.remove("active");
          }
        });
        donateButtonPay.classList.add("selected");
        payment.classList.add("active");
        const paymentCredit = document.getElementById(
          "donate-payment-credit-card"
        );
        const donatePaymentContainer = document.querySelector(
          ".donate-payment-container"
        );
        donatePaymentContainer.style.top = "initial";
        if (payment.dataset && payment.dataset.payment) {
          paymentCredit.classList.add("show");
          donatePaymentContainer.style.top = "initial";
          donatePaymentContainer.style.transform = "none";
          donatePaymentContainer.style.position = "static";
          donatePaymentContainer.style.margin = "3rem auto";
          console.log("hai 2");
        } else {
          paymentCredit.classList.remove("show");
          donatePaymentContainer.style.top = "50%";
          donatePaymentContainer.style.transform = "translateY(-50%)";
          donatePaymentContainer.style.position = "relative";
          donatePaymentContainer.style.margin = "auto";
        }
      });
    });
  });
}

// if (donateButtonPay) {
//   donateButtonCancel.addEventListener("click", () => {
//     donatePayment.classList.remove("show");
//   });
// }

const donateFrequency = document.querySelector(".donate-model-btn input");
if (donateFrequency) {
  donateFrequency.addEventListener("click", () => {
    const donateFrequencyOneTime = donateFrequency.checked;
    let donateCheck = document.querySelector(".donate-check");
    if (donateFrequencyOneTime) {
      donateCheck.style.display = "none";
    } else {
      donateCheck.style.display = "flex";
    }
  });
}
// if (donateFrequency && donateFrequency.checked) {
//   console.log("hao");
// }

// business faq
const faQuestions = document.querySelectorAll("#faq-question");
if (faQuestions) {
  faQuestions.forEach((question, i) => {
    question.addEventListener("click", () => {
      const faqTitles = document.querySelectorAll("#faq-question span");
      const faqDescs = document.querySelectorAll(".faq-question-description");
      faqDescs[i].classList.toggle("show");
      faqTitles[i].classList.toggle("show");
    });
  });
}

