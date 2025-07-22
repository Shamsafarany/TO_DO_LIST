import "./styles.css";
import flagIcon from "../images/flag_1549459.png";
import calendar from "../images/calendar_7173018.png";
class Task {
  constructor(
    id = crypto.randomUUID(),
    title = "",
    description = "",
    dueDate = null,
    priority = "low",
    status = "not complete"
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
    this._status = status;
  }
  get title() {
    return this._title;
  }
  set title(title) {
    if (title.length > 0) {
      this._title = title;
    } else {
      console.log("Enter task title");
    }
  }

  get description() {
    return this._description;
  }
  set description(description) {
    this._description = description;
  }

  get dueDate() {
    return this._dueDate;
  }
  set dueDate(dueDate) {
    this._dueDate = dueDate;
  }

  get priority() {
    return this._priority;
  }
  set priority(priority) {
    this._priority = priority;
  }
  get status() {
    return this._status;
  }
  set status(status) {
    if (status === "complete" || status === "not complete") {
      this._status = status;
    } else {
      console.log("Invalid input");
    }
  }
  toggleStatus() {
    this._status = this._status === "complete" ? "not complete" : "complete";
  }
}

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
      });
    });
  });
}
displayForm();

let mainTasks = [];

function displayDate() {
  DOM.dateDisplay.addEventListener("click", () => {
    DOM.dateOptions.classList.toggle("hidden");
  });

  DOM.dateList.forEach((item) => {
    item.addEventListener("click", () => {
      const display = item.querySelector(".display");
      const dateCont = document.querySelector(".date-cont");
      const choice = display.querySelector(".choices");
      const value = choice.textContent.trim();
      DOM.hiddenDate.value = value !== "No Date" ? value : "";

      DOM.dateDisplay.innerHTML = display.innerHTML;
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

          // Append both
          DOM.dateDisplay.appendChild(img);
          DOM.dateDisplay.appendChild(text);
          dateCont.style.borderColor = "gray";

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
          dateCont.style.borderColor = "gray";

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
        });
      }
      DOM.dateOptions.classList.toggle("hidden");
    });
  });
}
