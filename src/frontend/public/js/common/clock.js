/* eslint-disable no-undef */
const updatetime = () => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const dayweek = date.getDay();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const week = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  let ampm;
  if (hours >= 12) {
    hours -= 12;
    ampm = "PM";
  } else {
    ampm = "AM";
  }

  if (hours === 0) {
    hours = 12;
  }

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  $("#nav-bar-date").text(`
    ${week[dayweek]}, ${day} de ${months[month]} de ${year} a ${hours}:${minutes}:${seconds} ${ampm}
  `);

  if (hours == "00" && minutes == "00" && seconds == "01" && ampm == "AM")
    location.reload();
};

updatetime();
setInterval(updatetime, 1000);
