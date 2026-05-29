# mitre-attack-explorer
Full Stack web application for exploring and searching MITRE ATT&amp;CK techniques using React, Node.js, Express and SQLite.

# Project Versions Roadmap

## Version(1.0.0) - Project Setup

* Create Monorepo structure
* Setup React frontend
* Setup Node.js backend
* Install Express
* Install SQLite (better-sqlite3)
* Configure Git repository

## Version(1.1.0) - Database Infrastructure

* Create SQLite database
* Create attacks table
* Implement database connection layer
* Configure automatic database creation

## Version(1.2.0) - MITRE Importer

* Load MITRE ATT&CK JSON files
* Parse JSON content
* Extract required fields
* Handle missing values (NA)

## Version(2.0.0) - Database Population

* Insert MITRE attacks into SQLite
* Prevent duplicates
* Validate imported data

## Version(2.1.0) - Backend API

* Create Express server
* Implement GET /attacks
* Implement GET /attacks/search
* Return JSON responses

## Version(3.0.0) - Frontend Integration

* Connect React to Backend
* Fetch attacks from API
* Display attacks in Grid/List view

## Version(3.1.0) - Search Functionality

* Implement search bar
* Connect search to API
* Display filtered results dynamically

## Version(4.0.0) - Final UI & Submission

* Improve UI/UX
* Add styling and design
* Bug fixes
* Documentation
* Final project preparation
