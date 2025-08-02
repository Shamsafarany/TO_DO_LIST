export default class Task {
  constructor(
    title = "",
    description = "",
    date = "",
    time = "",
    priority = "low",
    project = "inbox",
    status="not complete"
  ) {
    this._id = crypto.randomUUID();
    this._title = title;
    this._description = description;
    this._date = date;
    this._time = time;
    this._priority = priority;
    this._project = project;
    this._status = status;
  }
  get id(){
    return this._id;
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

  get date() {
    return this._date;
  }
  set date(date) {
    this._date = date;
  }
  get time() {
    return this._time;
  }
  set time(time) {
    this._time = time;
  }

  get priority() {
    return this._priority;
  }
  set priority(priority) {
    this._priority = priority;
  }

  get project(){
    return this._project;
  }
  set project(project) {
    this._project = project;
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

}
