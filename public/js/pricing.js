const planTime = document.querySelector(".pricing-model-btn input");
const btnPlan = document.querySelector(".pricing-model-btn");
const pricingCards = Array.from(document.querySelectorAll(".pricing-card"));
const planCustoms = Array.from(
  document.querySelectorAll(".pricing-card.custom label")
);
const checkedCustoms = Array.from(
  document.querySelectorAll(".pricing-card.custom label input")
);
const priceCustom = document.querySelector(".pricing-card.custom .price");

let priceCustomMonthly = 10;
let priceCustomYearly = 100;
btnPlan.addEventListener("change", () => {
  pricingCards.forEach((pc, i) => {
    if (planTime.checked) {
      document.querySelectorAll(".pricing-card .price")[
        i
      ].innerHTML = `$${pc.dataset.yearlyPrice}`;

      document.querySelectorAll(".pricing-card .pricing-model")[i].innerHTML =
        "/ Year";
      planCustoms.forEach((p, i) => {
        if (p.dataset.checked) {
          priceCustomYearly = priceCustomMonthly * 10;
          priceCustom.innerHTML = `$${priceCustomYearly}`;
        }
      });
    } else {
      document.querySelectorAll(".pricing-card .price")[
        i
      ].innerHTML = `$${pc.dataset.monthlyPrice}`;
      document.querySelectorAll(".pricing-card .pricing-model")[i].innerHTML =
        "/ Month";
      planCustoms.forEach((p, i) => {
        if (checkedCustoms[i].checked) {
          priceCustomMonthly = priceCustomYearly / 10;
          priceCustom.innerHTML = `$${priceCustomMonthly}`;
        }
      });
    }
  });
});

planCustoms.forEach((p, i) => {
  p.addEventListener("change", () => {
    if (!planTime.checked) {
      if (checkedCustoms[i].checked) {
        priceCustom.innerHTML = `$${(priceCustomMonthly += Number(
          p.dataset.monthlyPrice
        ))}`;
      } else {
        priceCustom.innerHTML = `$${(priceCustomMonthly -= Number(
          p.dataset.monthlyPrice
        ))}`;
      }
    } else {
      if (checkedCustoms[i].checked) {
        priceCustom.innerHTML = `$${(priceCustomYearly += Number(
          p.dataset.yearlyPrice
        ))}`;
      } else {
        priceCustom.innerHTML = `$${(priceCustomYearly -= Number(
          p.dataset.yearlyPrice
        ))}`;
      }
    }
  });
});
