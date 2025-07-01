document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Temporary hardcoded login logic
  if (username === "admin" && password === "1234") {
    alert("Login successful!");
    // You could redirect here using window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials. Please try again.");
  }
  const rememberMe = document.getElementById("rememberMe").checked;

if (username === "admin" && password === "1234") {
  alert("Login successful!");
  if (rememberMe) {
    localStorage.setItem("savedUser", username);
  } else {
    localStorage.removeItem("savedUser");
  }
}
window.onload = function () {
  const savedUser = localStorage.getItem("savedUser");
  if (savedUser) {
    document.getElementById("username").value = savedUser;
    document.getElementById("rememberMe").checked = true;
  }
  document.getElementById("forgotUsername").addEventListener("click", function (e) {
  e.preventDefault();
  alert("To recover your username, please contact support or check your email for registration info.");
});

document.getElementById("forgotPassword").addEventListener("click", function (e) {
  e.preventDefault();
  alert("Password recovery isn't set up yet—but it could connect to your email or SMS service.");
});
};
});