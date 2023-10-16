const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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
