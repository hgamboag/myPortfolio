const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");
const modal = document.getElementById("modal");

const eventName = document.getElementById("eventName");
const eventTime = document.getElementById("eventTime");
const eventLocation = document.getElementById("eventLocation");

const saveAppointment = document.getElementById("saveAppointment");
const deleteAppointment = document.getElementById("deleteAppointment");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const STORAGE_KEY = "calendarEvents";
let events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

let currentDate = new Date();
let selectedDate = null;

// render calendar
function renderCalendar() {
  daysContainer.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleDateString("en-EN", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay() || 7;
  const totalDays = new Date(year, month + 1, 0).getDate();

  // empty slots
  for (let i = 1; i < firstDay; i++) {
    const empty = document.createElement("div");
    daysContainer.appendChild(empty);
  }

  // days
  for (let day = 1; day <= totalDays; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dayDiv.textContent = day;

    // if event exists
    if (events[dateKey]) {
      const eventDiv = document.createElement("div");
      eventDiv.className = "event-name";
      eventDiv.textContent = events[dateKey].name;

      eventDiv.onclick = (e) => {
        e.stopPropagation();
        openModal(dateKey);
      };

      dayDiv.appendChild(eventDiv);
    }

    dayDiv.onclick = () => openModal(dateKey);
    daysContainer.appendChild(dayDiv);
  }
}

// modal logic
function openModal(dateKey) {
  selectedDate = dateKey;
  document.getElementById("modalDate").textContent = dateKey;

  if (events[dateKey]) {
    eventName.value = events[dateKey].name;
    eventTime.value = events[dateKey].time;
    eventLocation.value = events[dateKey].location;
    deleteAppointment.style.display = "inline-block";
  } else {
    eventName.value = "";
    eventTime.value = "";
    eventLocation.value = "";
    deleteAppointment.style.display = "none";
  }

  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

// save event
saveAppointment.onclick = () => {
  if (!eventName.value.trim()) return;

  events[selectedDate] = {
    name: eventName.value,
    time: eventTime.value,
    location: eventLocation.value
  };

  saveToStorage();
  renderCalendar();
  closeModal();
};


// delete event
deleteAppointment.onclick = () => {
  delete events[selectedDate];
  saveToStorage();
  renderCalendar();
  closeModal();
};

// navigation
prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

// init
renderCalendar();

//save data
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}