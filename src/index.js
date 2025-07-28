import "./styles.css";
import flagIcon from "../images/flag_1549459.png";
import calendar from "../images/calendar_7173018.png";
import clock from "../images/clock.png";
import trash from "../images/trash_12616431.png";
import pen from "../images/pen_5948978.png";
import inbox from "../images/inbox_8299973.png";
import "js-datepicker/dist/datepicker.min.css";
import Task from "./task.js";
import DOMUI from "./ui.js";
const datepicker = require("js-datepicker");

//get all elements IIFE
const DOM = (() => {
  const mainTitle = document.querySelector(".main");
  const sidebar = document.querySelector(".sidebar");
  const sidebarProjects = document.querySelector(".containerProjects");
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
  const timeInput = document.querySelector("#times");
  const timeBtn = document.querySelector(".timeBTN");
  const showTimeTitle = document.querySelector("#showTime");
  const showProject = document.querySelector(".selectedP");
  const projectDisplay = document.querySelector(".optionsP");
  const hiddenProject = document.querySelector("#project");
  const projectShow = document.querySelector(".projects");
  const taskListsContainer = document.querySelector(".task-list");

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
    showProject,
    projectDisplay,
    hiddenProject,
    projectShow,
    taskListsContainer,
    sidebarProjects,
    mainTitle
  };
})();
let projects = {
  inbox: [],
  work: [],
  education: [],
  personal: [],
};
let previousProject;
function displayForm() {
  DOM.plus.addEventListener("mouseover", () => {
    DOM.add_task.style.color = "var(--redColor)";
  });
  DOM.plus.addEventListener("mouseleave", () => {
    DOM.add_task.style.color = "gray";
  });
  DOM.plus.addEventListener("click", () => { 
    formReset();
    //allProjects(projects);
    DOM.form.classList.toggle("hidden");
    DOM.add_task_cont.classList.toggle("hidden");
    if (!DOM.form.classList.contains("hidden")) {
      showCurrentDate();
    }
  });
  DOM.cancel.addEventListener("click", (e) => {
    e.preventDefault();
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
  addProject();
  displayProjectsSidebar(projects);
}
let reset = false;
function showCurrentDate() {
  if (reset === false) {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    console.log("called");
    const placeHolder = DOM.chosenDate.querySelector(".placeholderCard");
    if (placeHolder === null) {
      console.log("not found");
      const placeholder = document.createElement("span");
      placeholder.classList.add("placeholderCard");
      placeholder.textContent = `${day} ${month}`;
      placeholder.style.color = "gray";
      placeholder.style.backgroundColor = "#eee";
      DOM.chosenDate.appendChild(placeholder);
      console.log("added");
    }
  } else {
    console.log("found");
  }
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
        DOM.hiddenInput.value = "";

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
        const diff = (6 - currentday + 7) % 7;
        date.setDate(date.getDate() + diff);
        dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        dayDisplay.innerHTML = `${dayName}`;
        break;
    }

    item.addEventListener("click", () => {
      const dateCont = document.querySelector(".date-cont");
      DOM.dateDisplay.innerHTML = display.innerHTML;
      const hasDate = DOM.chosenDate.querySelector(".dateCard");
      const hasTime = DOM.chosenDate.querySelector(".timeCard");

      if (!hasDate && !hasTime) {
        DOM.chosenDate.querySelector(".placeholderCard")?.remove();
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
          DOM.hiddenDate.value = "";
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
  DOM.hiddenDate.value = dateCard.textContent;
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

  DOM.saveBtn.addEventListener("click", () => {
    if (document.querySelector("#times").value !== "") {
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
        DOM.hiddenDate.value = dateCard.textContent;
        DOM.dateDisplay.innerHTML = "";
        const img = document.createElement("img");
        img.src = calendar;
        img.style.width = "15px";
        img.style.marginRight = "5px";
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
          DOM.hiddenDate.value = "";

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
    } else {
      console.log("Choose time");
    }
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
      DOM.timeInput.value = "";
      console.log(DOM.timeInput.value);

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
      const dateCard = document.createElement("span");
      dateCard.classList.add("dateCard");
      dateCard.textContent = `${day} ${date.toLocaleString("default", {
        month: "short",
      })}`;
      dateCard.style.backgroundColor = "rgb(185, 54, 54)";
      dateCard.style.color = "white";
      DOM.hiddenDate.value = dateCard.textContent;
      const hasDate = DOM.chosenDate.querySelector(".dateCard");
      const hasTime = DOM.chosenDate.querySelector(".timeCard");

      if (!hasDate && !hasTime) {
        const placeholder = document.querySelector(".placeholderCard");
        placeholder?.remove();
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
        DOM.hiddenDate.value = "";
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

function addProject() {
  DOM.showProject.addEventListener("click", () => {
    DOM.projectDisplay.classList.toggle("hidden");
  });
  DOM.projectDisplay.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", () => {
      const clearBtn = document.createElement("span");
      clearBtn.textContent = "×";
      clearBtn.style.cursor = "pointer";
      clearBtn.style.marginLeft = "8px";
      clearBtn.style.color = "gray";
      DOM.showProject.innerHTML = `${option.innerHTML}`;
      DOM.projectShow.style.border = "solid";
      DOM.projectShow.style.borderColor = "brown";
      DOM.projectShow.style.color = "brown";
      DOM.showProject.appendChild(clearBtn);
      DOM.projectDisplay.classList.toggle("hidden");
      DOM.hiddenProject.value = option.dataset.value;
      console.log(DOM.hiddenProject.value);

      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        DOM.showProject.innerHTML = "";
        DOM.hiddenProject.value = "";

        // Create icon
        const img = document.createElement("img");
        img.src = inbox;
        img.style.width = "15px";
        img.style.marginRight = "5px";

        // Create span text
        const text = document.createElement("span");
        text.textContent = "Inbox";
        text.style.display = "inline-block";

        // Append both
        DOM.showProject.appendChild(img);
        DOM.showProject.appendChild(text);
        DOM.projectShow.style.borderColor = "rgb(189, 184, 184)";
        DOM.projectShow.style.color = "gray";
      });
    });
  });
}
displayForm();

let taskList = [];
let title;
let description;
let date;
let time;
let priority;
let project;

let editProject = false;

function formSubmit() {
  DOMUI.form.addEventListener("submit", (e) => {
    e.preventDefault();

    title = DOMUI.titleInput.value;
    description = DOMUI.descriptionInput.value;
    date = DOMUI.dueDateInput.value || "No date";
    time = DOMUI.time.value || "No time";
    priority = DOMUI.priorityInput.value || "low";
    project = DOMUI.project.value || "inbox";

    if (editingTask !== null) {
      console.log("edittin nowww");
      
      const index = taskList.findIndex((t) => t.id === editingTask);
      
      if (index !== -1) {
        taskList[index] = {
          ...taskList[index], // retain ID and status
          title,
          description,
          date,
          time,
          priority,
          project,
        };
        console.log(taskList[index]);
       if (editProject) {
        const i = taskList.findIndex((y) => y.project === previousProject);
        if (previousProject!== project) {
           projects[previousProject].splice(i, 1);
           projects[project].push(taskList[index]);
        }     
       } 
      }
      displayProject(project);
      editProject = false;
      editingTask = null;
    } else {
      const newTask = new Task(
        title,
        description,
        date,
        time,
        priority,
        project
      );

      projects[project].push(newTask);
      taskList.push(newTask);
       
      //allProjects(projects);
    }

    DOM.form.classList.toggle("hidden");
    DOM.add_task_cont.classList.toggle("hidden");
    //renderList(taskList);
    allProjects(projects);
   
  });
}

function formReset() {
  DOM.form.reset();

  DOM.submit.disabled = true;
  DOM.submit.style.opacity = "50%";
  DOM.submit.style.cursor = "not-allowed";
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

  DOM.dateDisplay.innerHTML = "";
  DOM.hiddenDate.value = "";
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
    const placeHolder = DOM.chosenDate.querySelector(".placeholderCard");
    if (!placeHolder) {
      const placeholder = document.createElement("span");
      placeholder.classList.add("placeholderCard");
      placeholder.textContent = `${day} ${month}`;
      placeholder.style.color = "gray";
      placeholder.style.backgroundColor = "#eee";
      DOM.chosenDate.appendChild(placeholder);
    }
    reset = true;
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

  //reset project
  DOM.hiddenProject.value = "";
  DOM.showProject.innerHTML = "";

  const img3 = document.createElement("img");
  img3.src = inbox;
  img3.style.width = "15px";
  img3.style.marginRight = "5px";

  const text3 = document.createElement("span");
  text3.textContent = "Inbox";
  text3.style.color = "black";
  text3.style.display = "inline-block";

  DOM.showProject.appendChild(img3);
  DOM.showProject.appendChild(text3);
  DOM.projectShow.style.border = "none";
}
let editingTask = null;

function allProjects(projects) {
  DOM.taskListsContainer.innerHTML = "";
  for (const project in projects) {
    DOM.mainTitle.innerHTML = "ALL TASKS";
    const section = document.createElement("div");
    section.classList.add("project-section");
    const title = document.createElement("h3");
    title.textContent = project;
    section.appendChild(title);
    const list = document.createElement("ul");
    section.appendChild(list);
    DOM.taskListsContainer.appendChild(section);
    renderList(projects[project], list, project);

  }
}
function displayProjectsSidebar(projects) {
  for (const project in projects) {
    const link = document.createElement("p");
    link.textContent = project;
    link.classList.add("links");
    DOM.sidebarProjects.appendChild(link);
    link.addEventListener("click", () => {
      if(project==="inbox") {
        allProjects(projects);
      } else {
        displayProject(project);
      }    
    })
  }
}

function displayProject(project) {
  DOM.taskListsContainer.innerHTML="";
  DOM.mainTitle.innerHTML = `${project}`;
    const section = document.createElement("div");
    section.classList.add("project-section");
    const list = document.createElement("ul");
    section.appendChild(list);
    DOM.taskListsContainer.appendChild(section);
  
    renderList(projects[project], list, project);
  
}
function renderList(sentList, list, project) {
  const display = document.querySelector(".completeCount");
  let count = 0;
  for(let i = 0; i < sentList.length; i++) {
    console.log(sentList[i]);
  }

  list.innerHTML = "";
  if (sentList.length === 0) {
    const p = document.createElement("p");
    p.innerHTML = "No tasks added yet";
    p.style.fontSize = "15px";
    p.style.color = "brown";
    DOM.taskListsContainer.appendChild(p);
    return;
  }

  for (let i = 0; i < sentList.length; i++) {
    const task = sentList[i];
    const hr = document.createElement("hr");
    if (i !== 0) {
      //DOMUI.taskList.appendChild(hr);
     list.appendChild(hr);
    }
    const li = document.createElement("li");
    li.classList.add("task-item");

    const taskTitleDiv = document.createElement("div");
    taskTitleDiv.classList.add("tasktitle");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        task.status = "completed";
        count++;
        display.innerHTML = "";
        display.innerHTML = `${count} tasks completed.`;
        titleDiv.classList.add("completed");
      } else {
        task.status = "not completed";
        count--;
        display.innerHTML = "";
        display.innerHTML = `${count} tasks completed.`;
        titleDiv.classList.remove("completed");
      }
    });

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("task-title");
    titleDiv.textContent = task.title;

    // Append index and title to taskTitleDiv
    taskTitleDiv.appendChild(checkbox);
    taskTitleDiv.appendChild(titleDiv);

    // Description div
    const descDiv = document.createElement("div");
    descDiv.classList.add("task-description");
    descDiv.textContent = task.description;

    // Date and time container
    const dateTimeDiv = document.createElement("div");
    dateTimeDiv.classList.add("task-datetime");

    // Date div with icon
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("task-date");

    const calendarImg = document.createElement("img");
    calendarImg.src = calendar;
    calendarImg.style.width = "13px";
    calendarImg.style.marginRight = "6px";

    dateDiv.appendChild(calendarImg);
    dateDiv.appendChild(document.createTextNode(task.date));
    console.log(task.date);

    // Time div
    const timeDiv = document.createElement("div");
    const clockImg = document.createElement("img");
    clockImg.src = clock;
    clockImg.style.width = "13px";
    clockImg.style.marginRight = "6px";
    timeDiv.classList.add("task-time");
    timeDiv.appendChild(clockImg);
    timeDiv.appendChild(document.createTextNode(task.time));

    // Append date and time to dateTimeDiv
    dateTimeDiv.appendChild(dateDiv);
    dateTimeDiv.appendChild(timeDiv);

    // Priority div
    const priorityDiv = document.createElement("div");
    priorityDiv.classList.add("task-priority");
    priorityDiv.textContent = task.priority;
    console.log(task.priority);

    // Project div
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("task-project");
    projectDiv.textContent = task.project;
    console.log(task.project);

    //delete div
    const deletes = document.createElement("div");
    deletes.classList.add("editsContainer");
    const trashImg = document.createElement("img");
    trashImg.src = trash;
    trashImg.style.width = "17px";
    trashImg.style.marginRight = "6px";
    deletes.appendChild(trashImg);

    const editImg = document.createElement("img");
    editImg.src = pen;
    editImg.style.width = "17px";
    editImg.style.marginRight = "6px";
    deletes.appendChild(editImg);

    const displayCont = document.createElement("div");
    displayCont.classList.add("listDisplayContainer");
    const editCont = document.createElement("div");
    displayCont.appendChild(taskTitleDiv);
    displayCont.appendChild(descDiv);
    displayCont.appendChild(dateTimeDiv);
    displayCont.appendChild(priorityDiv);
    displayCont.appendChild(projectDiv);
    editCont.appendChild(deletes);

    li.appendChild(displayCont);
    li.appendChild(editCont);
    list.appendChild(li);

    //DOMUI.taskList.appendChild(li);

    trashImg.addEventListener("click", () => {
      console.log("delete this");
      sentList.splice(i, 1);
      taskList.splice(i, 1);
      //renderList(sentList, list);
      displayProject(project);
      allProjects(projects);
    });

    editImg.addEventListener("click", () => {
      editingTask = task.id;
      previousProject = task.project;
      DOM.form.classList.toggle("hidden");
      DOM.form.classList.add("edit");
      console.log("editting only");
      DOM.showProject.addEventListener("click", () =>{
        console.log("editting project");
        editProject = true;
      })
      DOM.add_task_cont.classList.toggle("hidden");
    });
  }
}

formSubmit();
