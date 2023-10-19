const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let expItemNumber = 1;
function SubmitFunc(event) {
  event.preventDefault();
  let userName = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let invalidNameAlert = document.getElementById("alert-name");
  let invalidEmailAlert = document.getElementById("alert-email");
  let invalidPasswordAlert = document.getElementById("alert-password");

  let successMsg = document.getElementById("success-msg");

  let isUserNameValid,
    isEmailValid,
    isPasswordValid = false;

  if (userName.value.length == 0) {
    userName.style.borderColor = "red";
    invalidNameAlert.style.display = "block";
    isUserNameValid = false;
  } else {
    userName.style.borderColor = "grey";
    invalidNameAlert.style.display = "none";
    isUserNameValid = true;
  }

  if (regex.test(email.value) == false) {
    email.style.borderColor = "red";
    invalidEmailAlert.style.display = "block";
    isEmailValid = false;
  } else {
    email.style.borderColor = "grey";
    invalidEmailAlert.style.display = "none";
    isEmailValid = true;
  }

  if (password.value.length <= 7) {
    password.style.borderColor = "red";
    invalidPasswordAlert.style.display = "block";
    isPasswordValid = false;
  } else {
    password.style.borderColor = "grey";
    invalidPasswordAlert.style.display = "none";
    isPasswordValid = true;
  }

  if (isUserNameValid && isEmailValid && isPasswordValid) {
    successMsg.style.display = "block";
    successMsg.scrollIntoView({ behavior: "smooth" });
  }
}

function closeForm(event) {
  event.preventDefault();
  resetForm();
  document.querySelector(".work-exp-form").style.display = "none";
  document.querySelector(".add-exp").style.display = "block";
}
function ShowExpForm() {
  document.querySelector(".work-exp-form").style.display = "flex";
  document.querySelector(".add-exp").style.display = "none";
}
function ValidateForm(event) {
  event.preventDefault();
  if (document.getElementById("description").value.trim().length === 0) {
    document.querySelector(".alert-text").style.display = "block";
    document.getElementById("description").focus();
  } else {
    document.querySelector(".alert-text").style.display = "none";
    AddWorkExpToList(event);
  }
}

function AddWorkExpToList(event) {
  event.preventDefault();

  let workExpItem = document.createElement("div");
  workExpItem.className = "exp-item";

  let companyName = document.createElement("h4");
  let jobDuration = document.createElement("h5");
  jobDuration.className = "exp-content";
  let jobDescription = document.createElement("p");
  jobDescription.className = "exp-content";

  companyName.textContent =
    expItemNumber + ". " + document.getElementById("company-name").value;
  let startDate = new Date(document.getElementById("start-date").value);
  startDate = startDate.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  let endDate = new Date(document.getElementById("end-date").value);
  endDate = endDate.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  jobDuration.textContent = startDate + " - " + endDate;
  jobDescription.textContent = document.getElementById("description").value;

  workExpItem.appendChild(companyName);
  workExpItem.appendChild(jobDuration);
  workExpItem.appendChild(jobDescription);
  document.querySelector(".exp-list").appendChild(workExpItem);

  resetForm();
  document.querySelector(".work-exp-form").style.display = "none";
  document.querySelector(".add-exp").style.display = "block";
  expItemNumber += 1;
}
function resetForm() {
  document.getElementById("company-name").value = "";
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").value = "";
  document.getElementById("description").value = "";
}
