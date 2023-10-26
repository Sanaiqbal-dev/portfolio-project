const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let expItemIndex = 1;
let workExpList = [];

window.addEventListener("load", (event) => {
  setDateLimits();
  fetchUpdatedData();
  fetchExternalData();
});

const setDateLimits = () => {
  const [today] = new Date().toISOString().split("T");
  if (
    document.getElementById("end-date") &&
    document.getElementById("start-date")
  ) {
    document.getElementById("end-date").max = today;
    document.getElementById("start-date").max = today;
  }
};
const submitFunc = (event) => {
  event.preventDefault();

  let responseMsg = document.getElementById("response-msg");
  let userName = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  let invalidNameAlert = document.getElementById("alert-name");
  let invalidEmailAlert = document.getElementById("alert-email");
  let invalidPasswordAlert = document.getElementById("alert-password");

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
    submitApiRequest(userName.value, email.value, password.value)
      .then(() => {})
      .then(() => {
        responseMsg.style.display = "block";
        responseMsg.innerHTML = "Registration successful. 🙂";
        responseMsg.scrollIntoView({ behavior: "smooth" });

        userName.value = "";
        email.value = "";
        password.value = "";
      })
      .catch(() => {
        responseMsg.style.display = "block";
        responseMsg.innerHTML = "Failed to register. &#128542;";
        responseMsg.scrollIntoView({ behavior: "smooth" });
      });
  }
};

const submitApiRequest = (userName, email, password) => {
  return fetch("https://dummyjson.com/users/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: userName,
      email: email,
      password: password,
    }),
  });
};

const closeForm = (event) => {
  event.preventDefault();
  resetForm();
  document.querySelector(".work-exp-form").style.display = "none";
  document.querySelector(".add-exp").style.display = "block";
};
const checkboxStateChanged = () => {
  document.querySelector("#checkbox").checked
    ? (document.getElementById("end-date").disabled = true)
    : (document.getElementById("end-date").disabled = false);
};

let listCheckboxStateChanged = (e) => {
  let dateSection = e.target.closest(".date-section-values-editable");

  if (dateSection.querySelector("#checkbox-edit")) {
    dateSection.querySelector("#checkbox-edit").checked
      ? (dateSection.querySelector("#end-date-edit").disabled = true)
      : (dateSection.querySelector("#end-date-edit").disabled = false);

    dateSection.querySelector("#end-date-edit").value = "";
  }
};
const setMinDate = () => {
  document.getElementById("end-date").min =
    document.getElementById("start-date").value;
};
const showExpForm = () => {
  document.querySelector(".work-exp-form").style.display = "flex";
  document.querySelector(".add-exp").style.display = "none";
};
const validateForm = (event) => {
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
};

const addWorkExpToList = (event) => {
  event.preventDefault();

  let companyName = document.getElementById("company-name").value;
  let startDate = document.getElementById("start-date").value;

  let endDate = "";
  if (document.querySelector("#checkbox").checked) {
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
};

const setUpdatedData = (expList) => {
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
};

const fetchUpdatedData = () => {
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
        expItemIndex = parseInt(workExpList[workExpList.length - 1].id) + 1;
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
};
const resetForm = () => {
  document.getElementById("company-name").value = "";
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").removeAttribute("min");
  document.getElementById("end-date").value = "";
  document.getElementById("end-date").disabled = false;
  document.querySelector("#checkbox").checked = false;
  document.getElementById("description").value = "";
};

const showPersistedData = (expData) => {
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
    companyName.className = "company-name";

    let companyNameLabel = document.createElement("label");
    companyNameLabel.innerHTML = "Company Name:";
    companyNameLabel.style.fontSize = "small";
    companyNameLabel.style.fontWeight = "600";

    let editableCompanyName = document.createElement("input");
    editableCompanyName.id = "edit-company-name";

    let companyDiv = document.createElement("div");
    companyDiv.className = "company-name-editable";
    companyDiv.appendChild(companyNameLabel);
    companyDiv.appendChild(editableCompanyName);

    companyDiv.style.display = "flex";
    companyDiv.style.flexDirection = "column";
    companyDiv.style.gap = "10px";

    let jobDuration = document.createElement("h5");
    jobDuration.classList.add("exp-content", "job-duration");

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
    startDateInput.required = true;
    startDateInput.valueAsDate = new Date(expData[i].startDate);

    var endDateInput = document.createElement("input");
    endDateInput.type = "date";
    endDateInput.id = "end-date-edit";
    endDateInput.required = true;
    endDateInput.onclick = setMinDate;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.id = "checkbox-edit";

    checkbox.addEventListener("change", function (e) {
      listCheckboxStateChanged(e);
    });

    if (expData[i].endDate === "Present") {
      checkbox.checked = true;
      endDateInput.disabled = true;
    } else {
      endDateInput.valueAsDate = new Date(expData[i].endDate);
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
    jobDescriptionDiv.className = "job-description-editable";

    let jobDescription = document.createElement("p");
    jobDescription.classList.add("exp-content", "job-description");

    let jobDescriptionLabel = document.createElement("label");
    jobDescriptionLabel.innerHTML = "Job Description:";

    jobDescriptionLabel.style.fontSize = "small";
    jobDescriptionLabel.style.fontWeight = "600";

    let editableJobDescription = document.createElement("textarea");
    editableJobDescription.style.marginTop = "10px";
    editableJobDescription.innerHTML = expData[i].description;
    editableJobDescription.id = "edit-job-description";

    let alertJobDescription = document.createElement("p");
    alertJobDescription.innerHTML = "Enter valid job description.";
    alertJobDescription.classList.add("alert-text", "alert-text-edit");

    jobDescriptionDiv.appendChild(jobDescriptionLabel);
    jobDescriptionDiv.appendChild(editableJobDescription);
    jobDescriptionDiv.appendChild(alertJobDescription);

    let saveButton = document.createElement("button");
    saveButton.className = "save-button-editable";
    saveButton.textContent = "SAVE";
    saveButton.style.color = "white";
    saveButton.style.backgroundColor = "green";
    saveButton.style.margin = "20px auto";
    saveButton.style.padding = "5px 40px";

    companyDiv.style.display = "none";
    dateSection.style.display = "none";
    jobDescriptionDiv.style.display = "none";
    saveButton.style.display = "none";
    saveButton.type = "submit";

    companyName.innerHTML = expData[i].id + ". " + expData[i].companyName;
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
    workExpItem.appendChild(saveButton);

    let seperator = document.createElement("hr");
    seperator.className = "seperator";
    workExpItem.appendChild(seperator);

    editButton.addEventListener("click", function (e) {
      editItem(e);
    });
    deleteButton.addEventListener("click", function (e) {
      deleteItem(e);
    });

    try {
      if (document.querySelector(".exp-list")) {
        workExpItem.insertBefore(headerEvents, workExpItem.firstChild);
        document.querySelector(".exp-list").appendChild(workExpItem);
      } else {
        document.querySelector(".home-exp-list").appendChild(workExpItem);
      }
    } catch (error) {}
  }
};

const editItem = (e) => {
  let expItem = e.target.closest(".exp-item");

  let headerEvents = expItem.querySelector(".header-events");
  headerEvents.style.display = "none";
  let companyName = expItem.querySelector(".company-name");
  companyName.style.display = "none";
  let companyNameEditable = expItem.querySelector(".company-name-editable");
  companyNameEditable.style.display = "block";
  let jobDuration = expItem.querySelector(".job-duration");
  jobDuration.style.display = "none";
  let dateSectionEditable = expItem.querySelector(".date-section-editable");
  dateSectionEditable.style.display = "block";
  let jobDescription = expItem.querySelector(".job-description");
  jobDescription.style.display = "none";
  let jobDescriptionEditable = expItem.querySelector(
    ".job-description-editable"
  );
  jobDescriptionEditable.style.display = "block";
  let saveButton = expItem.querySelector(".save-button-editable");
  saveButton.style.display = "block";

  saveButton.addEventListener("click", function (e) {
    e.preventDefault();

    let companyName = expItem.querySelector("#edit-company-name").value;
    let jobDescription = expItem.querySelector("#edit-job-description").value;
    let startDate = new Date(expItem.querySelector("#start-date-edit").value);

    startDate = startDate.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    let endDate = "";
    if (expItem.querySelector("#checkbox-edit").checked) {
      endDate = "Present";
    } else {
      endDate = new Date(expItem.querySelector("#end-date-edit").value);
      endDate = endDate.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    if (isDataValid(expItem, companyName, startDate, endDate, jobDescription)) {
      saveUpdatedData(
        expItem.id,
        companyName,
        startDate,
        endDate,
        jobDescription
      );

      resetEditView(expItem, companyName, startDate, endDate, jobDescription);
    }
  });
};

const isDataValid = (
  expItem,
  companyName,
  startDate,
  endDate,
  jobDescription
) => {
  if (companyName.trim().length === 0) {
    alert("Enter valid company name.");
    expItem.querySelector("#edit-company-name").focus();
    return false;
  } else if (Date.parse(startDate).toString == "NaN") {
    alert("Select correct start date of your job.");
    return false;
  } else if (endDate != "Present") {
    if (Date.parse(endDate).toString() == "NaN") {
      alert("Select correct end date of your job.");
      return false;
    }
  }

  if (Date.parse(startDate) >= Date.parse(endDate)) {
    alert("End date should be greater than Start date");
    return false;
  }

  if (jobDescription.trim().length === 0) {
    alert("Enter valid job description.");
    expItem.querySelector("#edit-job-description").focus();
    return false;
  }

  return true;
};
let saveUpdatedData = (id, companyName, startDate, endDate, jobDescription) => {
  let updatedItem = {
    id: id,
    companyName: companyName,
    startDate: startDate,
    endDate: endDate,
    description: jobDescription,
  };

  let index = workExpList.findIndex((item) => item.id == id.toString());

  if (index != -1) {
    workExpList[index] = updatedItem;
    setUpdatedData(workExpList);
  }
};

let resetEditView = (
  expItem,
  companyNameText,
  startDate,
  endDate,
  jobDescriptionText
) => {
  let collection = Array.from(document.querySelectorAll(".exp-item"));

  let headerEvents = expItem.querySelector(".header-events");
  headerEvents.style.display = "flex";
  let companyName = expItem.querySelector(".company-name");
  companyName.style.display = "block";
  companyName.innerHTML =
    collection.indexOf(expItem) + 1 + ". " + companyNameText;
  let companyNameEditable = expItem.querySelector(".company-name-editable");
  companyNameEditable.style.display = "none";
  let jobDuration = expItem.querySelector(".job-duration");
  jobDuration.style.display = "block";
  jobDuration.innerHTML = startDate + "-" + endDate;
  let dateSectionEditable = expItem.querySelector(".date-section-editable");
  dateSectionEditable.style.display = "none";
  let jobDescription = expItem.querySelector(".job-description");
  jobDescription.style.display = "block";
  jobDescription.innerHTML = jobDescriptionText;
  let jobDescriptionEditable = expItem.querySelector(
    ".job-description-editable"
  );
  jobDescriptionEditable.style.display = "none";
  let saveButton = expItem.querySelector(".save-button-editable");
  saveButton.style.display = "none";
};

const deleteItem = (e) => {
  const selectedItem = e.target.closest(".exp-item");
  selectedItem.remove();

  const newExpList = workExpList.filter((item) => item.id != selectedItem.id);
  workExpList = newExpList;
  setUpdatedData(workExpList);
};

filterWorkExpList = (event) => {
  let searchInput = event.target.value;

  const expItems = document.getElementsByClassName("exp-item");

  for (let i = expItems.length - 1; i >= 0; i--) {
    const itemTitle = expItems[i].querySelector(".company-name").textContent;

    itemTitle && itemTitle.toLowerCase().includes(searchInput.toLowerCase())
      ? (expItems[i].style.display = "block")
      : (expItems[i].style.display = "none");
  }
};

const fetchExternalData = () => {
  const tableDataset = document.querySelector("#info-table");

  if (tableDataset) {
    const tableContainer = document.querySelector(".external-data-div");

    getExternalData()
      .then((response) => response.json())
      .then((json) => {
        const recievedData = json;
        for (const item of recievedData) {
          const tr = tableDataset.insertRow();

          const imageCell = tr.insertCell(0);
          var image_ = document.createElement("img");
          image_.src = item.thumbnailUrl;
          image_.alt = "Alternate text.";
          imageCell.className = "image-cell-data";
          imageCell.appendChild(image_);

          const idCell = tr.insertCell(1);
          idCell.className = "id-cell-data";
          idCell.textContent = item.id;

          const titleCell = tr.insertCell(2);
          titleCell.textContent = item.title;
          titleCell.className = "title-cell-data";

          const urlCell = tr.insertCell(3);
          urlCell.className = "url-cell-data";
          urlCell.textContent = item.url;
        }
        tableContainer.style.display = "flex";
      });
  }
};

const getExternalData = () => {
  return fetch("https://jsonplaceholder.typicode.com/photos?albumId=1");
};
