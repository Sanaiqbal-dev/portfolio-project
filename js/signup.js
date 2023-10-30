const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const submitFunc = (event) => {
  event.preventDefault();

  let responseMsg = getElement("#response-msg");
  let userName = getElement("#name");
  let email = getElement("#email");
  let password = getElement("#password");

  let invalidNameAlert = getElement("#alert-name");
  let invalidEmailAlert = getElement("#alert-email");
  let invalidPasswordAlert = getElement("#alert-password");

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

const getElement = (idOrClassName) => {
  return document.querySelector(idOrClassName);
};
