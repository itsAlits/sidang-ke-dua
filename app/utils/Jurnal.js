export const calculateSawScore = (
  destinations,
  userLocation,
  userWeights = null
) => {
  console.log("Initial Destinations:", destinations);
  console.log("User Location:", userLocation);

  if (!destinations || destinations.length === 0) {
    return [];
  }

  // Use user provided weights or fallback to default weights
  const weights = userWeights || {
    distance: 0.4,
    cost: 0.2,
    rating: 0.3,
    hours: 0.1,
  };
  console.log("Weights:", weights);

  const preparedData = destinations.map((dest) => {
    const rawCost = dest.biaya.replace(/[^0-9]/g, "");
    const cost = rawCost === "" ? 0 : parseInt(rawCost, 10);

    const rating = parseFloat(dest.rating);
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
      distance =
        (dest.jarak.kuta +
          dest.jarak.kutaSelatan +
          dest.jarak.kutaUtara +
          dest.jarak.petang +
          dest.jarak.abiansemal +
          dest.jarak.mengwi) /
        6;
    }

    const hoursMatch = dest.jam.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
    let operatingMinutes = 480;

    if (hoursMatch) {
      const startHour = parseInt(hoursMatch[1], 10);
      const startMin = parseInt(hoursMatch[2], 10);
      const endHour = parseInt(hoursMatch[3], 10);
      const endMin = parseInt(hoursMatch[4], 10);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      operatingMinutes = endMinutes - startMinutes;
      if (operatingMinutes < 0) {
        operatingMinutes += 24 * 60;
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

  const minMaxValues = preparedData.reduce(
    (acc, item) => {
      acc.minCost = Math.min(acc.minCost, item.normalizedData.cost);
      acc.maxCost = Math.max(acc.maxCost, item.normalizedData.cost);
      acc.minDistance = Math.min(acc.minDistance, item.normalizedData.distance);
      acc.maxDistance = Math.max(acc.maxDistance, item.normalizedData.distance);
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

  const normalizedDestinations = preparedData.map((dest) => {
    const { cost, rating, distance, operatingMinutes } = dest.normalizedData;
    const normalizedValues = {
      // cost rumusnya itu : Min Xij / Xij
      cost: cost === 0 ? 1 : minMaxValues.minCost / cost,
      distance: minMaxValues.minDistance / distance,

      // untuk benefit rumussnya  rumus: Xij / Max Xij
      rating: rating / minMaxValues.maxRating,
      hours: operatingMinutes / minMaxValues.maxHours,
    };

    console.log(`Normalized Values for ${dest.nama}:`, normalizedValues);
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
      distanceFromUser: distance,
    };
  });

  const sortedDestinations = normalizedDestinations.sort(
    (a, b) => b.sawScore - a.sawScore
  );
  console.log(
    "Final Sorted Destinations:",
    sortedDestinations.map((dest) => ({
      nama: dest.nama,
      sawScore: dest.sawScore,
      distanceFromUser: dest.distanceFromUser,
    }))
  );

  return sortedDestinations;
};
