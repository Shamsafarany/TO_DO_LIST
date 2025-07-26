import "./styles.css";
import flagIcon from "../images/flag_1549459.png";
import calendar from "../images/calendar_7173018.png";
import "js-datepicker/dist/datepicker.min.css";
import Task from "./task.js";
import DOMUI from "./ui.js";
const datepicker = require("js-datepicker");

//get all elements IIFE
const DOM = (() => {
  const sidebar = document.querySelector(".sidebar");
  const plus = document.querySelector("#plus");
  const add_task = document.querySelector("#add_task");
  const form = document.querySelector("form");
  const add_task_cont = document.querySelector(".add_task_cont");
  const cancel = document.querySelector("#cancel");
  const title = document.querySelector("#title");
  const submit = document.querySelector("#submit");
  const customSelect = document.querySelector(".custom-select");
  const selected = document.querySelector(".selected");
  const options = document.querySelector(".options");
  const hiddenInput = document.querySelector("#priority");
  const dateOptions = document.querySelector(".date-options");
  const dateDisplay = document.querySelector(".date-display");
  const dateList = document.querySelectorAll("li");
  const hiddenDate = document.querySelector("#date-value");
  const dateDisplayCard = document.querySelector(".dateDisplayCard");
  const chosenDate = document.querySelector(".current-date");
  const timeDisplay = document.querySelector(".timeDisplay");
  const cancelBtn = document.querySelector("#cancelBtn");
  const saveBtn = document.querySelector("#save");
  const timeInput = document.querySelector(".times");
  const timeBtn = document.querySelector(".timeBTN");
  const showTimeTitle = document.querySelector("#showTime");

  return {
    sidebar,
    plus,
    form,
    add_task,
    add_task_cont,
    cancel,
    title,
    submit,
    customSelect,
    selected,
    options,
    hiddenInput,
    dateDisplay,
    dateOptions,
    dateList,
    hiddenDate,
    dateDisplayCard,
    chosenDate,
    timeBtn,
    timeDisplay,
    cancelBtn,
    saveBtn,
    timeInput,
    showTimeTitle,
  };
})();
function displayForm() {
  DOM.plus.addEventListener("mouseover", () => {
    DOM.add_task.style.color = "var(--redColor)";
  });
  DOM.plus.addEventListener("mouseleave", () => {
    DOM.add_task.style.color = "gray";
  });
  DOM.plus.addEventListener("click", () => {
    DOM.form.classList.toggle("hidden");
    DOM.add_task_cont.classList.toggle("hidden");
  });
  DOM.cancel.addEventListener("click", () => {
    DOM.form.classList.toggle("hidden");
    DOM.add_task_cont.classList.toggle("hidden");
  });
  DOM.title.addEventListener("input", () => {
    if (DOM.title.value.trim() !== "") {
      DOM.submit.disabled = false;
      DOM.submit.style.cursor = "pointer";
      DOM.submit.style.opacity = 1;
    } else {
      DOM.submit.disabled = true;
      DOM.submit.style.opacity = "50%";
      DOM.submit.style.cursor = "not-allowed";
    }
  });
  showPriority();
  displayDate();
  addTime();
}

function showPriority() {
  DOM.selected.addEventListener("click", () => {
    DOM.options.classList.toggle("hidden");
  });
  DOM.options.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", () => {
      const clearBtn = document.createElement("span");
      clearBtn.textContent = " ×";
      clearBtn.style.cursor = "pointer";
      clearBtn.style.marginLeft = "8px";
      clearBtn.style.color = "gray";
      DOM.selected.innerHTML = `${option.innerHTML}`;
      DOM.customSelect.style.borderColor = "red";
      DOM.selected.style.color = "red";
      DOM.selected.appendChild(clearBtn);
      DOM.options.classList.toggle("hidden");
      DOM.hiddenInput.value = option.dataset.value;

      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        DOM.selected.innerHTML = "";

        // Create icon
        const img = document.createElement("img");
        img.src = flagIcon;
        img.style.width = "15px";
        img.style.marginRight = "5px";

        // Create span text
        const text = document.createElement("span");
        text.textContent = "Priority";
        text.style.display = "inline-block";

        // Append both
        DOM.selected.appendChild(img);
        DOM.selected.appendChild(text);
        DOM.customSelect.style.borderColor = "rgb(189, 184, 184)";
        DOM.selected.style.color = "gray";
      });
    });
  });
}

function displayDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  const placeholder = document.createElement("span");
  placeholder.classList.add("placeholderCard");
  placeholder.textContent = `${day} ${month}`;
  placeholder.style.color = "gray";
  placeholder.style.backgroundColor = "#eee";
  DOM.chosenDate.appendChild(placeholder);
  DOM.dateDisplay.addEventListener("click", () => {
    DOM.dateOptions.classList.toggle("hidden");
  });
  DOM.dateList.forEach((item) => {
    const display = item.querySelector(".display");
    const dayDisplay = item.querySelector(".day");
    const choice = display.querySelector(".choices");
    const value = choice.textContent.trim();
    let dayName;
    switch (value) {
      case "Today":
        dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        dayDisplay.innerHTML = `${dayName}`;
        break;
      case "Tomorrow":
        date.setDate(date.getDate() + 1);
        dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        dayDisplay.innerHTML = `${dayName}`;
        break;
      case "This Weekend":
        const currentday = date.getDay();
        const diff = (6 - currentday + 7) % 7; // Get days until Saturday
        date.setDate(date.getDate() + diff);
        dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        dayDisplay.innerHTML = `${dayName}`;
        break;
    }

    item.addEventListener("click", () => {
      const dateCont = document.querySelector(".date-cont");

      DOM.hiddenDate.value = value !== "No Date" ? value : "";

      DOM.dateDisplay.innerHTML = display.innerHTML;
      const hasDate = DOM.chosenDate.querySelector(".dateCard");
      const hasTime = DOM.chosenDate.querySelector(".timeCard");

      if (!hasDate && !hasTime) {
        const placeholder = document.querySelector(".placeholderCard");
        placeholder.remove();
      } else if (hasDate) {
        DOM.chosenDate.querySelector(".dateCard")?.remove();
      }

      const card = showFormattedDate(value);
      const oldCard = document.querySelector(".dateCard");

      if (oldCard) oldCard.remove();
      if (card) {
        const clone = card.cloneNode(true);
        DOM.dateDisplayCard.appendChild(card);
        DOM.chosenDate.appendChild(clone);
        clone.style.color = "black";
      }

      switch (value) {
        case "Today":
          DOM.dateDisplay.style.color = "green";
          dateCont.style.borderColor = "green";
          break;
        case "Tomorrow":
          DOM.dateDisplay.style.color = "orange";
          dateCont.style.borderColor = "orange";
          break;
        case "This Weekend":
          DOM.dateDisplay.style.color = "blue";
          dateCont.style.borderColor = "blue";
          break;
        case "No Date":
          DOM.dateDisplay.innerHTML = "";
          const date = new Date();
          const day = date.getDate();
          const month = date.toLocaleString("default", { month: "short" });

          DOM.dateDisplayCard.querySelector(".dateCard")?.remove();
          DOM.chosenDate.querySelector(".dateCard")?.remove();
          DOM.dateDisplayCard.querySelector(".timeCard")?.remove();
          DOM.chosenDate.querySelector(".timeCard")?.remove();

          const hasDate = DOM.chosenDate.querySelector(".dateCard");
          const hasTime = DOM.chosenDate.querySelector(".timeCard");

          if (!hasDate && !hasTime) {
            const placeholder = document.createElement("span");
            placeholder.classList.add("placeholderCard");
            placeholder.textContent = `${day} ${month}`;
            placeholder.style.color = "gray";
            placeholder.style.backgroundColor = "#eee";
            DOM.chosenDate.appendChild(placeholder);
          }

          const img = document.createElement("img");
          img.src = calendar;
          img.style.width = "15px";
          img.style.marginRight = "5px";

          const text = document.createElement("span");
          text.textContent = "Date";
          text.style.color = "gray";
          text.style.display = "inline-block";

          DOM.dateDisplay.appendChild(img);
          DOM.dateDisplay.appendChild(text);
          dateCont.style.borderColor = "gray";
          DOM.showTimeTitle.innerHTML = "";
          DOM.showTimeTitle.innerHTML = `Time`;
          DOM.showTimeTitle.style.color = "gray";
          DOM.timeBtn.querySelector(".clearTimeBtn").remove();
          break;
        default:
          DOM.dateDisplay.style.color = "black";
      }

      if (value !== "No Date") {
        const clearBtn = document.createElement("span");
        clearBtn.textContent = " ×";
        clearBtn.style.cursor = "pointer";
        clearBtn.style.marginLeft = "8px";
        clearBtn.style.color = "gray";

        DOM.dateDisplay.appendChild(clearBtn);

        clearBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          DOM.dateDisplay.innerHTML = "";
          const date = new Date();
          const day = date.getDate();
          const month = date.toLocaleString("default", { month: "short" });

          DOM.dateDisplayCard.querySelector(".dateCard")?.remove();
          DOM.chosenDate.querySelector(".dateCard")?.remove();

          const hasDate = DOM.chosenDate.querySelector(".dateCard");
          const hasTime = DOM.chosenDate.querySelector(".timeCard");

          if (!hasDate && !hasTime) {
            const placeholder = document.createElement("span");
            placeholder.classList.add("placeholderCard");
            placeholder.textContent = `${day} ${month}`;
            placeholder.style.color = "gray";
            placeholder.style.backgroundColor = "#eee";
            DOM.chosenDate.appendChild(placeholder);
          }
          dateCont.style.borderColor = "rgb(189, 184, 184)";

          // Create icon
          const img = document.createElement("img");
          img.src = calendar;
          img.style.width = "15px";
          img.style.marginRight = "5px";

          // Create span text
          const text = document.createElement("span");
          text.textContent = "Date";
          text.style.color = "gray";
          text.style.display = "inline-block";

          DOM.dateDisplay.appendChild(img);
          DOM.dateDisplay.appendChild(text);
          card.remove();
        });
      } else {
        DOM.chosenDate.innerHTML = "";
        const placeholder = document.createElement("span");
        placeholder.classList.add("placeholderCard");
        placeholder.textContent = `${day} ${month}`;
        placeholder.style.color = "gray";
        placeholder.style.backgroundColor = "#eee";
        DOM.chosenDate.appendChild(placeholder);
      }
      DOM.dateOptions.classList.toggle("hidden");
    });
  });

  createDatePicker(datepicker);
}

function showFormattedDate(value) {
  const dateCard = document.createElement("span");
  dateCard.classList.add("dateCard");
  let date;
  switch (value) {
    case "Today":
      date = new Date();
      dateCard.style.backgroundColor = "aquamarine";
      break;
    case "Tomorrow":
      date = new Date();
      date.setDate(date.getDate() + 1);
      dateCard.style.backgroundColor = "orange";
      break;
    case "This Weekend":
      date = new Date();
      const day = date.getDay();
      const diff = (6 - day + 7) % 7; // Get days until Saturday
      date.setDate(date.getDate() + diff);
      dateCard.style.backgroundColor = "rgba(93, 190, 225, 1)";
      break;
    case "No Date":
      return null;
    default:
      return null;
  }

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  dateCard.textContent = `${day} ${month}`;
  return dateCard;
}

function addTime() {
  let timeChosen;
  const date = new Date();
  const day = date.getDate();

  // Toggle time picker
  DOM.timeBtn.addEventListener("click", () => {
    DOM.timeDisplay.classList.toggle("hidden");
  });

  // Cancel hides the time picker
  DOM.cancelBtn.addEventListener("click", () => {
    DOM.timeDisplay.classList.add("hidden");
  });

  // Save sets time, adds card, hides picker
  DOM.saveBtn.addEventListener("click", () => {
    timeChosen = document.querySelector("#times").value;

    const card = showTime(timeChosen);
    DOM.showTimeTitle.innerHTML = `${timeChosen}`;
    DOM.showTimeTitle.style.color = "black";

    // Remove previous cards from both containers
    DOM.dateDisplayCard
      .querySelectorAll(".timeCard")
      .forEach((card) => card.remove());
    DOM.chosenDate
      .querySelectorAll(".timeCard")
      .forEach((card) => card.remove());

    const hasDate = DOM.chosenDate.querySelector(".dateCard");
    const hasTime = DOM.chosenDate.querySelector(".timeCard");

    if (!hasDate && !hasTime) {
      const placeholder = document.querySelector(".placeholderCard");
      placeholder.remove();
    }
    if (!hasDate) {
      const dateCard = document.createElement("span");
      dateCard.classList.add("dateCard");
      dateCard.textContent = `${day} ${date.toLocaleString("default", {
        month: "short",
      })}`;
      dateCard.style.backgroundColor = "aquamarine";
      dateCard.style.color = "black";
      DOM.dateDisplayCard.appendChild(dateCard.cloneNode(true));
      DOM.chosenDate.appendChild(dateCard);
      DOM.dateDisplay.innerHTML = "";
      const img = document.createElement("img");
      img.src = calendar;
      img.style.width = "15px";
      img.style.marginRight = "5px";

      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      const text = document.createElement("span");
      text.textContent = `Today`;
      text.style.display = "inline-block";
      DOM.dateDisplay.style.color = "green";
      const dateCont = document.querySelector(".date-cont");
      dateCont.style.borderColor = "green";

      DOM.dateDisplay.appendChild(img);
      DOM.dateDisplay.appendChild(text);

      const clearBtn = document.createElement("span");
      clearBtn.textContent = " ×";
      clearBtn.style.cursor = "pointer";
      clearBtn.style.marginLeft = "8px";
      clearBtn.style.color = "gray";

      DOM.dateDisplay.appendChild(clearBtn);

      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        DOM.dateDisplay.innerHTML = "";
        const date = new Date();
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });

        DOM.dateDisplayCard.querySelector(".dateCard")?.remove();
        DOM.chosenDate.querySelector(".dateCard")?.remove();
        DOM.dateDisplayCard.querySelector(".timeCard")?.remove();
        DOM.chosenDate.querySelector(".timeCard")?.remove();

        const hasDate = DOM.chosenDate.querySelector(".dateCard");
        const hasTime = DOM.chosenDate.querySelector(".timeCard");

        if (!hasDate && !hasTime) {
          const placeholder = document.createElement("span");
          placeholder.classList.add("placeholderCard");
          placeholder.textContent = `${day} ${month}`;
          placeholder.style.color = "gray";
          placeholder.style.backgroundColor = "#eee";
          DOM.chosenDate.appendChild(placeholder);
        }

        dateCont.style.borderColor = "rgb(189, 184, 184)";

        // Create icon
        const img = document.createElement("img");
        img.src = calendar;
        img.style.width = "15px";
        img.style.marginRight = "5px";

        // Create span text
        const text = document.createElement("span");
        text.textContent = "Date";
        text.style.color = "gray";
        text.style.display = "inline-block";
        DOM.dateDisplay.appendChild(img);
        DOM.dateDisplay.appendChild(text);
        document.querySelectorAll(".dateCard").forEach((card) => {
          card.remove();
        });
      });
    }
    if (card) {
      const clone = card.cloneNode(true);
      DOM.dateDisplayCard.appendChild(card);
      DOM.chosenDate.appendChild(clone);
    }

    DOM.timeDisplay.classList.add("hidden");
  });
}
function showTime(time) {
  const timeCard = document.createElement("span");
  timeCard.classList.add("timeCard");
  timeCard.textContent = `${time}`;

  if (!DOM.timeBtn.querySelector(".clearTimeBtn")) {
    const clearBtn = document.createElement("span");
    clearBtn.classList.add("clearTimeBtn");
    clearBtn.textContent = " ×";
    clearBtn.style.fontSize = "18px";
    clearBtn.style.cursor = "pointer";
    clearBtn.style.marginLeft = "20px";
    clearBtn.style.color = "gray";

    clearBtn.addEventListener("click", () => {
      const now = new Date();
      const day = now.getDate();
      const month = now.toLocaleString("default", { month: "short" });
      // Remove time cards from both containers
      DOM.dateDisplayCard.querySelector(".timeCard")?.remove();
      DOM.chosenDate.querySelector(".timeCard")?.remove();

      const hasDate = DOM.chosenDate.querySelector(".dateCard");
      const hasTime = DOM.chosenDate.querySelector(".timeCard");

      if (!hasDate && !hasTime) {
        const placeholder = document.createElement("span");
        placeholder.classList.add("placeholderCard");
        placeholder.textContent = `${day} ${month}`;
        placeholder.style.color = "gray";
        placeholder.style.backgroundColor = "#eee";
        DOM.chosenDate.appendChild(placeholder);
      }
      DOM.showTimeTitle.innerHTML = `Time`;
      DOM.showTimeTitle.style.color = "gray";
      clearBtn.remove();
    });

    DOM.timeBtn.appendChild(clearBtn);
  }

  return timeCard;
}

function createDatePicker(datepicker) {
  const display = document.querySelector("#date-picker");
  const today = new Date();
  let day;
  let month;
  const picker = datepicker(display, {
    inline: true,
    minDate: today,
    defaultDate: today,
    highlightedDates: [today],
    formatter: (input, date, instance) => {
      day = String(date.getDate()).padStart(2, "0");
      month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      input.value = `${day}/${month}/${year}`;
      DOM.hiddenDate.value = value !== "No Date" ? value : "";

      const dateCard = document.createElement("span");
      dateCard.classList.add("dateCard");
      dateCard.textContent = `${day} ${date.toLocaleString("default", {
        month: "short",
      })}`;
      dateCard.style.backgroundColor = "rgb(185, 54, 54)";
      dateCard.style.color = "white";

      const hasDate = DOM.chosenDate.querySelector(".dateCard");
      const hasTime = DOM.chosenDate.querySelector(".timeCard");

      if (!hasDate && !hasTime) {
        const placeholder = document.querySelector(".placeholderCard");
        placeholder.remove();
      } else if (hasDate) {
        DOM.chosenDate.querySelector(".dateCard")?.remove();
        DOM.dateDisplayCard.querySelector(".dateCard")?.remove();
      }
      DOM.dateDisplayCard.appendChild(dateCard.cloneNode(true));
      DOM.chosenDate.appendChild(dateCard);

      DOM.dateDisplay.innerHTML = "";
      const img = document.createElement("img");
      img.src = calendar;
      img.style.width = "15px";
      img.style.marginRight = "5px";

      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      const text = document.createElement("span");
      text.textContent = dayName;
      text.style.display = "inline-block";
      DOM.dateDisplay.style.color = "rgb(185, 54, 54)";
      const dateCont = document.querySelector(".date-cont");
      dateCont.style.borderColor = "rgb(185, 54, 54)";

      DOM.dateDisplay.appendChild(img);
      DOM.dateDisplay.appendChild(text);

      const clearBtn = document.createElement("span");
      clearBtn.textContent = " ×";
      clearBtn.style.cursor = "pointer";
      clearBtn.style.marginLeft = "8px";
      clearBtn.style.color = "gray";

      DOM.dateDisplay.appendChild(clearBtn);

      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        DOM.dateDisplay.innerHTML = "";
        const date = new Date();
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });

        DOM.dateDisplayCard.querySelector(".dateCard")?.remove();
        DOM.chosenDate.querySelector(".dateCard")?.remove();

        const hasDate = DOM.chosenDate.querySelector(".dateCard");
        const hasTime = DOM.chosenDate.querySelector(".timeCard");

        if (!hasDate && !hasTime) {
          const placeholder = document.createElement("span");
          placeholder.classList.add("placeholderCard");
          placeholder.textContent = `${day} ${month}`;
          placeholder.style.color = "gray";
          placeholder.style.backgroundColor = "#eee";
          DOM.chosenDate.appendChild(placeholder);
        }

        dateCont.style.borderColor = "rgb(189, 184, 184)";

        // Create icon
        const img = document.createElement("img");
        img.src = calendar;
        img.style.width = "15px";
        img.style.marginRight = "5px";

        // Create span text
        const text = document.createElement("span");
        text.textContent = "Date";
        text.style.color = "gray";
        text.style.display = "inline-block";
        DOM.dateDisplay.appendChild(img);
        DOM.dateDisplay.appendChild(text);
        document.querySelectorAll(".dateCard").forEach((card) => {
          card.remove();
        });
      });
    },
  });
}
displayForm();

let taskList = [];
function formSubmit() {
  DOMUI.form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = DOMUI.titleInput.value;
    const description = DOMUI.descriptionInput.value;
    const date = DOMUI.dueDateInput.value;
    const time = DOMUI.time.value;
    const priority = DOMUI.priorityInput.value;

    const newTask = new Task(title, description, date, time, priority);
    taskList.push(newTask);

    let html = "";
    for (let i = 0; i < taskList.length; i++) {
      html += `
    <li class="task-item">
    <div class="tasktitle"">
      <div class="task-index">${i + 1}. </div>
      <div class="task-title">${taskList[i].title}</div>
    </div>
      <div class="task-description">${taskList[i].description}</div>
      <div class="task-datetime">
        <div class="task-date">
        <img src="../im">
        ${taskList[i].date}</div>
        <div class="task-time">${taskList[i].time}</div>
      </div>
        <div class="task-meta">Priority: ${taskList[i].priority}</div>
    </li>
    <hr/>
  `;
    }
    DOMUI.taskList.innerHTML = html;
    formReset();
    DOM.form.classList.toggle("hidden");
    DOM.add_task_cont.classList.toggle("hidden");
  });
}
formSubmit();

function formReset() {
  DOM.form.reset();

  // Reset priority
  DOM.hiddenInput.value = "";
  DOM.selected.innerHTML = "";

  const img = document.createElement("img");
  img.src = flagIcon;
  img.style.width = "15px";
  img.style.marginRight = "5px";

  const text = document.createElement("span");
  text.textContent = "Priority";
  text.style.color = "gray";
  text.style.display = "inline-block";

  DOM.selected.appendChild(img);
  DOM.selected.appendChild(text);
  DOM.customSelect.style.borderColor = "rgb(189, 184, 184)";
  DOM.selected.style.color = "gray";

  //Reset day
  DOM.dateDisplay.innerHTML = "";
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const dateCont = document.querySelector(".date-cont");
  DOM.dateDisplayCard.querySelector(".dateCard")?.remove();
  DOM.chosenDate.querySelector(".dateCard")?.remove();
  DOM.dateDisplayCard.querySelector(".timeCard")?.remove();
  DOM.chosenDate.querySelector(".timeCard")?.remove();

  const hasDate = DOM.chosenDate.querySelector(".dateCard");
  const hasTime = DOM.chosenDate.querySelector(".timeCard");

  if (!hasDate && !hasTime) {
    const placeholder = document.createElement("span");
    placeholder.classList.add("placeholderCard");
    placeholder.textContent = `${day} ${month}`;
    placeholder.style.color = "gray";
    placeholder.style.backgroundColor = "#eee";
    DOM.chosenDate.appendChild(placeholder);
  }

  const img2 = document.createElement("img");
  img2.src = calendar;
  img2.style.width = "15px";
  img2.style.marginRight = "5px";

  const text2 = document.createElement("span");
  text2.textContent = "Date";
  text2.style.color = "gray";
  text2.style.display = "inline-block";

  DOM.dateDisplay.appendChild(img2);
  DOM.dateDisplay.appendChild(text2);
  dateCont.style.borderColor = "rgb(189, 184, 184)";
  DOM.showTimeTitle.innerHTML = "";
  DOM.showTimeTitle.innerHTML = `Time`;
  DOM.showTimeTitle.style.color = "gray";
  DOM.timeBtn.querySelector(".clearTimeBtn")?.remove();
}
