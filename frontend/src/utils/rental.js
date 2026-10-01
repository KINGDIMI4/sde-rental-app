export const INSURANCE_PER_DAY = 8;
export const DEPOSIT_PER_VEHICLE = 200;

const DAY = 86400000;

export function todayISO() {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function dateValue(value) {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return NaN;
    }

    const timestamp = Date.parse(`${value}T00:00:00Z`);

    if (!Number.isFinite(timestamp)) {
        return NaN;
    }

    return new Date(timestamp).toISOString().slice(0, 10) === value
        ? timestamp
        : NaN;
}

export function nextDay(value) {
    const timestamp = dateValue(value);

    return Number.isFinite(timestamp)
        ? new Date(timestamp + DAY).toISOString().slice(0, 10)
        : "";
}

export function rentalDays(pickup, returnDate) {
    const days = (dateValue(returnDate) - dateValue(pickup)) / DAY;

    return Number.isInteger(days) && days > 0 ? days : 0;
}

export function rentalError(
    pickup,
    returnDate,
    today = todayISO()
) {
    if (
        !Number.isFinite(dateValue(pickup)) ||
        !Number.isFinite(dateValue(returnDate))
    ) {
        return "Choose valid pick-up and return dates.";
    }

    if (pickup < today) {
        return "Pick-up cannot be in the past.";
    }

    if (!rentalDays(pickup, returnDate)) {
        return "Return must be after pick-up.";
    }

    return "";
}

export function rentalQuote(
    vehicle,
    pickup,
    returnDate,
    insurance
) {
    const days = rentalDays(pickup, returnDate);
    const hire = days * vehicle.price;
    const cover = insurance ? days * INSURANCE_PER_DAY : 0;

    return {
        days,
        hire,
        cover,
        total: hire + cover,
    };
}

export function money(value) {
    return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
    }).format(value);
}

export function displayDate(value) {
    const timestamp = dateValue(value);

    if (!Number.isFinite(timestamp)) {
        return "Choose a date";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(timestamp);
}

export function restoreCart(raw, catalog) {
    try {
        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        const unique = new Map();

        for (const item of parsed) {
            if (
                !item ||
                !catalog.some((vehicle) => vehicle.id === item.vehicleId)
            ) {
                continue;
            }

            if (!rentalDays(item.pickup, item.returnDate)) {
                continue;
            }

            unique.set(item.vehicleId, {
                vehicleId: item.vehicleId,
                pickup: item.pickup,
                returnDate: item.returnDate,
                insurance: item.insurance === true,
            });
        }

        return [...unique.values()];
    } catch {
        return [];
    }
}

export function upsertRental(cart, selection) {
    const item = {
        vehicleId: selection.vehicleId,
        pickup: selection.pickup,
        returnDate: selection.returnDate,
        insurance: selection.insurance === true,
    };

    const found = cart.some(
        (entry) => entry.vehicleId === item.vehicleId
    );

    return found
        ? cart.map((entry) =>
            entry.vehicleId === item.vehicleId ? item : entry
        )
        : [...cart, item];
}