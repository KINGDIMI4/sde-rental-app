-- ============================================================
-- RIDEGO
-- CAR RENTAL AND FLEET MANAGEMENT SYSTEM
-- Oracle Database
-- File: database/schema.sql
-- ============================================================
--
-- PURPOSE
-- Creates the application tables, constraints and indexes.
--
-- BEFORE RUNNING
-- 1. Connect as the RideGo application database user.
-- 2. Run in an empty application schema.
-- 3. This script does not replace or migrate existing tables.
-- 4. Use updated sample data that matches this schema.
--
-- CONVENTIONS
-- All monetary amounts are in EUR.
-- Primary keys are generated automatically.
-- INSERT statements must omit generated identity columns.
-- Rental dates are whole calendar days, end-exclusive:
-- 10 October to 13 October = 3 rental days.
-- Operational timestamps include a time zone.
-- is_active: 1 = active, 0 = inactive.
--
-- APPLICATION RESPONSIBILITIES
-- The backend must enforce permissions, ownership, valid status
-- transitions, availability, password hashing and transactions.
-- A foreign key to users does not enforce a user's role.
--
-- ============================================================


-- ============================================================
-- 1. USERS
-- Customer and staff accounts.
--
-- Public registration must always create CUSTOMER accounts.
-- Staff roles can only be assigned by an authorised administrator.
-- password_hash stores a secure password hash, never plain text.
-- The backend must update updated_at whenever a row changes.
-- ============================================================

CREATE TABLE users (
                       user_id NUMBER GENERATED ALWAYS AS IDENTITY,
                       first_name VARCHAR2(50 CHAR) NOT NULL,
                       last_name VARCHAR2(50 CHAR) NOT NULL,
                       email VARCHAR2(254 CHAR) NOT NULL,
                       password_hash VARCHAR2(255 CHAR) NOT NULL,
                       phone VARCHAR2(30 CHAR),
                       role VARCHAR2(20 CHAR) DEFAULT 'CUSTOMER' NOT NULL,
                       is_active NUMBER(1) DEFAULT 1 NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
                       updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

                       CONSTRAINT pk_users PRIMARY KEY (user_id),

                       CONSTRAINT ck_users_role CHECK (
                           role IN ('ADMIN', 'CUSTOMER', 'INSPECTOR', 'MECHANIC')
                           ),

                       CONSTRAINT ck_users_active CHECK (
                           is_active IN (0, 1)
                           ),

                       CONSTRAINT ck_users_email CHECK (
                           email = LOWER(TRIM(email))
                               AND TRIM(email) IS NOT NULL
                           )
);

CREATE UNIQUE INDEX ux_users_email ON users (email);


-- ============================================================
-- 2. AUTHENTICATION SESSIONS
-- Supports login, logout, expiration and session revocation.
--
-- Generate a cryptographically random token in the backend.
-- Store only its SHA-256 hash here, encoded as 64 hex characters.
-- Never log or store the raw session token in this table.
--
-- Each authenticated request must check:
-- session expiration, revocation and whether the user is active.
-- ============================================================

CREATE TABLE auth_sessions (
                               session_id NUMBER GENERATED ALWAYS AS IDENTITY,
                               user_id NUMBER NOT NULL,
                               token_hash VARCHAR2(64 CHAR) NOT NULL,
                               created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
                               expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                               revoked_at TIMESTAMP WITH TIME ZONE,

                               CONSTRAINT pk_auth_sessions PRIMARY KEY (session_id),

                               CONSTRAINT uq_auth_token UNIQUE (token_hash),

                               CONSTRAINT fk_auth_user FOREIGN KEY (user_id)
                                   REFERENCES users (user_id),

                               CONSTRAINT ck_auth_expiry CHECK (
                                   expires_at > created_at
                                   ),

                               CONSTRAINT ck_auth_revoked CHECK (
                                   revoked_at IS NULL OR revoked_at >= created_at
                                   )
);

CREATE INDEX ix_auth_user ON auth_sessions (user_id);
CREATE INDEX ix_auth_expiry ON auth_sessions (expires_at);


-- ============================================================
-- 3. LOCATIONS
-- Rental branches used for vehicle pickup and return.
-- Deactivate locations instead of deleting referenced records.
-- opening_hours is display text, not a booking validation rule.
-- ============================================================

CREATE TABLE locations (
                           location_id NUMBER GENERATED ALWAYS AS IDENTITY,
                           location_name VARCHAR2(100 CHAR) NOT NULL,
                           address VARCHAR2(255 CHAR) NOT NULL,
                           city VARCHAR2(100 CHAR) NOT NULL,
                           country_code CHAR(2 CHAR) DEFAULT 'HU' NOT NULL,
    phone VARCHAR2(30 CHAR),
    opening_hours VARCHAR2(255 CHAR),
    is_active NUMBER(1) DEFAULT 1 NOT NULL,

    CONSTRAINT pk_locations PRIMARY KEY (location_id),

    CONSTRAINT uq_location_name UNIQUE (location_name),

    CONSTRAINT ck_locations_active CHECK (
        is_active IN (0, 1)
    )
);


-- ============================================================
-- 4. CAR CATEGORIES
-- Examples: Economy, Sedan, SUV, Sports and Luxury.
-- Fuel type is stored separately on each car.
--
-- default_daily_rate is a suggested rate for new vehicles.
-- Existing cars retain their own daily_rate.
-- ============================================================

CREATE TABLE car_categories (
                                category_id NUMBER GENERATED ALWAYS AS IDENTITY,
                                category_name VARCHAR2(50 CHAR) NOT NULL,
                                description VARCHAR2(500 CHAR),
                                default_daily_rate NUMBER(10, 2) NOT NULL,
                                is_active NUMBER(1) DEFAULT 1 NOT NULL,

                                CONSTRAINT pk_car_categories PRIMARY KEY (category_id),

                                CONSTRAINT uq_category_name UNIQUE (category_name),

                                CONSTRAINT ck_category_rate CHECK (
                                    default_daily_rate >= 0
                                    ),

                                CONSTRAINT ck_category_active CHECK (
                                    is_active IN (0, 1)
                                    )
);


-- ============================================================
-- 5. CARS
-- Each row represents one physical vehicle.
--
-- slug provides a unique frontend URL identifier.
-- image_url can contain a path such as:
-- /images/toyota-corolla.png
--
-- status describes the vehicle's current operational state.
-- Future reservations are checked separately for availability.
-- is_active = 0 removes a vehicle from new customer bookings.
--
-- location_id records the current branch. Future pickup-location
-- feasibility must also be checked by the backend.
-- ============================================================

CREATE TABLE cars (
                      car_id NUMBER GENERATED ALWAYS AS IDENTITY,
                      category_id NUMBER NOT NULL,
                      location_id NUMBER NOT NULL,
                      registration_number VARCHAR2(30 CHAR) NOT NULL,
                      slug VARCHAR2(150 CHAR) NOT NULL,
                      brand VARCHAR2(50 CHAR) NOT NULL,
                      model VARCHAR2(80 CHAR) NOT NULL,
                      production_year NUMBER(4) NOT NULL,
                      color VARCHAR2(30 CHAR),
                      description VARCHAR2(2000 CHAR),
                      image_url VARCHAR2(1000 CHAR),
                      seats NUMBER(2) NOT NULL,
                      transmission VARCHAR2(20 CHAR) NOT NULL,
                      fuel_type VARCHAR2(20 CHAR) NOT NULL,
                      mileage NUMBER(10) DEFAULT 0 NOT NULL,
                      fuel_level NUMBER(5, 2) DEFAULT 100 NOT NULL,
                      daily_rate NUMBER(10, 2) NOT NULL,
                      deposit_amount NUMBER(10, 2) DEFAULT 200 NOT NULL,
                      status VARCHAR2(20 CHAR) DEFAULT 'AVAILABLE' NOT NULL,
                      is_active NUMBER(1) DEFAULT 1 NOT NULL,
                      created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
                      updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

                      CONSTRAINT pk_cars PRIMARY KEY (car_id),

                      CONSTRAINT uq_car_registration UNIQUE (registration_number),

                      CONSTRAINT uq_car_slug UNIQUE (slug),

                      CONSTRAINT fk_car_category FOREIGN KEY (category_id)
                          REFERENCES car_categories (category_id),

                      CONSTRAINT fk_car_location FOREIGN KEY (location_id)
                          REFERENCES locations (location_id),

                      CONSTRAINT ck_car_year CHECK (
                          production_year BETWEEN 1900 AND 2100
                          ),

                      CONSTRAINT ck_car_seats CHECK (
                          seats BETWEEN 1 AND 9
                          ),

                      CONSTRAINT ck_car_transmission CHECK (
                          transmission IN ('MANUAL', 'AUTOMATIC')
                          ),

                      CONSTRAINT ck_car_fuel_type CHECK (
                          fuel_type IN ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID')
                          ),

                      CONSTRAINT ck_car_mileage CHECK (
                          mileage >= 0
                          ),

                      CONSTRAINT ck_car_fuel_level CHECK (
                          fuel_level BETWEEN 0 AND 100
                          ),

                      CONSTRAINT ck_car_daily_rate CHECK (
                          daily_rate >= 0
                          ),

                      CONSTRAINT ck_car_deposit CHECK (
                          deposit_amount >= 0
                          ),

                      CONSTRAINT ck_car_status CHECK (
                          status IN (
                                     'AVAILABLE',
                                     'RENTED',
                                     'MAINTENANCE',
                                     'OUT_OF_SERVICE'
                              )
                          ),

                      CONSTRAINT ck_car_active CHECK (
                          is_active IN (0, 1)
                          )
);

CREATE INDEX ix_car_category ON cars (category_id);
CREATE INDEX ix_car_location ON cars (location_id);
CREATE INDEX ix_car_catalogue ON cars (is_active, status, daily_rate);


-- ============================================================
-- 6. INSURANCE
-- Optional insurance plans available for new reservations.
-- Agreed insurance prices are copied into the reservation.
-- Changing a plan does not change existing reservation prices.
-- ============================================================

CREATE TABLE insurance (
                           insurance_id NUMBER GENERATED ALWAYS AS IDENTITY,
                           insurance_name VARCHAR2(100 CHAR) NOT NULL,
                           description VARCHAR2(1000 CHAR),
                           daily_rate NUMBER(10, 2) NOT NULL,
                           is_active NUMBER(1) DEFAULT 1 NOT NULL,

                           CONSTRAINT pk_insurance PRIMARY KEY (insurance_id),

                           CONSTRAINT uq_insurance_name UNIQUE (insurance_name),

                           CONSTRAINT ck_insurance_rate CHECK (
                               daily_rate >= 0
                               ),

                           CONSTRAINT ck_insurance_active CHECK (
                               is_active IN (0, 1)
                               )
);


-- ============================================================
-- 7. RESERVATIONS
-- One reservation contains one physical vehicle.
-- A cart with multiple vehicles creates multiple reservations.
--
-- booking_reference is the customer-facing reference.
-- request_key prevents duplicate submissions of one booking.
-- Generate both values in the backend.
--
-- Price fields are snapshots calculated by the backend:
-- hire_total      = number_of_days * daily_rate
-- insurance_total = number_of_days * insurance_daily_rate
-- total_price     = hire_total + insurance_total
--
-- Refundable deposits are separate from total_price.
-- Extra charges are recorded separately after checkout.
--
-- This workflow confirms bookings immediately.
-- Payment status is tracked in payments.
-- There is no unpaid temporary-hold state in this schema.
--
-- Overlapping reservations require transactional backend checks.
-- ============================================================

CREATE TABLE reservations (
                              reservation_id NUMBER GENERATED ALWAYS AS IDENTITY,
                              booking_reference VARCHAR2(40 CHAR) NOT NULL,
                              request_key VARCHAR2(64 CHAR) NOT NULL,
                              customer_id NUMBER NOT NULL,
                              car_id NUMBER NOT NULL,
                              insurance_id NUMBER,
                              pickup_location_id NUMBER NOT NULL,
                              return_location_id NUMBER NOT NULL,
                              start_date DATE NOT NULL,
                              end_date DATE NOT NULL,
                              number_of_days NUMBER(5) NOT NULL,
                              daily_rate NUMBER(10, 2) NOT NULL,
                              insurance_name VARCHAR2(100 CHAR),
                              insurance_daily_rate NUMBER(10, 2) DEFAULT 0 NOT NULL,
                              hire_total NUMBER(12, 2) NOT NULL,
                              insurance_total NUMBER(12, 2) DEFAULT 0 NOT NULL,
                              total_price NUMBER(12, 2) NOT NULL,
                              deposit_amount NUMBER(10, 2) DEFAULT 0 NOT NULL,
                              currency CHAR(3 CHAR) DEFAULT 'EUR' NOT NULL,
    status VARCHAR2(20 CHAR) DEFAULT 'CONFIRMED' NOT NULL,
    customer_notes VARCHAR2(1000 CHAR),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by NUMBER,
    cancellation_reason VARCHAR2(500 CHAR),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

    CONSTRAINT pk_reservations PRIMARY KEY (reservation_id),

    CONSTRAINT uq_res_booking_ref UNIQUE (booking_reference),

    CONSTRAINT uq_res_request UNIQUE (request_key),

    CONSTRAINT fk_res_customer FOREIGN KEY (customer_id)
        REFERENCES users (user_id),

    CONSTRAINT fk_res_car FOREIGN KEY (car_id)
        REFERENCES cars (car_id),

    CONSTRAINT fk_res_insurance FOREIGN KEY (insurance_id)
        REFERENCES insurance (insurance_id),

    CONSTRAINT fk_res_pickup FOREIGN KEY (pickup_location_id)
        REFERENCES locations (location_id),

    CONSTRAINT fk_res_return FOREIGN KEY (return_location_id)
        REFERENCES locations (location_id),

    CONSTRAINT fk_res_cancelled_by FOREIGN KEY (cancelled_by)
        REFERENCES users (user_id),

    CONSTRAINT ck_res_dates CHECK (
        start_date = TRUNC(start_date)
        AND end_date = TRUNC(end_date)
        AND end_date > start_date
    ),

    CONSTRAINT ck_res_days CHECK (
        number_of_days > 0
        AND number_of_days = end_date - start_date
    ),

    CONSTRAINT ck_res_rates CHECK (
        daily_rate >= 0
        AND insurance_daily_rate >= 0
        AND deposit_amount >= 0
    ),

    CONSTRAINT ck_res_hire_total CHECK (
        hire_total = number_of_days * daily_rate
    ),

    CONSTRAINT ck_res_ins_total CHECK (
        insurance_total = number_of_days * insurance_daily_rate
    ),

    CONSTRAINT ck_res_total CHECK (
        total_price = hire_total + insurance_total
    ),

    CONSTRAINT ck_res_ins_selection CHECK (
        (
            insurance_id IS NULL
            AND insurance_name IS NULL
            AND insurance_daily_rate = 0
        )
        OR
        (
            insurance_id IS NOT NULL
            AND insurance_name IS NOT NULL
        )
    ),

    CONSTRAINT ck_res_currency CHECK (
        currency = 'EUR'
    ),

    CONSTRAINT ck_res_status CHECK (
        status IN (
            'CONFIRMED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED'
        )
    ),

    CONSTRAINT ck_res_cancellation CHECK (
        (
            status = 'CANCELLED'
            AND cancelled_at IS NOT NULL
            AND cancelled_by IS NOT NULL
            AND cancellation_reason IS NOT NULL
            AND cancelled_at >= created_at
        )
        OR
        (
            status <> 'CANCELLED'
            AND cancelled_at IS NULL
            AND cancelled_by IS NULL
            AND cancellation_reason IS NULL
        )
    )
);

CREATE INDEX ix_res_customer
    ON reservations (customer_id, created_at);

CREATE INDEX ix_res_availability
    ON reservations (car_id, status, start_date, end_date);

CREATE INDEX ix_res_insurance ON reservations (insurance_id);
CREATE INDEX ix_res_pickup ON reservations (pickup_location_id);
CREATE INDEX ix_res_return ON reservations (return_location_id);
CREATE INDEX ix_res_cancelled_by ON reservations (cancelled_by);


-- ============================================================
-- 8. RENTALS
-- A rental begins when a confirmed vehicle is handed over.
-- Each reservation can have at most one rental.
--
-- Customer, vehicle, agreed price and expected return date
-- are obtained through the linked reservation.
--
-- On checkout, the backend must update the reservation and car.
-- On return, it must update rental, reservation, vehicle mileage,
-- fuel level, location and operational status in one transaction.
-- ============================================================

CREATE TABLE rentals (
                         rental_id NUMBER GENERATED ALWAYS AS IDENTITY,
                         reservation_id NUMBER NOT NULL,
                         checked_out_by NUMBER NOT NULL,
                         checked_in_by NUMBER,
                         checkout_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
                         returned_at TIMESTAMP WITH TIME ZONE,
                         checkout_mileage NUMBER(10) NOT NULL,
                         return_mileage NUMBER(10),
                         checkout_fuel_level NUMBER(5, 2) NOT NULL,
                         return_fuel_level NUMBER(5, 2),
                         status VARCHAR2(20 CHAR) DEFAULT 'ACTIVE' NOT NULL,
                         notes VARCHAR2(2000 CHAR),

                         CONSTRAINT pk_rentals PRIMARY KEY (rental_id),

                         CONSTRAINT uq_rental_reservation UNIQUE (reservation_id),

                         CONSTRAINT fk_rental_reservation FOREIGN KEY (reservation_id)
                             REFERENCES reservations (reservation_id),

                         CONSTRAINT fk_rental_checkout_user FOREIGN KEY (checked_out_by)
                             REFERENCES users (user_id),

                         CONSTRAINT fk_rental_checkin_user FOREIGN KEY (checked_in_by)
                             REFERENCES users (user_id),

                         CONSTRAINT ck_rental_mileage CHECK (
                             checkout_mileage >= 0
                                 AND (
                                 return_mileage IS NULL
                                     OR return_mileage >= checkout_mileage
                                 )
                             ),

                         CONSTRAINT ck_rental_fuel_out CHECK (
                             checkout_fuel_level BETWEEN 0 AND 100
                             ),

                         CONSTRAINT ck_rental_fuel_in CHECK (
                             return_fuel_level IS NULL
                                 OR return_fuel_level BETWEEN 0 AND 100
                             ),

                         CONSTRAINT ck_rental_status CHECK (
                             status IN ('ACTIVE', 'COMPLETED')
                             ),

                         CONSTRAINT ck_rental_return CHECK (
                             (
                                 status = 'ACTIVE'
                                     AND returned_at IS NULL
                                     AND checked_in_by IS NULL
                                     AND return_mileage IS NULL
                                     AND return_fuel_level IS NULL
                                 )
                                 OR
                             (
                                 status = 'COMPLETED'
                                     AND returned_at IS NOT NULL
                                     AND checked_in_by IS NOT NULL
                                     AND return_mileage IS NOT NULL
                                     AND return_fuel_level IS NOT NULL
                                     AND returned_at >= checkout_at
                                 )
                             )
);

CREATE INDEX ix_rental_checkout_user ON rentals (checked_out_by);
CREATE INDEX ix_rental_checkin_user ON rentals (checked_in_by);


-- ============================================================
-- 9. INSPECTIONS
-- Records vehicle condition at checkout and check-in.
-- One inspection of each type is allowed per rental.
-- Backend permissions restrict who can submit inspections.
-- ============================================================

CREATE TABLE inspections (
                             inspection_id NUMBER GENERATED ALWAYS AS IDENTITY,
                             rental_id NUMBER NOT NULL,
                             inspector_id NUMBER NOT NULL,
                             inspection_type VARCHAR2(20 CHAR) NOT NULL,
                             inspected_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
                             mileage NUMBER(10) NOT NULL,
                             fuel_level NUMBER(5, 2) NOT NULL,
                             exterior_condition VARCHAR2(1000 CHAR) NOT NULL,
                             interior_condition VARCHAR2(1000 CHAR) NOT NULL,
                             notes VARCHAR2(2000 CHAR),

                             CONSTRAINT pk_inspections PRIMARY KEY (inspection_id),

                             CONSTRAINT uq_inspection_type UNIQUE (
                                                                   rental_id, inspection_type
                                 ),

                             CONSTRAINT fk_inspection_rental FOREIGN KEY (rental_id)
                                 REFERENCES rentals (rental_id),

                             CONSTRAINT fk_inspection_user FOREIGN KEY (inspector_id)
                                 REFERENCES users (user_id),

                             CONSTRAINT ck_inspection_type CHECK (
                                 inspection_type IN ('CHECK_OUT', 'CHECK_IN')
                                 ),

                             CONSTRAINT ck_inspection_mileage CHECK (
                                 mileage >= 0
                                 ),

                             CONSTRAINT ck_inspection_fuel CHECK (
                                 fuel_level BETWEEN 0 AND 100
                                 )
);

CREATE INDEX ix_inspection_user ON inspections (inspector_id);


-- ============================================================
-- 10. DAMAGES
-- Damage findings recorded during an inspection.
--
-- estimated_repair_cost is a repair estimate.
-- It does not automatically create a customer charge.
-- Customer charges belong in rental_charges.
-- ============================================================

CREATE TABLE damages (
                         damage_id NUMBER GENERATED ALWAYS AS IDENTITY,
                         inspection_id NUMBER NOT NULL,
                         damage_type VARCHAR2(50 CHAR) NOT NULL,
                         description VARCHAR2(2000 CHAR) NOT NULL,
                         severity VARCHAR2(20 CHAR) NOT NULL,
                         photo_url VARCHAR2(1000 CHAR),
                         estimated_repair_cost NUMBER(10, 2) DEFAULT 0 NOT NULL,
                         status VARCHAR2(20 CHAR) DEFAULT 'OPEN' NOT NULL,
                         resolved_at TIMESTAMP WITH TIME ZONE,
                         created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

                         CONSTRAINT pk_damages PRIMARY KEY (damage_id),

                         CONSTRAINT fk_damage_inspection FOREIGN KEY (inspection_id)
                             REFERENCES inspections (inspection_id),

                         CONSTRAINT ck_damage_severity CHECK (
                             severity IN ('MINOR', 'MEDIUM', 'MAJOR')
                             ),

                         CONSTRAINT ck_damage_cost CHECK (
                             estimated_repair_cost >= 0
                             ),

                         CONSTRAINT ck_damage_status CHECK (
                             status IN ('OPEN', 'IN_REPAIR', 'RESOLVED')
                             ),

                         CONSTRAINT ck_damage_resolution CHECK (
                             (
                                 status = 'RESOLVED'
                                     AND resolved_at IS NOT NULL
                                     AND resolved_at >= created_at
                                 )
                                 OR
                             (
                                 status <> 'RESOLVED'
                                     AND resolved_at IS NULL
                                 )
                             )
);

CREATE INDEX ix_damage_inspection ON damages (inspection_id);


-- ============================================================
-- 11. RENTAL CHARGES
-- Additional customer charges after vehicle checkout.
-- Examples: late return, missing fuel or assessed damage.
--
-- Void incorrect charges instead of deleting them.
-- Changing charges does not rewrite the original agreed price.
-- ============================================================

CREATE TABLE rental_charges (
                                charge_id NUMBER GENERATED ALWAYS AS IDENTITY,
                                rental_id NUMBER NOT NULL,
                                damage_id NUMBER,
                                created_by NUMBER NOT NULL,
                                charge_type VARCHAR2(20 CHAR) NOT NULL,
                                description VARCHAR2(1000 CHAR) NOT NULL,
                                amount NUMBER(10, 2) NOT NULL,
                                status VARCHAR2(10 CHAR) DEFAULT 'ACTIVE' NOT NULL,
                                void_reason VARCHAR2(500 CHAR),
                                created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

                                CONSTRAINT pk_rental_charges PRIMARY KEY (charge_id),

                                CONSTRAINT fk_charge_rental FOREIGN KEY (rental_id)
                                    REFERENCES rentals (rental_id),

                                CONSTRAINT fk_charge_damage FOREIGN KEY (damage_id)
                                    REFERENCES damages (damage_id),

                                CONSTRAINT fk_charge_creator FOREIGN KEY (created_by)
                                    REFERENCES users (user_id),

                                CONSTRAINT ck_charge_type CHECK (
                                    charge_type IN ('LATE_RETURN', 'FUEL', 'DAMAGE', 'OTHER')
                                    ),

                                CONSTRAINT ck_charge_amount CHECK (
                                    amount > 0
                                    ),

                                CONSTRAINT ck_charge_status CHECK (
                                    status IN ('ACTIVE', 'VOID')
                                    ),

                                CONSTRAINT ck_charge_void CHECK (
                                    (status = 'ACTIVE' AND void_reason IS NULL)
                                        OR
                                    (status = 'VOID' AND void_reason IS NOT NULL)
                                    ),

                                CONSTRAINT ck_charge_damage_type CHECK (
                                    damage_id IS NULL OR charge_type = 'DAMAGE'
                                    )
);

CREATE INDEX ix_charge_rental ON rental_charges (rental_id);
CREATE INDEX ix_charge_damage ON rental_charges (damage_id);
CREATE INDEX ix_charge_creator ON rental_charges (created_by);


-- ============================================================
-- 12. PAYMENTS
-- Payments are attached to reservations, allowing payment
-- before the physical rental begins.
--
-- RENTAL: agreed vehicle hire and insurance.
-- DEPOSIT: separately collected refundable deposit.
-- EXTRA_CHARGES: assessed charges after checkout.
--
-- DEMO means simulated payment, never real payment processing.
-- CARD requires a payment-provider integration in the backend.
-- This table records collected payments, not card authorisations.
-- Never store card numbers, CVVs or online-banking credentials.
--
-- A pending payment attempt is updated when its result is known.
-- A separate retry uses a new request_key.
-- ============================================================

CREATE TABLE payments (
                          payment_id NUMBER GENERATED ALWAYS AS IDENTITY,
                          reservation_id NUMBER NOT NULL,
                          recorded_by NUMBER,
                          request_key VARCHAR2(64 CHAR) NOT NULL,
                          payment_purpose VARCHAR2(20 CHAR) NOT NULL,
                          payment_method VARCHAR2(20 CHAR) NOT NULL,
                          amount NUMBER(12, 2) NOT NULL,
                          currency CHAR(3 CHAR) DEFAULT 'EUR' NOT NULL,
    status VARCHAR2(20 CHAR) DEFAULT 'PENDING' NOT NULL,
    provider_name VARCHAR2(50 CHAR),
    transaction_reference VARCHAR2(150 CHAR),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

    CONSTRAINT pk_payments PRIMARY KEY (payment_id),

    CONSTRAINT uq_payment_request UNIQUE (request_key),

    CONSTRAINT uq_payment_provider_ref UNIQUE (
        provider_name, transaction_reference
    ),

    CONSTRAINT fk_payment_reservation FOREIGN KEY (reservation_id)
        REFERENCES reservations (reservation_id),

    CONSTRAINT fk_payment_recorder FOREIGN KEY (recorded_by)
        REFERENCES users (user_id),

    CONSTRAINT ck_payment_purpose CHECK (
        payment_purpose IN ('RENTAL', 'DEPOSIT', 'EXTRA_CHARGES')
    ),

    CONSTRAINT ck_payment_method CHECK (
        payment_method IN ('DEMO', 'CASH', 'CARD', 'BANK_TRANSFER')
    ),

    CONSTRAINT ck_payment_amount CHECK (
        amount > 0
    ),

    CONSTRAINT ck_payment_currency CHECK (
        currency = 'EUR'
    ),

    CONSTRAINT ck_payment_status CHECK (
        status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED')
    ),

    CONSTRAINT ck_payment_paid CHECK (
        (
            status = 'PAID'
            AND paid_at IS NOT NULL
            AND paid_at >= created_at
        )
        OR
        (
            status <> 'PAID'
            AND paid_at IS NULL
        )
    )
);

CREATE INDEX ix_payment_reservation ON payments (reservation_id);
CREATE INDEX ix_payment_recorder ON payments (recorded_by);


-- ============================================================
-- 13. REFUNDS
-- Refunds reference the original payment.
-- This also supports returning a collected deposit.
--
-- The backend must prevent total pending and completed refunds
-- from exceeding the paid amount, including concurrent requests.
-- Record refunds separately; keep the original payment history.
-- ============================================================

CREATE TABLE refunds (
                         refund_id NUMBER GENERATED ALWAYS AS IDENTITY,
                         payment_id NUMBER NOT NULL,
                         processed_by NUMBER NOT NULL,
                         request_key VARCHAR2(64 CHAR) NOT NULL,
                         amount NUMBER(12, 2) NOT NULL,
                         reason VARCHAR2(1000 CHAR) NOT NULL,
                         status VARCHAR2(20 CHAR) DEFAULT 'PENDING' NOT NULL,
                         transaction_reference VARCHAR2(150 CHAR),
                         completed_at TIMESTAMP WITH TIME ZONE,
                         created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

                         CONSTRAINT pk_refunds PRIMARY KEY (refund_id),

                         CONSTRAINT uq_refund_request UNIQUE (request_key),

                         CONSTRAINT fk_refund_payment FOREIGN KEY (payment_id)
                             REFERENCES payments (payment_id),

                         CONSTRAINT fk_refund_user FOREIGN KEY (processed_by)
                             REFERENCES users (user_id),

                         CONSTRAINT ck_refund_amount CHECK (
                             amount > 0
                             ),

                         CONSTRAINT ck_refund_status CHECK (
                             status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')
                             ),

                         CONSTRAINT ck_refund_completed CHECK (
                             (
                                 status = 'COMPLETED'
                                     AND completed_at IS NOT NULL
                                     AND completed_at >= created_at
                                 )
                                 OR
                             (
                                 status <> 'COMPLETED'
                                     AND completed_at IS NULL
                                 )
                             )
);

CREATE INDEX ix_refund_payment ON refunds (payment_id);
CREATE INDEX ix_refund_user ON refunds (processed_by);


-- ============================================================
-- 14. MAINTENANCE
-- Scheduled servicing and repairs for physical vehicles.
-- A maintenance job can optionally reference recorded damage.
--
-- scheduled_start and scheduled_end describe the blocked window.
-- The backend must use a consistent local-time convention when
-- comparing these DATE values with reservation calendar dates.
--
-- IN_PROGRESS maintenance continues blocking the vehicle even
-- after scheduled_end until the job is completed or cancelled.
-- Completing a job does not automatically resolve other jobs
-- or make an unsafe vehicle available.
-- ============================================================

CREATE TABLE maintenance (
                             maintenance_id NUMBER GENERATED ALWAYS AS IDENTITY,
                             car_id NUMBER NOT NULL,
                             mechanic_id NUMBER,
                             damage_id NUMBER,
                             created_by NUMBER NOT NULL,
                             maintenance_type VARCHAR2(100 CHAR) NOT NULL,
                             description VARCHAR2(2000 CHAR),
                             scheduled_start DATE NOT NULL,
                             scheduled_end DATE NOT NULL,
                             started_at TIMESTAMP WITH TIME ZONE,
                             completed_at TIMESTAMP WITH TIME ZONE,
                             mileage_at_service NUMBER(10),
                             next_service_mileage NUMBER(10),
                             cost NUMBER(10, 2) DEFAULT 0 NOT NULL,
                             status VARCHAR2(20 CHAR) DEFAULT 'SCHEDULED' NOT NULL,
                             completion_notes VARCHAR2(2000 CHAR),
                             created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

                             CONSTRAINT pk_maintenance PRIMARY KEY (maintenance_id),

                             CONSTRAINT fk_maintenance_car FOREIGN KEY (car_id)
                                 REFERENCES cars (car_id),

                             CONSTRAINT fk_maintenance_mechanic FOREIGN KEY (mechanic_id)
                                 REFERENCES users (user_id),

                             CONSTRAINT fk_maintenance_damage FOREIGN KEY (damage_id)
                                 REFERENCES damages (damage_id),

                             CONSTRAINT fk_maintenance_creator FOREIGN KEY (created_by)
                                 REFERENCES users (user_id),

                             CONSTRAINT ck_maintenance_window CHECK (
                                 scheduled_end > scheduled_start
                                 ),

                             CONSTRAINT ck_maintenance_mileage CHECK (
                                 mileage_at_service IS NULL OR mileage_at_service >= 0
                                 ),

                             CONSTRAINT ck_maintenance_next CHECK (
                                 next_service_mileage IS NULL
                                     OR (
                                     next_service_mileage >= 0
                                         AND (
                                         mileage_at_service IS NULL
                                             OR next_service_mileage > mileage_at_service
                                         )
                                     )
                                 ),

                             CONSTRAINT ck_maintenance_cost CHECK (
                                 cost >= 0
                                 ),

                             CONSTRAINT ck_maintenance_status CHECK (
                                 status IN (
                                            'SCHEDULED',
                                            'IN_PROGRESS',
                                            'COMPLETED',
                                            'CANCELLED'
                                     )
                                 ),

                             CONSTRAINT ck_maintenance_started CHECK (
                                 status NOT IN ('IN_PROGRESS', 'COMPLETED')
                                     OR (
                                     started_at IS NOT NULL
                                         AND mechanic_id IS NOT NULL
                                     )
                                 ),

                             CONSTRAINT ck_maintenance_completed CHECK (
                                 (
                                     status = 'COMPLETED'
                                         AND completed_at IS NOT NULL
                                         AND started_at IS NOT NULL
                                         AND completed_at >= started_at
                                     )
                                     OR
                                 (
                                     status <> 'COMPLETED'
                                         AND completed_at IS NULL
                                     )
                                 )
);

CREATE INDEX ix_maintenance_window
    ON maintenance (car_id, status, scheduled_start, scheduled_end);

CREATE INDEX ix_maintenance_mechanic ON maintenance (mechanic_id);
CREATE INDEX ix_maintenance_damage ON maintenance (damage_id);
CREATE INDEX ix_maintenance_creator ON maintenance (created_by);


-- ============================================================
-- 15. MILEAGE RECORDS
-- Historical odometer readings.
-- The backend must ensure the rental belongs to the stated car.
-- Update cars.mileage and add a record in the same transaction.
-- Odometer readings must not move backwards in normal operation.
-- ============================================================

CREATE TABLE mileage_records (
                                 mileage_record_id NUMBER GENERATED ALWAYS AS IDENTITY,
                                 car_id NUMBER NOT NULL,
                                 recorded_by NUMBER NOT NULL,
                                 rental_id NUMBER,
                                 mileage NUMBER(10) NOT NULL,
                                 source VARCHAR2(20 CHAR) NOT NULL,
                                 notes VARCHAR2(1000 CHAR),
                                 recorded_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

                                 CONSTRAINT pk_mileage_records PRIMARY KEY (mileage_record_id),

                                 CONSTRAINT fk_mileage_car FOREIGN KEY (car_id)
                                     REFERENCES cars (car_id),

                                 CONSTRAINT fk_mileage_user FOREIGN KEY (recorded_by)
                                     REFERENCES users (user_id),

                                 CONSTRAINT fk_mileage_rental FOREIGN KEY (rental_id)
                                     REFERENCES rentals (rental_id),

                                 CONSTRAINT ck_mileage_value CHECK (
                                     mileage >= 0
                                     ),

                                 CONSTRAINT ck_mileage_source CHECK (
                                     source IN ('CHECK_OUT', 'CHECK_IN', 'MAINTENANCE', 'MANUAL')
                                     ),

                                 CONSTRAINT ck_mileage_rental_required CHECK (
                                     source NOT IN ('CHECK_OUT', 'CHECK_IN')
                                         OR rental_id IS NOT NULL
                                     )
);

CREATE INDEX ix_mileage_car_date
    ON mileage_records (car_id, recorded_at);

CREATE INDEX ix_mileage_user ON mileage_records (recorded_by);
CREATE INDEX ix_mileage_rental ON mileage_records (rental_id);


-- ============================================================
-- 16. CONTACT MESSAGES
-- Stores enquiries from the website's contact form.
-- user_id is optional so visitors can submit enquiries.
--
-- assigned_to identifies the staff member handling the enquiry.
-- Saving a message does not automatically send an email.
-- ============================================================

CREATE TABLE contact_messages (
                                  message_id NUMBER GENERATED ALWAYS AS IDENTITY,
                                  user_id NUMBER,
                                  full_name VARCHAR2(150 CHAR) NOT NULL,
                                  email VARCHAR2(254 CHAR) NOT NULL,
                                  subject VARCHAR2(150 CHAR) NOT NULL,
                                  message_body CLOB NOT NULL,
                                  status VARCHAR2(20 CHAR) DEFAULT 'NEW' NOT NULL,
                                  assigned_to NUMBER,
                                  resolution_notes VARCHAR2(2000 CHAR),
                                  resolved_at TIMESTAMP WITH TIME ZONE,
                                  created_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,

                                  CONSTRAINT pk_contact_messages PRIMARY KEY (message_id),

                                  CONSTRAINT fk_contact_user FOREIGN KEY (user_id)
                                      REFERENCES users (user_id),

                                  CONSTRAINT fk_contact_assignee FOREIGN KEY (assigned_to)
                                      REFERENCES users (user_id),

                                  CONSTRAINT ck_contact_status CHECK (
                                      status IN ('NEW', 'IN_PROGRESS', 'RESOLVED')
                                      ),

                                  CONSTRAINT ck_contact_resolved CHECK (
                                      (
                                          status = 'RESOLVED'
                                              AND resolved_at IS NOT NULL
                                              AND resolved_at >= created_at
                                          )
                                          OR
                                      (
                                          status <> 'RESOLVED'
                                              AND resolved_at IS NULL
                                          )
                                      )
);

CREATE INDEX ix_contact_user ON contact_messages (user_id);
CREATE INDEX ix_contact_assignee ON contact_messages (assigned_to);
CREATE INDEX ix_contact_status_date
    ON contact_messages (status, created_at);


-- ============================================================
-- 17. BOOKING AND AVAILABILITY RULES FOR THE BACKEND
-- ============================================================
--
-- These rules require application logic and transactions.
-- The foreign keys and CHECK constraints above do not enforce
-- relationships across multiple rows or tables.
--
-- BOOKING TRANSACTION
-- 1. Lock the selected cars row using SELECT ... FOR UPDATE.
-- 2. Recheck vehicle eligibility and pickup-location feasibility.
-- 3. Check overlapping confirmed/in-progress reservations.
-- 4. Check scheduled/in-progress maintenance.
-- 5. Check active overdue rentals.
-- 6. Calculate prices from database records.
-- 7. Insert the reservation and commit.
--
-- Two end-exclusive intervals overlap when:
--
-- existing_start < requested_end
-- AND existing_end > requested_start
--
-- All operations that change availability must use the same
-- vehicle-row locking convention. This includes booking edits,
-- checkout, return, maintenance and vehicle status changes.
--
-- For operations involving several vehicles, lock their rows
-- in ascending car_id order to reduce deadlock risk.
--
-- Do not assume an overdue vehicle has returned because its
-- reservation end_date is in the past.
--
-- Never accept client-submitted totals as authoritative.
-- Validate new booking dates against the current business date.
-- Preserve agreed prices on existing reservations.
-- Check a reused request_key belongs to the same user/request.
--
-- ============================================================
-- 18. PERMISSIONS AND DATA CONSISTENCY RULES FOR THE BACKEND
-- ============================================================
--
-- CUSTOMER
-- Browse vehicles and view availability.
-- Create, view and cancel their own eligible reservations.
-- Never access another customer's booking or payment details.
--
-- ADMIN
-- Manage vehicles, categories, locations, insurance and staff.
-- Manage reservations and authorised financial operations.
--
-- INSPECTOR
-- Carry out authorised checkout/check-in inspections.
-- Record vehicle condition, damage and mileage.
--
-- MECHANIC
-- View assigned maintenance and update authorised work records.
--
-- ADDITIONAL CHECKS
-- Validate role and ownership on every protected request.
-- Hash passwords using a suitable password-hashing algorithm.
-- Validate and revoke sessions on the server.
-- Keep related rental/reservation/car statuses consistent.
-- Verify damage and maintenance references concern the same car.
-- Verify damage charges concern the same rental.
-- Prevent duplicate active physical rentals for one vehicle.
-- Prevent overpayments and excessive refunds transactionally.
-- Authenticate payment-provider callbacks before marking paid.
-- Set updated_at explicitly when updating users, cars or bookings.
-- Require nonblank text and valid formats in API validation.
--
-- INSURANCE MODEL
-- One optional insurance plan is stored on each reservation.
-- Rentals inherit this through their reservation.
-- A separate rental_insurance table is therefore not required.
--
-- ============================================================
-- END OF SCHEMA
-- Sample data belongs in database/sample_data.sql.
-- ============================================================