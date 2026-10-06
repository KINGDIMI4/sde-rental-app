-- ============================================================
-- CAR RENTAL FLEET AND VEHICLE MANAGEMENT SYSTEM
-- Sample Data
-- Oracle SQL
-- ============================================================


-- ============================================================
-- 1. USERS
-- ============================================================

INSERT INTO users
(user_id, first_name, last_name, email, phone, role)
VALUES
(1, 'John', 'Admin', 'admin@carrental.com', '+3611111111', 'ADMIN');

INSERT INTO users
(user_id, first_name, last_name, email, phone, role)
VALUES
(2, 'David', 'Johnson', 'david@example.com', '+3612222222', 'CUSTOMER');

INSERT INTO users
(user_id, first_name, last_name, email, phone, role)
VALUES
(3, 'Sarah', 'Williams', 'sarah@example.com', '+3613333333', 'CUSTOMER');

INSERT INTO users
(user_id, first_name, last_name, email, phone, role)
VALUES
(4, 'Michael', 'Brown', 'michael@carrental.com', '+3614444444', 'INSPECTOR');

INSERT INTO users
(user_id, first_name, last_name, email, phone, role)
VALUES
(5, 'Daniel', 'Smith', 'daniel@carrental.com', '+3615555555', 'MECHANIC');


-- ============================================================
-- 2. CAR CATEGORIES
-- ============================================================

INSERT INTO car_categories
(category_id, category_name, description, default_daily_rate)
VALUES
(1, 'Economy', 'Small and fuel efficient cars', 35);

INSERT INTO car_categories
(category_id, category_name, description, default_daily_rate)
VALUES
(2, 'Sedan', 'Comfortable four-door cars', 55);

INSERT INTO car_categories
(category_id, category_name, description, default_daily_rate)
VALUES
(3, 'SUV', 'Sport utility vehicles', 75);

INSERT INTO car_categories
(category_id, category_name, description, default_daily_rate)
VALUES
(4, 'Electric', 'Electric powered cars', 65);

INSERT INTO car_categories
(category_id, category_name, description, default_daily_rate)
VALUES
(5, 'Luxury', 'Premium luxury vehicles', 120);


-- ============================================================
-- 3. CARS
-- ============================================================

INSERT INTO cars
(car_id, category_id, registration_number, brand, model,
 production_year, color, mileage, fuel_level, daily_rate,
 status, location)
VALUES
(101, 1, 'CAR-101', 'Toyota', 'Yaris',
 2023, 'White', 18000, 90, 35,
 'AVAILABLE', 'Debrecen');

INSERT INTO cars
(car_id, category_id, registration_number, brand, model,
 production_year, color, mileage, fuel_level, daily_rate,
 status, location)
VALUES
(202, 2, 'CAR-202', 'BMW', '320i',
 2022, 'Black', 32000, 80, 55,
 'AVAILABLE', 'Debrecen');

INSERT INTO cars
(car_id, category_id, registration_number, brand, model,
 production_year, color, mileage, fuel_level, daily_rate,
 status, location)
VALUES
(303, 3, 'CAR-303', 'Toyota', 'RAV4',
 2023, 'Grey', 25000, 85, 75,
 'AVAILABLE', 'Budapest');

INSERT INTO cars
(car_id, category_id, registration_number, brand, model,
 production_year, color, mileage, fuel_level, daily_rate,
 status, location)
VALUES
(404, 4, 'CAR-404', 'Tesla', 'Model 3',
 2024, 'Blue', 12000, 95, 65,
 'AVAILABLE', 'Debrecen');

INSERT INTO cars
(car_id, category_id, registration_number, brand, model,
 production_year, color, mileage, fuel_level, daily_rate,
 status, location)
VALUES
(505, 5, 'CAR-505', 'Mercedes-Benz', 'E-Class',
 2023, 'Black', 21000, 90, 120,
 'AVAILABLE', 'Budapest');


-- ============================================================
-- 4. INSURANCE
-- ============================================================

INSERT INTO insurance
(insurance_id, insurance_name, description, daily_rate)
VALUES
(1, 'Basic Insurance',
 'Basic rental insurance coverage', 8);

INSERT INTO insurance
(insurance_id, insurance_name, description, daily_rate)
VALUES
(2, 'Premium Insurance',
 'Extended insurance coverage', 15);


-- ============================================================
-- 5. RESERVATIONS
-- ============================================================

INSERT INTO reservations
(reservation_id, customer_id, car_id, insurance_id,
 start_date, end_date, number_of_days,
 total_price, status)
VALUES
(1001, 2, 101, 1,
 DATE '2026-10-10',
 DATE '2026-10-13',
 3,
 129,
 'CONFIRMED');

INSERT INTO reservations
(reservation_id, customer_id, car_id, insurance_id,
 start_date, end_date, number_of_days,
 total_price, status)
VALUES
(1002, 3, 404, 2,
 DATE '2026-10-15',
 DATE '2026-10-18',
 3,
 240,
 'PENDING');


-- ============================================================
-- 6. RENTALS
-- ============================================================

INSERT INTO rentals
(rental_id, reservation_id, customer_id, car_id,
 checkout_date, expected_return_date,
 actual_return_date, checkout_mileage,
 return_mileage, checkout_fuel_level,
 return_fuel_level, total_price, status)
VALUES
(2001, 1001, 2, 101,
 DATE '2026-10-10',
 DATE '2026-10-13',
 DATE '2026-10-13',
 18000,
 18350,
 90,
 70,
 129,
 'COMPLETED');


-- ============================================================
-- 7. INSPECTIONS
-- ============================================================

INSERT INTO inspections
(inspection_id, rental_id, inspector_id,
 inspection_type, mileage, fuel_level,
 exterior_condition, interior_condition, notes)
VALUES
(3001, 2001, 4,
 'CHECK_OUT',
 18000,
 90,
 'Good',
 'Clean',
 'Vehicle checked before rental');

INSERT INTO inspections
(inspection_id, rental_id, inspector_id,
 inspection_type, mileage, fuel_level,
 exterior_condition, interior_condition, notes)
VALUES
(3002, 2001, 4,
 'CHECK_IN',
 18350,
 70,
 'Minor scratch on rear bumper',
 'Good',
 'Vehicle returned and inspected');


-- ============================================================
-- 8. DAMAGES
-- ============================================================

INSERT INTO damages
(damage_id, inspection_id, damage_type,
 description, severity, repair_cost, resolved)
VALUES
(4001, 3002,
 'Scratch',
 'Small scratch on rear bumper',
 'MINOR',
 100,
 'NO');


-- ============================================================
-- 9. PAYMENTS
-- ============================================================

INSERT INTO payments
(payment_id, rental_id, amount,
 payment_date, payment_method,
 payment_status, transaction_reference)
VALUES
(5001, 2001,
 129,
 DATE '2026-10-10',
 'CARD',
 'PAID',
 'TXN-100001');


-- ============================================================
-- 10. MAINTENANCE
-- ============================================================

INSERT INTO maintenance
(maintenance_id, car_id, mechanic_id,
 maintenance_type, description,
 scheduled_date, completed_date,
 mileage_at_service, cost, status,
 next_service_mileage)
VALUES
(6001, 101, 5,
 'Routine Service',
 'Oil change and general inspection',
 DATE '2026-09-20',
 DATE '2026-09-20',
 17500,
 150,
 'COMPLETED',
 25000);

INSERT INTO maintenance
(maintenance_id, car_id, mechanic_id,
 maintenance_type, description,
 scheduled_date, completed_date,
 mileage_at_service, cost, status,
 next_service_mileage)
VALUES
(6002, 202, 5,
 'Brake Service',
 'Brake pad inspection',
 DATE '2026-10-20',
 NULL,
 32000,
 300,
 'SCHEDULED',
 40000);


-- ============================================================
-- 11. MILEAGE RECORDS
-- ============================================================

INSERT INTO mileage_records
(mileage_record_id, car_id, recorded_by,
 mileage, notes)
VALUES
(7001, 101, 4,
 18000,
 'Mileage recorded during check-out');

INSERT INTO mileage_records
(mileage_record_id, car_id, recorded_by,
 mileage, notes)
VALUES
(7002, 101, 4,
 18350,
 'Mileage recorded during check-in');

INSERT INTO mileage_records
(mileage_record_id, car_id, recorded_by,
 mileage, notes)
VALUES
(7003, 202, 4,
 32000,
 'Routine mileage update');


-- ============================================================
-- 12. RENTAL INSURANCE
-- ============================================================

INSERT INTO rental_insurance
(rental_insurance_id, rental_id, insurance_id, price)
VALUES
(8001, 2001, 1, 24);


-- ============================================================
-- SAVE DATA
-- ============================================================

COMMIT;