import "./styles.css";
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

let mainTasks = [];
