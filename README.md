# Campus 360

Campus 360 is a polished frontend concept for a digital campus ecosystem built with HTML, CSS and vanilla JavaScript. It brings together core campus information and services such as events, announcements, map navigation, library, canteen, lost & found, portals and community features into a single student-focused experience.

## Overview

This project simulates a modern campus platform for an institute such as APSIT, using demo data and LocalStorage-driven persistence. It demonstrates how a college experience can be centralized through a single digital hub.

## Features

- Modern responsive landing page and global navigation
- Search overlay with campus-level filtering
- Upcoming events and registration simulation
- Announcements with read/unread states
- Campus news, blogs and saving experience
- Interactive SVG campus map with route highlighting
- Canteen menu and cart order simulation
- Library book browsing and details
- Lost & found reporting and community discovery
- Report issue workflow with generated IDs
- Feedback submission
- Club membership simulation
- Academic calendar and timetable-style views
- Profile dashboard and notification center
- Dark mode and LocalStorage persistence

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage
- Semantic, responsive UI design

## Project Structure

- `index.html` — main entry point
- `css/style.css` — base layout and Events editorial styles
- `css/components.css` — shared Campus 360 tokens, controls, and reusable component/page patterns
- `css/responsive.css` — tablet and mobile layout adjustments
- `js/data.js` — mock campus datasets
- `js/storage.js` — LocalStorage abstraction
- `js/*.js` — modular feature scripts for search, events, map, canteen, library, reports, feedback and more

## Design system and page patterns

The Events page is the visual reference: warm paper and ink surfaces, restrained terracotta accents, Instrument Serif display headings, Inter interface text, fine rules, compact labels, and low-emphasis borders. Shared tokens and components live in `css/components.css`; breakpoints and layout changes live in `css/responsive.css`.

Page layouts follow their content rather than reusing one card grid: announcements use a compact priority/read-state register; News and Blogs use a lead story with an editorial list; Library combines search, category and availability filters with a resource list; Canteen pairs categorized menu rows with an order summary; the Map prioritizes location search and routes; Dashboard surfaces personal metrics and important updates; and Profile and support pages prioritize preferences, forms, and submission/report status.

## How to Run

From the repository root, open the project folder in a browser or serve it locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in the browser.

## Key JavaScript Concepts Demonstrated

- DOM rendering and event delegation
- Filtering and search logic
- State and LocalStorage management
- Reusable UI patterns for modals and toasts
- Array/object-based mock data modeling
- Interactive SVG route drawing
- Simulated workflows like checkout and registrations

## LocalStorage Usage

The site stores demo user state such as:

- Theme preference
- Profile preferences
- Registering events
- Cart and orders
- Notifications read state
- Club memberships
- Lost/found entries
- Issue reports
- Feedback entries and recent submission status
- Saved blog drafts

## Screenshots

Add screenshots here after running the project in a browser.

## Future Improvements

- Multi-page architecture for more complex sections
- More polished map detail and direction logic
- Better dashboard analytics sections
- Improved accessibility with stricter focus management
- Additional user personalization settings

## Disclaimer

This is a frontend academic/demo project created for concept design and demonstration. All campus data is sample content and is not necessarily official APSIT information.
