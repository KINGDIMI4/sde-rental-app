export function filterVehicles(vehicles, filters) {
    const {
        categories = [],
        fuels = [],
        transmissions = [],
        minPrice = 30,
        maxPrice = 100,
        sortBy = "price-low",
    } = filters;

    return vehicles
        .filter(
            (vehicle) =>
                (!categories.length ||
                    categories.includes(vehicle.category)) &&
                (!fuels.length || fuels.includes(vehicle.fuel)) &&
                (!transmissions.length ||
                    transmissions.includes(vehicle.transmission)) &&
                vehicle.price >= minPrice &&
                vehicle.price <= maxPrice
        )
        .sort((first, second) => {
            if (sortBy === "price-high") {
                return second.price - first.price;
            }

            if (sortBy === "name") {
                return first.name.localeCompare(second.name);
            }

            return first.price - second.price;
        });
}