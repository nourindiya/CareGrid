// Calculates straight-line distance between two coordinates in kilometers
function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Rough ETA assuming average ambulance speed of 40 km/h in city traffic
function estimateETA(distanceKm) {
  const hours = distanceKm / 40;
  const minutes = Math.round(hours * 60);
  return minutes < 1 ? 1 : minutes;
}

module.exports = { getDistanceKm, estimateETA };