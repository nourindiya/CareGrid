const Ambulance = require("../models/Ambulance");
const { getDistanceKm, estimateETA } = require("./distance");

// Finds the closest FREE ambulance to a pickup point, marks it dispatched, returns it with ETA
async function dispatchClosestAmbulance(patientId, pickupLat, pickupLng, pickupLocation) {
  const availableAmbulances = await Ambulance.find({ status: "available" });

  if (availableAmbulances.length === 0) {
    return { error: "No ambulance available right now" };
  }

  // Find the one with the smallest distance to the pickup point
  let closest = null;
  let closestDistance = Infinity;

  availableAmbulances.forEach((amb) => {
    const distance = getDistanceKm(amb.currentLat, amb.currentLng, pickupLat, pickupLng);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = amb;
    }
  });

  const etaMinutes = estimateETA(closestDistance);

  closest.status = "dispatched";
  closest.patientId = patientId;
  closest.pickupLocation = pickupLocation;
  closest.pickupLat = pickupLat;
  closest.pickupLng = pickupLng;
  closest.etaMinutes = etaMinutes;
  await closest.save();

  return { ambulance: closest, distanceKm: closestDistance.toFixed(1), etaMinutes };
}

module.exports = dispatchClosestAmbulance;