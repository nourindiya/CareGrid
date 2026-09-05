const role = localStorage.getItem("role");
const name = localStorage.getItem("name");
const nav = document.getElementById("mainNav");

if (!role) {
  nav.innerHTML = `<a href="login.html">Login</a> <a href="signup.html">Sign Up</a>`;
} else {
  let links = `<a href="index.html">Home</a>`;
  if (role === "patient") {
    links += `<a href="dashboard-patient.html">Dashboard</a> <a href="booking.html">Book Appointment</a> <a href="ambulance.html">Book Ambulance</a>`;
  }
  if (role === "medical_staff") {
    links += `<a href="dashboard-medical.html">Dashboard</a> <a href="vitals.html">Urgency Check-In</a>`;
  }
  if (role === "hospital_admin") {
    links += `<a href="dashboard-hospital-admin.html">Dashboard</a> <a href="beds.html">Bed Board</a> <a href="booking.html">Book Appointment</a> <a href="transfers.html">Transfer Requests</a>`;
  }
  if (role === "network_admin") {
    links += `<a href="dashboard-network-admin.html">Dashboard</a> <a href="network-management.html">Network Management</a> <a href="transfers.html">Transfer Requests</a> <a href="beds.html">Bed Board</a>`;
  }
  links += ` <a href="#" onclick="logout()">Logout (${name})</a>`;
  nav.innerHTML = links;
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}