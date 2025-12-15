/**
 * Haversine formula to calculate distance between two coordinates
 * @param {Object} point1 - { lat, lng }
 * @param {Object} point2 - { lat, lng }
 * @returns {number} distance in kilometers
 */
export function haversineDistance(point1, point2) {
  if (!point1 || !point2 || !point1.lat || !point1.lng || !point2.lat || !point2.lng) {
    return null;
  }

  const R = 6371; // Earth's radius in km
  const toRad = deg => deg * Math.PI / 180;

  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);

  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate delivery fee based on area and distance
 * @param {Object} area - Area document from MongoDB
 * @param {Object} restaurant - Restaurant document from MongoDB (may include coords)
 * @param {number} distanceKm - Pre-calculated distance (optional, will calculate if not provided)
 * @returns {Object} { fee: number, breakdown: Object }
 */
export function calculateDeliveryFee(area, restaurant = null, distanceKm = null) {
  if (!area) return { fee: 0, breakdown: { baseFee: 0, distanceFee: 0 } };

  let baseFee = area.baseFee || 30;
  let distanceFee = 0;

  // Calculate distance-based fee if distance provided or coordinates available
  if (distanceKm !== null && typeof distanceKm === 'number') {
    const perKmFee = area.perKmFee || 5;
    distanceFee = Math.ceil(distanceKm) * perKmFee;
  }

  const totalFee = baseFee + distanceFee;

  return {
    fee: totalFee,
    breakdown: {
      baseFee,
      distanceFee,
      distanceKm: distanceKm || 0
    }
  };
}

/**
 * Calculate estimated delivery time based on area and distance
 * @param {Object} area - Area document
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} estimated time in minutes
 */
export function calculateEstimatedTime(area, distanceKm = null) {
  if (!area) return 40;

  const baseTime = area.estimatedDeliveryTimeMinutes || 40;

  if (distanceKm !== null && typeof distanceKm === 'number') {
    const minutesPerKm = 1.5; // 1.5 minutes per km
    return Math.ceil(baseTime + distanceKm * minutesPerKm);
  }

  return baseTime;
}

/**
 * Check if a point is within service radius of an area
 * @param {Object} userCoords - { lat, lng }
 * @param {Object} area - Area document
 * @returns {boolean}
 */
export function isWithinServiceRadius(userCoords, area) {
  if (!userCoords || !area || !area.coords) return true; // Allow if no coords

  const distance = haversineDistance(userCoords, area.coords);
  if (distance === null) return true;

  const serviceRadius = area.serviceRadius || 15; // default 15 km
  return distance <= serviceRadius;
}
