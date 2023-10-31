const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let expItemIndex = 1;
let workExpList = [];

window.addEventListener("load", (event) => {
  setDateLimits();
  fetchDataFromDB();
});

const getElement = (idOrClassName) => {
  return document.querySelector(idOrClassName);
};
const setDateLimits = () => {
  const [today] = new Date().toISOString().split("T");
  if (getElement("#end-date") && getElement("#start-date")) {
    getElement("#end-date").max = today;
    getElement("#start-date").max = today;
  }
};
const closeForm = (event) => {
  event.preventDefault();
  resetForm();
  getElement(".work-exp-form").style.display = "none";
  getElement(".add-exp").style.display = "block";
};
const checkboxStateChanged = () => {
  getElement("#checkbox").checked
    ? (getElement("#end-date").disabled = true)
    : (getElement("#end-date").disabled = false);
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
  getElement("#end-date").min = getElement("#start-date").value;
};
const showExpForm = () => {
  getElement(".work-exp-form").style.display = "flex";
  getElement(".add-exp").style.display = "none";
};
const validateForm = (event) => {
  event.preventDefault();
  if (
    !getElement("#end-date").disabled &&
    Date.parse(getElement("#start-date").value) >=
      Date.parse(getElement("#end-date").value)
  ) {
    alert("End date should be greater than Start date");
    getElement("#EndDate").value = "";
  } else if (getElement("#description").value.trim().length === 0) {
    getElement(".alert-text").style.display = "block";
    getElement("#description").focus();
  } else {
    getElement(".alert-text").style.display = "none";
    addWorkExpToList(event);
  }
};
const resetForm = () => {
  getElement("#company-name").value = "";
  getElement("#start-date").value = "";
  getElement("#end-date").removeAttribute("min");
  getElement("#end-date").value = "";
  getElement("#end-date").disabled = false;
  getElement("#checkbox").checked = false;
  getElement("#description").value = "";
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
const showPersistedData = (expData) => {
  if (getElement(".exp-list")) {
    expItemIndex = getElement("#exp-list").childElementCount + 1;
  } else if (getElement(".home-exp-list")) {
    expItemIndex = getElement(".home-exp-list").childElementCount + 1;
  }
  for (let i = 0; i < expData.length; i++) {
    let workExpItem = document.createElement("div");
    workExpItem.className = "exp-item";
    workExpItem.id = expData[i]._id;

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    const imgEdit = document.createElement("img");
    imgEdit.src = "../res/ic_edit.png";
    editButton.appendChild(imgEdit);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    const imgDelete = document.createElement("img");
    imgDelete.className = "img-delete";
    imgDelete.src = "../res/ic_delete.png";

    const deleteLoader = document.createElement("div");
    deleteLoader.className = "loader";
    deleteButton.appendChild(imgDelete);
    deleteButton.appendChild(deleteLoader);

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

    const saveText = document.createElement("p");
    saveText.innerHTML = "SAVE";
    saveText.style.margin = "0px auto 0px auto";
    saveText.style.backgroundColor = "transparent";
    const saveLoader = document.createElement("div");
    saveLoader.className = "loader";
    saveLoader.style.margin = "0px auto";
    saveButton.appendChild(saveText);
    saveButton.appendChild(saveLoader);

    companyDiv.style.display = "none";
    dateSection.style.display = "none";
    jobDescriptionDiv.style.display = "none";
    saveButton.style.display = "none";
    saveButton.type = "submit";

    companyName.innerHTML = expItemIndex + ". " + expData[i].companyName;
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
      if (getElement(".exp-list")) {
        workExpItem.insertBefore(headerEvents, workExpItem.firstChild);
        getElement(".exp-list").appendChild(workExpItem);
      } else {
        getElement(".home-exp-list").appendChild(workExpItem);
      }
    } catch (error) {}

    expItemIndex += 1;
  }
  
  if (workExpList.length > 0) {
    getElement("#search-work-exp").style.display = "block";
    getElement("#exp-list").style.display = "block";
    getElement(".no-data").style.display = "none";
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
      saveButton.querySelector(".loader").style.display = "block";
      saveButton.querySelector("p").style.display = "none";

      updateDataInDB(
        expItem.id,
        companyName,
        startDate,
        endDate,
        jobDescription,
        expItem
      );
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
const addWorkExpToList = (event) => {
  event.preventDefault();

  const saveBtn = getElement("#save-info");
  saveBtn.querySelector("#save-text").style.display = "none";
  saveBtn.querySelector(".loader").style.display = "block";
  let companyName = getElement("#company-name").value;
  let startDate = getElement("#start-date").value;

  let endDate = "";
  if (getElement("#checkbox").checked) {
    endDate = "Present";
  } else {
    endDate = new Date(getElement("#end-date").value);
  }

  let jobDescription = getElement("#description").value;

  const newItem = {
    companyName: companyName,
    startDate: startDate,
    endDate: endDate,
    description: jobDescription,
  };

  addWorkExpItemInDB(newItem);
};
const addWorkExpItemInDB = async (newItem) => {
  await fetch("http://localhost:3000/api/portfolio/experience/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  })
    .then((response) => response.json())
    .then((jsonData) => {
      resetForm();
      getElement(".work-exp-form").style.display = "none";
      getElement(".add-exp").style.display = "block";
      workExpList.push(jsonData);
      showPersistedData([jsonData]);
      window.alert(
        "New work experience item saved in the database successfully."
      );
    })
    .catch((error) => {
      window.alert("Failed to add new work experience item in the database.");
    });

  const saveBtn = getElement("#save-info");
  saveBtn.querySelector("#save-text").style.display = "block";
  saveBtn.querySelector(".loader").style.display = "none";
};
const fetchDataFromDB = async () => {
  await fetch(`http://localhost:3000/api/portfolio/experience/getAll`)
    .then((response) => response.json())
    .then((jsonData) => {
      updateLocalData(jsonData);
    })
    .catch((error) => {
      console.log(error);
      getElement("#preloader").style.display = "none";
    });
};
const updateLocalData = (jsonData) => {
  if (jsonData) {
    workExpList = jsonData;

    expItemIndex = workExpList.length + 1;

    if (workExpList.length > 0) {
      showPersistedData(workExpList);
      getElement("#search-work-exp").style.display = "block";
      getElement("#exp-list").style.display = "block";
    } else {
      getElement(".no-data").style.display = "block";
    }
    getElement("#preloader").style.display = "none";
  }
};
const updateDataInDB = async (
  id,
  companyName,
  startDate,
  endDate,
  jobDescription,
  expItem
) => {
  let updatedItem = {
    companyName: companyName,
    startDate: startDate,
    endDate: endDate,
    description: jobDescription,
  };

  await fetch(`http://localhost:3000/api/portfolio/experience/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedItem),
  })
    .then((response) => response.json())
    .then((jsonData) => {
      resetEditView(expItem, companyName, startDate, endDate, jobDescription);
      window.alert(
        "Work Experience data has been updated successfully in Database."
      );
    })
    .catch((error) => {
      window.alert("Failed to update Work Experience data in Database.");
    });

  expItem
    .querySelector(".save-button-editable")
    .querySelector(".loader").style.display = "none";
  expItem
    .querySelector(".save-button-editable")
    .querySelector("p").style.display = "block";
};
const deleteItem = async (e) => {
  const selectedItem = e.target.closest(".exp-item");
  selectedItem.firstChild.lastChild.firstChild.style.display = "none";
  selectedItem.firstChild.lastChild.lastChild.style.display = "block";

  try {
    const response = await fetch(
      `http://localhost:3000/api/portfolio/experience/delete/${selectedItem.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Request failed.");
    } else {
      const res = await response.json();
      selectedItem.remove();
      window.alert("Selected item is deleted from database successfully.");
    }
  } catch (error) {
    window.alert("Failed to delete selected item from database.");

    selectedItem.firstChild.lastChild.firstChild.style.display = "block";
    selectedItem.firstChild.lastChild.lastChild.style.display = "none";
  }

  const newExpList = workExpList.filter((item) => item._id != selectedItem.id);
  workExpList = newExpList;

  if (workExpList.length < 1) {
    getElement("#search-work-exp").style.display = "none";
    getElement("#exp-list").style.display = "none";
    getElement(".no-data").style.display = "block";
  }
};

const filterWorkExpList = (event) => {
  let searchInput = event.target.value;

  const expItems = document.getElementsByClassName("exp-item");

  for (let i = expItems.length - 1; i >= 0; i--) {
    const itemTitle = expItems[i].querySelector(".company-name").textContent;

    itemTitle && itemTitle.toLowerCase().includes(searchInput.toLowerCase())
      ? (expItems[i].style.display = "block")
      : (expItems[i].style.display = "none");
  }
};
