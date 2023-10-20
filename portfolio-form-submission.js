const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let expItemIndex = 1;
let workExpList = [];

window.addEventListener("load", (event) => {
  // localStorage.clear();

  setDateLimits();
  fetchUpdatedData();
});

function setDateLimits() {
  const [today] = new Date().toISOString().split("T");
  if (
    document.getElementById("end-date") &&
    document.getElementById("start-date")
  ) {
    document.getElementById("end-date").max = today;
    document.getElementById("start-date").max = today;
  }
}
function submitFunc(event) {
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
function checkboxStateChanged() {
  document.querySelector("#checkbox").checked
    ? (document.getElementById("end-date").disabled = true)
    : (document.getElementById("end-date").disabled = false);

  if (document.querySelector("#checkbox-edit")) {
    document.querySelector("#checkbox-edit").checked
      ? (document.getElementById("end-date-edit").disabled = true)
      : (document.getElementById("end-date-edit").disabled = false);
  }
}
function setMinDate() {
  document.getElementById("end-date").min =
    document.getElementById("start-date").value;
}
function showExpForm() {
  document.querySelector(".work-exp-form").style.display = "flex";
  document.querySelector(".add-exp").style.display = "none";
}
function validateForm(event) {
  event.preventDefault();
  if (
    !document.getElementById("end-date").disabled &&
    Date.parse(document.getElementById("start-date").value) >=
      Date.parse(document.getElementById("end-date").value)
  ) {
    alert("End date should be greater than Start date");
    document.getElementById("EndDate").value = "";
  } else if (document.getElementById("description").value.trim().length === 0) {
    document.querySelector(".alert-text").style.display = "block";
    document.getElementById("description").focus();
  } else {
    document.querySelector(".alert-text").style.display = "none";
    addWorkExpToList(event);
  }
}

function addWorkExpToList(event) {
  event.preventDefault();

  let companyName = document.getElementById("company-name").value;
  let startDate = document.getElementById("start-date").value;

  let endDate = "";
  if (document.querySelector(".checkbox").checked) {
    endDate = "Present";
  } else {
    endDate = new Date(document.getElementById("end-date").value);
  }

  let jobDescription = document.getElementById("description").value;

  workExpList.push({
    id: expItemIndex,
    companyName: companyName,
    startDate: startDate,
    endDate: endDate,
    description: jobDescription,
  });

  setUpdatedData(workExpList);

  showPersistedData([
    {
      id: expItemIndex,
      companyName: companyName,
      startDate: startDate,
      endDate: endDate,
      description: jobDescription,
    },
  ]);

  resetForm();

  document.querySelector(".work-exp-form").style.display = "none";
  document.querySelector(".add-exp").style.display = "block";
  expItemIndex += 1;
}

function setUpdatedData(expList) {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("work-exp", JSON.stringify(expList));
    } catch (error) {
      if (error == QUOTA_EXCEEDED_ERR) {
        alert("Local storage quota exceeded!");
      }
    }
  } else {
    alert("Local Storage is not supported in this environment.");
  }
}

function fetchUpdatedData() {
  if (typeof localStorage !== "undefined") {
    try {
      if (JSON.parse(localStorage.getItem("work-exp")) != null) {
        let newData = JSON.parse(localStorage.getItem("work-exp"));
        const mergedSet = new Set(
          [...workExpList, ...newData].map((item) => JSON.stringify(item))
        );
        const mergedArray = Array.from(mergedSet).map((item) =>
          JSON.parse(item)
        );
        workExpList = mergedArray;
        expItemIndex = workExpList[workExpList.length - 1].id + 1;
      }
      showPersistedData(workExpList);
    } catch (error) {
      if (error == QUOTA_EXCEEDED_ERR) {
        alert("Local storage quota exceeded!");
      }
    }
  } else {
    alert("Local Storage is not supported in this environment.");
  }
}
function resetForm() {
  document.getElementById("company-name").value = "";
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").removeAttribute("min");
  document.getElementById("end-date").value = "";
  document.getElementById("end-date").disabled = false;
  document.querySelector("#checkbox").checked = false;
  document.getElementById("description").value = "";
}

function showPersistedData(expData) {
  for (let i = 0; i < expData.length; i++) {
    let workExpItem = document.createElement("div");
    workExpItem.className = "exp-item";
    workExpItem.id = expData[i].id;

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    const imgEdit = document.createElement("img");
    imgEdit.src = "res/ic_edit.png";
    editButton.appendChild(imgEdit);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    const imgDelete = document.createElement("img");
    imgDelete.src = "res/ic_delete.png";
    deleteButton.appendChild(imgDelete);

    let headerEvents = document.createElement("div");
    headerEvents.className = "header-events";
    headerEvents.appendChild(editButton);
    headerEvents.appendChild(deleteButton);

    let companyName = document.createElement("h4");

    let companyNameLabel = document.createElement("label");
    companyNameLabel.innerHTML = "Company Name:";
    companyNameLabel.style.fontSize = "small";
    companyNameLabel.style.fontWeight = "600";

    let editableCompanyName = document.createElement("input");
    editableCompanyName.id = "edit-company-name";

    let companyDiv = document.createElement("div");
    companyDiv.appendChild(companyNameLabel);
    companyDiv.appendChild(editableCompanyName);

    companyDiv.style.display = "flex";
    companyDiv.style.flexDirection = "column";
    companyDiv.style.gap = "10px";


    let jobDuration = document.createElement("h5");
    jobDuration.className = "exp-content";

    var dateSection = document.createElement("div");
    dateSection.className = "date-section-editable";

    var labelsDiv = document.createElement("div");
    labelsDiv.className = "date-section-labels";

    var startDateLabel = document.createElement("label");
    startDateLabel.textContent = "Start Date:";

    var endDateLabel = document.createElement("label");
    endDateLabel.textContent = "End Date:";

    var emptyLabel = document.createElement("label");

    labelsDiv.appendChild(startDateLabel);
    labelsDiv.appendChild(endDateLabel);
    labelsDiv.appendChild(emptyLabel);

    var valuesDiv = document.createElement("div");
    valuesDiv.className = "date-section-values-editable";

    var startDateInput = document.createElement("input");
    startDateInput.type = "date";
    startDateInput.id = "start-date-edit";
    startDateInput.valueAsDate = new Date(expData[i].startDate);
    startDateInput.required = true;

    var endDateInput = document.createElement("input");
    endDateInput.type = "date";
    endDateInput.id = "end-date-edit";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.id = "checkbox-edit";
    checkbox.onchange = checkboxStateChanged; 
    if (expData[i].endDate === "Present") {
      checkbox.checked = true;
      endDateInput.disabled = true;
    } else {
      endDateInput.valueAsDate = new Date(expData[i].endDate);
      endDateInput.required = true;
      endDateInput.onclick = setMinDate; 
    }

    var checkboxDiv = document.createElement("div");
    checkboxDiv.className = "checkbox-section";

    var checkboxLabel = document.createElement("label");
    checkboxLabel.className = "label-employer";
    checkboxLabel.textContent = "Current Employer";

    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(checkboxLabel);

    valuesDiv.appendChild(startDateInput);
    valuesDiv.appendChild(endDateInput);
    valuesDiv.appendChild(checkboxDiv);

    dateSection.appendChild(labelsDiv);
    dateSection.appendChild(valuesDiv);


    setDateLimits();
    dateSection.style.marginTop = "10px";

    let jobDescriptionDiv = document.createElement("div");
    jobDescriptionDiv.style.gap = "10px";

    let jobDescription = document.createElement("p");
    jobDescription.className = "exp-content";

    let jobDescriptionLabel = document.createElement("label");
    jobDescriptionLabel.innerHTML = "Job Description:";

    jobDescriptionLabel.style.fontSize = "small";
    jobDescriptionLabel.style.fontWeight = "600";

    let editableJobDescription = document.createElement("textarea");
    editableJobDescription.style.marginTop = "10px";
    editableJobDescription.innerHTML = expData[i].description;

    jobDescriptionDiv.appendChild(jobDescriptionLabel);
    jobDescriptionDiv.appendChild(editableJobDescription);

    companyDiv.style.display = "none";
    dateSection.style.display = "none";
    jobDescriptionDiv.style.display = "none";

    companyName.innerHTML = (i + 1).toString() + ". " + expData[i].companyName;
    editableCompanyName.value = expData[i].companyName;

    let startDate = new Date(expData[i].startDate);
    startDate = startDate.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    let endDate = "";

    if (expData[i].endDate === "Present") {
      endDate = "Present";
    } else {
      endDate = new Date(expData[i].endDate);
      endDate = endDate.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    jobDuration.innerHTML = startDate + " - " + endDate;
    jobDescription.innerHTML = expData[i].description;

    workExpItem.appendChild(companyName);
    workExpItem.appendChild(companyDiv);
    workExpItem.appendChild(jobDuration);
    workExpItem.appendChild(dateSection);

    workExpItem.appendChild(jobDescription);
    workExpItem.appendChild(jobDescriptionDiv);

    editButton.addEventListener("click", function (e) {
      editItem(e);
    });
    deleteButton.addEventListener("click", function (e) {
      deleteItem(e);
    });

    if (document.querySelector(".exp-list")) {
      workExpItem.insertBefore(headerEvents, workExpItem.firstChild);
      document.querySelector(".exp-list").appendChild(workExpItem);
    } else {
      document.querySelector(".home-exp-list").appendChild(workExpItem);
    }
  }
}

function editItem(e) {}
function deleteItem(e) {
  const selectedItem = event.target.closest(".exp-item");
  selectedItem.remove();

  const newExpList =workExpList.filter(
    (item) => item.id != selectedItem.id
  );
  workExpList = newExpList;
  setUpdatedData(workExpList);
}
