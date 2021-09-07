const destionationTime = new Date("September 20, 2021 17:00:00").getTime();

const hitungMundur = setInterval(() => {
  const currentTime = new Date().getTime();
  const difference = destionationTime - currentTime;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const timerDate = document.querySelector(".coming-soon-timer-time");
  timerDate.innerHTML = `${days} :  ${hours} : ${minutes} : ${seconds}`;
}, 1000);
