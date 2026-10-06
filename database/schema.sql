-- ============================================================
-- CAR RENTAL FLEET AND VEHICLE MANAGEMENT SYSTEM
-- Database Schema
-- Oracle SQL
-- ============================================================


-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    user_id NUMBER PRIMARY KEY,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) NOT NULL,
    phone VARCHAR2(30),
    role VARCHAR2(20) NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT uq_users_email
        UNIQUE (email),

    CONSTRAINT chk_users_role
        CHECK (role IN (
            'ADMIN',
            'CUSTOMER',
            'INSPECTOR',
            'MECHANIC'
        ))
);


-- ============================================================
-- 2. CAR CATEGORIES
-- ============================================================

CREATE TABLE car_categories (
    category_id NUMBER PRIMARY KEY,
    category_name VARCHAR2(50) NOT NULL,
    description VARCHAR2(255),
    default_daily_rate NUMBER(10,2) NOT NULL,

    CONSTRAINT uq_car_category_name
        UNIQUE (category_name),

    CONSTRAINT chk_category_rate
        CHECK (default_daily_rate >= 0)
);


-- ============================================================
-- 3. CARS
-- ============================================================

CREATE TABLE cars (
    car_id NUMBER PRIMARY KEY,
    category_id NUMBER NOT NULL,
    registration_number VARCHAR2(30) NOT NULL,
    brand VARCHAR2(50) NOT NULL,
    model VARCHAR2(50) NOT NULL,
    production_year NUMBER(4),
    color VARCHAR2(30),
    mileage NUMBER(10) DEFAULT 0 NOT NULL,
    fuel_level NUMBER(5,2) DEFAULT 100 NOT NULL,
    daily_rate NUMBER(10,2) NOT NULL,
    status VARCHAR2(20) DEFAULT 'AVAILABLE' NOT NULL,
    location VARCHAR2(100),
    created_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT uq_car_registration
        UNIQUE (registration_number),

    CONSTRAINT fk_car_category
        FOREIGN KEY (category_id)
        REFERENCES car_categories(category_id),

    CONSTRAINT chk_car_status
        CHECK (status IN (
            'AVAILABLE',
            'RESERVED',
            'RENTED',
            'MAINTENANCE',
            'OUT_OF_SERVICE'
        )),

    CONSTRAINT chk_car_rate
        CHECK (daily_rate >= 0),

    CONSTRAINT chk_car_fuel
        CHECK (fuel_level BETWEEN 0 AND 100),

    CONSTRAINT chk_car_mileage
        CHECK (mileage >= 0)
);


-- ============================================================
-- 4. INSURANCE
-- ============================================================

CREATE TABLE insurance (
    insurance_id NUMBER PRIMARY KEY,
    insurance_name VARCHAR2(100) NOT NULL,
    description VARCHAR2(255),
    daily_rate NUMBER(10,2) NOT NULL,

    CONSTRAINT uq_insurance_name
        UNIQUE (insurance_name),

    CONSTRAINT chk_insurance_rate
        CHECK (daily_rate >= 0)
);


-- ============================================================
-- 5. RESERVATIONS
-- ============================================================

CREATE TABLE reservations (
    reservation_id NUMBER PRIMARY KEY,
    customer_id NUMBER NOT NULL,
    car_id NUMBER NOT NULL,
    insurance_id NUMBER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_days NUMBER NOT NULL,
    total_price NUMBER(10,2) DEFAULT 0 NOT NULL,
    status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,

    CONSTRAINT fk_reservation_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_reservation_car
        FOREIGN KEY (car_id)
        REFERENCES cars(car_id),

    CONSTRAINT fk_reservation_insurance
        FOREIGN KEY (insurance_id)
        REFERENCES insurance(insurance_id),

    CONSTRAINT chk_reservation_dates
        CHECK (end_date >= start_date),

    CONSTRAINT chk_reservation_days
        CHECK (number_of_days > 0),

    CONSTRAINT chk_reservation_price
        CHECK (total_price >= 0),

    CONSTRAINT chk_reservation_status
        CHECK (status IN (
            'PENDING',
            'CONFIRMED',
            'CANCELLED',
            'COMPLETED'
        ))
);


-- ============================================================
-- 6. RENTALS
-- ============================================================

CREATE TABLE rentals (
    rental_id NUMBER PRIMARY KEY,
    reservation_id NUMBER,
    customer_id NUMBER NOT NULL,
    car_id NUMBER NOT NULL,
    checkout_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE,
    checkout_mileage NUMBER NOT NULL,
    return_mileage NUMBER,
    checkout_fuel_level NUMBER(5,2),
    return_fuel_level NUMBER(5,2),
    total_price NUMBER(10,2) NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,

    CONSTRAINT fk_rental_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(reservation_id),

    CONSTRAINT fk_rental_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_rental_car
        FOREIGN KEY (car_id)
        REFERENCES cars(car_id),

    CONSTRAINT chk_rental_dates
        CHECK (expected_return_date >= checkout_date),

    CONSTRAINT chk_rental_return_date
        CHECK (
            actual_return_date IS NULL
            OR actual_return_date >= checkout_date
        ),

    CONSTRAINT chk_rental_mileage
        CHECK (
            return_mileage IS NULL
            OR return_mileage >= checkout_mileage
        ),

    CONSTRAINT chk_checkout_fuel
        CHECK (
            checkout_fuel_level IS NULL
            OR checkout_fuel_level BETWEEN 0 AND 100
        ),

    CONSTRAINT chk_return_fuel
        CHECK (
            return_fuel_level IS NULL
            OR return_fuel_level BETWEEN 0 AND 100
        ),

    CONSTRAINT chk_rental_price
        CHECK (total_price >= 0),

    CONSTRAINT chk_rental_status
        CHECK (status IN (
            'ACTIVE',
            'COMPLETED',
            'CANCELLED'
        ))
);


-- ============================================================
-- 7. INSPECTIONS
-- ============================================================

CREATE TABLE inspections (
    inspection_id NUMBER PRIMARY KEY,
    rental_id NUMBER NOT NULL,
    inspector_id NUMBER NOT NULL,
    inspection_type VARCHAR2(20) NOT NULL,
    inspection_date DATE DEFAULT SYSDATE NOT NULL,
    mileage NUMBER,
    fuel_level NUMBER(5,2),
    exterior_condition VARCHAR2(255),
    interior_condition VARCHAR2(255),
    notes VARCHAR2(500),

    CONSTRAINT fk_inspection_rental
        FOREIGN KEY (rental_id)
        REFERENCES rentals(rental_id),

    CONSTRAINT fk_inspection_inspector
        FOREIGN KEY (inspector_id)
        REFERENCES users(user_id),

    CONSTRAINT chk_inspection_type
        CHECK (inspection_type IN (
            'CHECK_OUT',
            'CHECK_IN'
        )),

    CONSTRAINT chk_inspection_fuel
        CHECK (
            fuel_level IS NULL
            OR fuel_level BETWEEN 0 AND 100
        ),

    CONSTRAINT chk_inspection_mileage
        CHECK (
            mileage IS NULL
            OR mileage >= 0
        )
);


-- ============================================================
-- 8. DAMAGES
-- ============================================================

CREATE TABLE damages (
    damage_id NUMBER PRIMARY KEY,
    inspection_id NUMBER NOT NULL,
    damage_type VARCHAR2(50) NOT NULL,
    description VARCHAR2(500) NOT NULL,
    severity VARCHAR2(20) NOT NULL,
    repair_cost NUMBER(10,2) DEFAULT 0,
    resolved VARCHAR2(10) DEFAULT 'NO' NOT NULL,

    CONSTRAINT fk_damage_inspection
        FOREIGN KEY (inspection_id)
        REFERENCES inspections(inspection_id),

    CONSTRAINT chk_damage_severity
        CHECK (severity IN (
            'MINOR',
            'MEDIUM',
            'MAJOR'
        )),

    CONSTRAINT chk_damage_resolved
        CHECK (resolved IN (
            'YES',
            'NO'
        )),

    CONSTRAINT chk_damage_cost
        CHECK (repair_cost >= 0)
);


-- ============================================================
-- 9. PAYMENTS
-- ============================================================

CREATE TABLE payments (
    payment_id NUMBER PRIMARY KEY,
    rental_id NUMBER NOT NULL,
    amount NUMBER(10,2) NOT NULL,
    payment_date DATE DEFAULT SYSDATE NOT NULL,
    payment_method VARCHAR2(30) NOT NULL,
    payment_status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    transaction_reference VARCHAR2(100),

    CONSTRAINT fk_payment_rental
        FOREIGN KEY (rental_id)
        REFERENCES rentals(rental_id),

    CONSTRAINT chk_payment_amount
        CHECK (amount >= 0),

    CONSTRAINT chk_payment_status
        CHECK (payment_status IN (
            'PENDING',
            'PAID',
            'FAILED',
            'REFUNDED'
        ))
);


-- ============================================================
-- 10. MAINTENANCE
-- ============================================================

CREATE TABLE maintenance (
    maintenance_id NUMBER PRIMARY KEY,
    car_id NUMBER NOT NULL,
    mechanic_id NUMBER,
    maintenance_type VARCHAR2(50) NOT NULL,
    description VARCHAR2(500),
    scheduled_date DATE,
    completed_date DATE,
    mileage_at_service NUMBER,
    cost NUMBER(10,2) DEFAULT 0,
    status VARCHAR2(20) DEFAULT 'SCHEDULED' NOT NULL,
    next_service_mileage NUMBER,

    CONSTRAINT fk_maintenance_car
        FOREIGN KEY (car_id)
        REFERENCES cars(car_id),

    CONSTRAINT fk_maintenance_mechanic
        FOREIGN KEY (mechanic_id)
        REFERENCES users(user_id),

    CONSTRAINT chk_maintenance_status
        CHECK (status IN (
            'SCHEDULED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED'
        )),

    CONSTRAINT chk_maintenance_cost
        CHECK (cost >= 0),

    CONSTRAINT chk_maintenance_mileage
        CHECK (
            mileage_at_service IS NULL
            OR mileage_at_service >= 0
        ),

    CONSTRAINT chk_next_service_mileage
        CHECK (
            next_service_mileage IS NULL
            OR next_service_mileage >= 0
        )
);


-- ============================================================
-- 11. MILEAGE RECORDS
-- ============================================================

CREATE TABLE mileage_records (
    mileage_record_id NUMBER PRIMARY KEY,
    car_id NUMBER NOT NULL,
    recorded_by NUMBER NOT NULL,
    mileage NUMBER NOT NULL,
    recorded_date DATE DEFAULT SYSDATE NOT NULL,
    notes VARCHAR2(500),

    CONSTRAINT fk_mileage_car
        FOREIGN KEY (car_id)
        REFERENCES cars(car_id),

    CONSTRAINT fk_mileage_user
        FOREIGN KEY (recorded_by)
        REFERENCES users(user_id),

    CONSTRAINT chk_mileage_value
        CHECK (mileage >= 0)
);


-- ============================================================
-- 12. RENTAL INSURANCE
-- ============================================================

CREATE TABLE rental_insurance (
    rental_insurance_id NUMBER PRIMARY KEY,
    rental_id NUMBER NOT NULL,
    insurance_id NUMBER NOT NULL,
    price NUMBER(10,2) NOT NULL,

    CONSTRAINT fk_rental_insurance_rental
        FOREIGN KEY (rental_id)
        REFERENCES rentals(rental_id),

    CONSTRAINT fk_rental_insurance_insurance
        FOREIGN KEY (insurance_id)
        REFERENCES insurance(insurance_id),

    CONSTRAINT chk_rental_insurance_price
        CHECK (price >= 0)
);