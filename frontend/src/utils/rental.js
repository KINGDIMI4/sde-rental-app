export const INSURANCE_PER_DAY = 10;
export const DEPOSIT_PER_VEHICLE = 200;

const DAY = 86400000;

// UTC date arithmetic prevents daylight-saving changes
// from affecting the number of rental days.
function dateValue(value) {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return NaN;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (
        !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== value
    ) {
        return NaN;
    }

    return date.getTime();
}

export function todayISO() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");
}

export function nextDay(value, count = 1) {
    const time = dateValue(value);

    if (!Number.isFinite(time)) {
        return "";
    }

    const next = new Date(time + count * DAY);

    if (!Number.isFinite(next.getTime())) {
        return "";
    }

    const result = next.toISOString().slice(0, 10);

    return /^\d{4}-\d{2}-\d{2}$/.test(result) ? result : "";
}

export function rentalError(
    pickup,
    returnDate,
    today = todayISO()
) {
    const start = dateValue(pickup);
    const end = dateValue(returnDate);

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return "Choose a valid pick-up and return date.";
    }

    if (pickup < today) {
        return "Pick-up must be today or a future date.";
    }

    if (end <= start) {
        return "Return must be at least one day after pick-up.";
    }

    return "";
}

export function rentalQuote(
    vehicle,
    pickup,
    returnDate,
    insurance = false
) {
    const difference =
        dateValue(returnDate) - dateValue(pickup);

    const days =
        Number.isFinite(difference) && difference > 0
            ? difference / DAY
            : 0;

    const hire = days * vehicle.price;
    const cover = insurance ? days * INSURANCE_PER_DAY : 0;

    return {
        days,
        hire,
        cover,
        total: hire + cover,
    };
}

export function money(amount) {
    return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function displayDate(value) {
    const time = dateValue(value);

    if (!Number.isFinite(time)) {
        return "Choose a date";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(time);
}