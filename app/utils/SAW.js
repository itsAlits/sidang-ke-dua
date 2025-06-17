// sawCalculator.js
export const calculateSawScores = (destinations, userLocation, userWeights = null) => {
  console.log("Initial Destinations:", destinations);
  console.log("User Location:", userLocation);

  if (!destinations || destinations.length === 0) {
    return [];
  }

  // Use user provided weights or fallback to default weights
  const weights = userWeights || {
    distance: 0.4, // Highest weight for distance from user location
    cost: 0.2, // Weight for entrance cost
    rating: 0.3, // Weight for rating
    hours: 0.1, // Weight for operating hours
  };
  console.log("Weights:", weights);

  // Step 1: Prepare the data for normalization
  const preparedData = destinations.map((dest) => {
    // Parse cost - remove currency symbols and convert to number
    const rawCost = dest.biaya.replace(/[^0-9]/g, "");
    const cost = rawCost === "" ? 0 : parseInt(rawCost, 10);

    // Parse rating
    const rating = parseFloat(dest.rating);

    // Calculate distance based on user location
    let distance = 0;
    if (userLocation) {
      switch (userLocation) {
        case "Kuta Selatan":
          distance = dest.jarak.kutaSelatan;
          break;
        case "Kuta Utara":
          distance = dest.jarak.kutaUtara;
          break;
        case "Kuta":
          distance = dest.jarak.kuta;
          break;
        case "Petang":
          distance = dest.jarak.petang;
          break;
        case "Abiansemal":
          distance = dest.jarak.abiansemal;
          break;
        case "Mengwi":
          distance = dest.jarak.mengwi;
          break;
        default:
          // If no specific location is selected, use average of all distances
          distance =
            (dest.jarak.kuta +
              dest.jarak.kutaSelatan +
              dest.jarak.kutaUtara +
              dest.jarak.petang +
              dest.jarak.abiansemal +
              dest.jarak.mengwi) /
            6;
      }
    } else {
      // If no location is specified, use average distance
      distance =
        (dest.jarak.kuta +
          dest.jarak.kutaSelatan +
          dest.jarak.kutaUtara +
          dest.jarak.petang +
          dest.jarak.abiansemal +
          dest.jarak.mengwi) /
        6;
    }

    // Extract operating hours length (in minutes)
    const hoursMatch = dest.jam.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
    let operatingMinutes = 480; // Default to 8 hours (480 minutes)

    if (hoursMatch) {
      const startHour = parseInt(hoursMatch[1], 10);
      const startMin = parseInt(hoursMatch[2], 10);
      const endHour = parseInt(hoursMatch[3], 10);
      const endMin = parseInt(hoursMatch[4], 10);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      operatingMinutes = endMinutes - startMinutes;
      if (operatingMinutes < 0) {
        operatingMinutes += 24 * 60; // Add 24 hours if crossing midnight
      }
    }

    const preparedItem = {
      ...dest,
      normalizedData: {
        cost,
        rating,
        distance,
        operatingMinutes,
      },
    };
    
    console.log(`Prepared Data for ${dest.nama}:`, preparedItem.normalizedData);
    return preparedItem;
  });

  // Step 2: Find min and max values for each criterion
  const minMaxValues = preparedData.reduce(
    (acc, item) => {
      // For cost and distance, lower is better
      acc.minCost = Math.min(acc.minCost, item.normalizedData.cost);
      acc.maxCost = Math.max(acc.maxCost, item.normalizedData.cost);
      acc.minDistance = Math.min(acc.minDistance, item.normalizedData.distance);
      acc.maxDistance = Math.max(acc.maxDistance, item.normalizedData.distance);

      // For rating and hours, higher is better
      acc.minRating = Math.min(acc.minRating, item.normalizedData.rating);
      acc.maxRating = Math.max(acc.maxRating, item.normalizedData.rating);
      acc.minHours = Math.min(
        acc.minHours,
        item.normalizedData.operatingMinutes
      );
      acc.maxHours = Math.max(
        acc.maxHours,
        item.normalizedData.operatingMinutes
      );

      return acc;
    },
    {
      minCost: Infinity,
      maxCost: -Infinity,
      minDistance: Infinity,
      maxDistance: -Infinity,
      minRating: Infinity,
      maxRating: -Infinity,
      minHours: Infinity,
      maxHours: -Infinity,
    }
  );
  console.log("Min-Max Values:", minMaxValues);

  // Step 3: Calculate normalized values (0-1 scale)
  const normalizedDestinations = preparedData.map((dest) => {
    const { cost, rating, distance, operatingMinutes } = dest.normalizedData;

    // For cost and distance, we use cost_min/cost_i (lower is better)
    // For rating and hours, we use rating_i/rating_max (higher is better)
    const normalizedValues = {
      cost:
        minMaxValues.maxCost === minMaxValues.minCost
          ? 1
          : (minMaxValues.maxCost - cost) /
            (minMaxValues.maxCost - minMaxValues.minCost),

      distance:
        minMaxValues.maxDistance === minMaxValues.minDistance
          ? 1
          : (minMaxValues.maxDistance - distance) /
            (minMaxValues.maxDistance - minMaxValues.minDistance),

      rating:
        minMaxValues.maxRating === minMaxValues.minRating
          ? 1
          : (rating - minMaxValues.minRating) /
            (minMaxValues.maxRating - minMaxValues.minRating),

      hours:
        minMaxValues.maxHours === minMaxValues.minHours
          ? 1
          : (operatingMinutes - minMaxValues.minHours) /
            (minMaxValues.maxHours - minMaxValues.minHours),
    };
    console.log(`Normalized Values for ${dest.nama}:`, normalizedValues);

    // Calculate SAW score: sum(weight_i * normalized_value_i)
    const sawScore =
      weights.distance * normalizedValues.distance +
      weights.cost * normalizedValues.cost +
      weights.rating * normalizedValues.rating +
      weights.hours * normalizedValues.hours;
    console.log(`SAW Score for ${dest.nama}:`, sawScore);

    return {
      ...dest,
      normalizedValues,
      sawScore,
      // Add distance from user location for display
      distanceFromUser: distance,
    };
  });

  // Step 4: Sort by SAW score (highest first)
  const sortedDestinations = normalizedDestinations.sort((a, b) => b.sawScore - a.sawScore);
  console.log("Final Sorted Destinations:", sortedDestinations.map(dest => ({
    nama: dest.nama,
    sawScore: dest.sawScore,
    distanceFromUser: dest.distanceFromUser
  })));

  return sortedDestinations;
};
