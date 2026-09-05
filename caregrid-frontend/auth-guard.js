const currentRole = localStorage.getItem("role");
const currentPage = window.location.pathname.split("/").pop().toLowerCase();

const publicPages = ["login.html", "signup.html", "payment-result.html"];

const allowedPages = {
  patient: ["index.html", "dashboard-patient.html", "booking.html", "ambulance.html", "my-prescriptions.html", "my-lab-instructions.html"],
  nurse: ["index.html", "dashboard-nurse.html", "vitals.html", "lab-scan.html", "code-blue.html"],
  doctor: ["index.html", "dashboard-doctor.html", "doctor-view.html", "prescriptions.html", "critical-alerts.html", "discharge-forecast.html", "discharge.html", "code-blue.html"],
  hospital_admin: ["index.html", "dashboard-hospital-admin.html", "beds.html", "booking.html", "transfers.html", "billing.html", "bed-planning.html"],
  network_admin: ["index.html", "dashboard-network-admin.html", "network-management.html", "transfers.html", "beds.html", "ambulance-tracking.html"],
};

if (!publicPages.includes(currentPage)) {
  if (!currentRole) {
    window.location.href = "login.html";
  } else if (allowedPages[currentRole] && !allowedPages[currentRole].includes(currentPage)) {
    alert("You don't have access to this page.");
    window.location.href = `dashboard-${currentRole.replace("_", "-")}.html`;
  }
}