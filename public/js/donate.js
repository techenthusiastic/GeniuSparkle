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

// donate donor
const donorTableBody = document.getElementById("donor-table-body");

const allDonors = [
  {
    id: "1",
    donor_date: new Date().toISOString().substr(0, 10),
    donor_country: "us",
    donor_name: "Julia",
    donor_donated: 20,
    donor_many: 1,
  },
  {
    id: "2",

    donor_date: new Date().toISOString().substr(0, 10),
    donor_country: "vn",
    donor_name: "Andrew Marcus",
    donor_donated: 100,
    donor_many: 3,
  },
  {
    id: "3",

    donor_date: new Date().toISOString().substr(0, 10),
    donor_country: "th",
    donor_name: "Alexa",
    donor_donated: 10,
    donor_many: 4,
  },
  {
    id: "4",

    donor_date: new Date().toISOString().substr(0, 10),
    donor_country: "us",
    donor_name: "Jennifer Kale",
    donor_donated: 200,
    donor_many: 2,
  },
];

allDonors.map(
  (e) =>
    (donorTableBody.innerHTML += `
  <tr key=${e.id}>
  <td>${e.donor_date}</td>
  <td>
    <span>
      <img
        src="https://www.countryflags.io/${e.donor_country}/flat/32.png"
      />
    </span>
  </td>
  <td>
    <span>${e.donor_name}</span>
  </td>
  <td>
    $${e.donor_donated} 
    ${
      e.donor_many === 1
        ? ""
        : e.donor_many === 2
        ? "(2nd Donation)"
        : e.donor_many === 3
        ? "(3rd Donation)"
        : `(${e.donor_many}th donation)`
    }
  </td>
</tr>`)
);
