# Database - Fleet & Vehicle Management System

## Overview

This folder contains the Oracle SQL database for the **Rental - Fleet & Vehicle Management System**.

The database is designed to manage rental cars, customers, reservations, rentals, inspections, damages, payments, insurance, maintenance, and mileage records.

The system is designed for **cars only**.

## Database Technology

- Database: Oracle Database
- SQL: Oracle SQL
- Tested using: Oracle FreeSQL

## Database Tables

The database contains 12 tables:

| Table | Description |
|---|---|
| `USERS` | Stores administrators, customers, inspectors, and mechanics |
| `CAR_CATEGORIES` | Stores vehicle categories and base rental rates |
| `CARS` | Stores information about rental cars |
| `INSURANCE` | Stores available insurance plans |
| `RESERVATIONS` | Stores customer vehicle reservations |
| `RENTALS` | Stores active and completed rentals |
| `INSPECTIONS` | Stores vehicle check-in/check-out inspections |
| `DAMAGES` | Stores damage records found during inspections |
| `PAYMENTS` | Stores rental payments |
| `MAINTENANCE` | Stores vehicle maintenance and repair records |
| `MILEAGE_RECORDS` | Stores vehicle mileage history |
| `RENTAL_INSURANCE` | Connects rentals with insurance plans |

## Main Relationships

- A user can make many reservations.
- A user can have many rentals.
- A car belongs to one car category.
- A car can have many reservations.
- A car can have many rentals.
- A car can have many maintenance records.
- A car can have many mileage records.
- A reservation can optionally have insurance.
- A reservation can be connected to a rental.
- A rental can have multiple inspections.
- A rental can have multiple payments.
- An inspection can contain multiple damage records.
- A rental can have multiple insurance records.

## Database Setup

Run the SQL files in the following order.

### 1. Create the database tables

Run:

```text
schema.sql