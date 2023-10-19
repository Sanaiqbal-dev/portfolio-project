const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let expItemIndex = 1;
let workExpList = [];

window.addEventListener("load", (event) => {

  
  if (JSON.parse(localStorage.getItem("work-exp")) != null) {
    workExpList = JSON.parse(localStorage.getItem("work-exp"));
    expItemIndex = workExpList.length + 1;
  }

  ShowPersistedData();
});

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
  document.querySelector(".work-exp-form").style.display = "none";
  document.querySelector(".add-exp").style.display = "block";
}
function ShowExpForm() {
  document.querySelector(".work-exp-form").style.display = "flex";
  document.querySelector(".add-exp").style.display = "none";
}

function AddWorkExpToList(event) {
  event.preventDefault();

  let companyName =document.getElementById("company-name").value;
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

  let jobDuration = startDate + " - " + endDate;
  let jobDescription = document.getElementById("description").value;

  workExpList.push({
    id:expItemIndex,
    companyName: companyName,
    duration: jobDuration,
    description: jobDescription,
  });

  localStorage.setItem("work-exp", JSON.stringify(workExpList));

  resetForm();

  document.querySelector(".work-exp-form").style.display = "none";
  document.querySelector(".add-exp").style.display = "block";
  expItemIndex += 1;

  if (JSON.parse(localStorage.getItem("work-exp")) != null) {
    workExpList = JSON.parse(localStorage.getItem("work-exp"));
    expItemIndex = workExpList.length + 1;
  }

  ShowPersistedData();
}




function resetForm() {
  document.getElementById("company-name").value = "";
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").value = "";
  document.getElementById("description").value = "";
}


function ShowPersistedData() {
  // document.querySelector(".exp-list").innerHTML("");
  for (let i = 0; i < workExpList.length; i++) {
    let workExpItem = document.createElement("div");
    workExpItem.className = "exp-item";

    
    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    const imgEdit = document.createElement("img");
    imgEdit.src = "res/ic_edit.png";
    editButton.appendChild(imgEdit);
    editButton.addEventListener("click", editItem(event));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    const imgDelete = document.createElement("img");
    imgDelete.src = "res/ic_delete.png";
    deleteButton.appendChild(imgDelete);
    deleteButton.addEventListener("click", deleteItem);

    let headerEvents = document.createElement("div");
    headerEvents.className = "header-events";

    headerEvents.appendChild(editButton);
    headerEvents.appendChild(deleteButton);

    let companyName = document.createElement("h4");
    let jobDuration = document.createElement("h5");
    jobDuration.className = "exp-content";
    let jobDescription = document.createElement("p");
    jobDescription.className = "exp-content";

    companyName.innerHTML = workExpList[i].id + ". " +  workExpList[i].companyName;
    jobDuration.innerHTML = workExpList[i].duration;
    jobDescription.innerHTML = workExpList[i].description;

    workExpItem.appendChild(headerEvents);
    workExpItem.appendChild(companyName);
    workExpItem.appendChild(jobDuration);
    workExpItem.appendChild(jobDescription);
    document.querySelector(".exp-list").appendChild(workExpItem);
  }
}

function editItem() {}
function deleteItem() {}
