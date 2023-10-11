const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("submit-form");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let userName = document.getElementById("name");
      let email = document.getElementById("email");
      let password = document.getElementById("password");

      let alertName = document.getElementById("alert-name");
      let alertEmail = document.getElementById("alert-email");
      let alertPassword = document.getElementById("alert-password");

      let successMsg = document.getElementById("success-msg");

      let isUserName,
        isEmail,
        isPassword = false;

      if (userName.value.length == 0) {
        userName.style.border = "1px solid red";
        alertName.style.display = "block";
        isUserName = false;
      } else {
        userName.style.border = "1px solid grey";
        alertName.style.display = "none";
        isUserName = true;
      }

      if (regex.test(email.value) == false) {
        email.style.border = "1px solid red";
        alertEmail.style.display = "block";
        isEmail = false;
      } else {
        email.style.border = "1px solid grey";
        alertEmail.style.display = "none";
        isEmail = true;
      }

      if (password.value.length <= 7) {
        password.style.border = "1px solid red";
        alertPassword.style.display = "block";
        isPassword = false;
      } else {
        password.style.border = "1px solid grey";
        alertPassword.style.display = "none";
        isPassword = true;
      }

      if (isUserName && isEmail && isPassword) {
        successMsg.style.display = "block";
        successMsg.scrollIntoView({ behavior: "smooth" });
      } else {
        successMsg.style.display = "none";
      }
    });
  }
});
