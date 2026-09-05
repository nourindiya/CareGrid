document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  const rawRole = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";

  // Map dropdown text values to internal role keys
  const roleMap = {
    "hospital operations manager": "hospital_admin",
    "hospital_admin": "hospital_admin",
    "doctor": "doctor",
    "nurse": "nurse",
    "patient": "patient",
    "network_admin": "network_admin"
  };

  const role = rawRole ? roleMap[rawRole.toLowerCase().trim()] || rawRole.toLowerCase().trim() : null;

  if (!role) {
    nav.innerHTML = `<a href="login.html">Login</a> <a href="signup.html">Sign Up</a>`;
    return;
  }

  let links = `<a href="index.html">Home</a>`;

  if (role === "patient") {
    links += `<a href="dashboard-patient.html">Dashboard</a> <a href="booking.html">Book Appointment</a> <a href="ambulance.html">Book Ambulance</a> <a href="my-prescriptions.html">My Prescriptions</a> <a href="my-lab-instructions.html">My Lab Advisories</a>`;
  } else if (role === "nurse") {
    links += `<a href="dashboard-nurse.html">Dashboard</a> <a href="vitals.html">Urgency Check-In</a> <a href="lab-scan.html">Lab Report Scanning</a> <a href="code-blue.html">Code Blue</a> <a href="roster.html">My Roster</a>`;
  } else if (role === "doctor") {
    links += `<a href="dashboard-doctor.html">Dashboard</a> <a href="doctor-view.html">Patients</a> <a href="prescriptions.html">Prescriptions</a> <a href="critical-alerts.html">Critical Alerts</a> <a href="discharge-forecast.html">Set Discharge Date</a> <a href="discharge.html">Discharge Patient</a> <a href="code-blue.html">Code Blue</a> <a href="roster.html">My Roster</a>`;
  } else if (role === "hospital_admin") {
    links += `<a href="dashboard-hospital-admin.html">Dashboard</a> <a href="beds.html">Bed Board</a> <a href="booking.html">Book Appointment</a> <a href="transfers.html">Transfer Requests</a> <a href="billing.html">Payment & Billing</a> <a href="bed-planning.html">Bed Planning</a>`;
  } else if (role === "network_admin") {
    links += `<a href="dashboard-network-admin.html">Dashboard</a> <a href="network-management.html">Network Management</a> <a href="transfers.html">Transfer Requests</a> <a href="roster.html">Roster</a> <a href="beds.html">Bed Board</a> <a href="ambulance-tracking.html">Ambulance Tracking</a>`;
  }

  links += ` <a href="#" onclick="logout()">Logout (${name})</a>`;
  nav.innerHTML = links;
});

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}