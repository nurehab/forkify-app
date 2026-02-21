# 🍴 Forkify - Modern Recipe Application

A sophisticated JavaScript application built with the **MVC Architecture** to search, upload, and manage food recipes. This project was developed as part of a deep dive into modern JavaScript patterns and API integrations.

## 🚀 Features
* **Advanced Recipe Search:** Search through 1,000,000+ recipes with seamless API integration.
* **MVC Architecture:** Built for scalability and clean code separation (Model-View-Controller).
* **Custom Recipe Upload:** Authenticated POST requests to the Forkify API using a unique **API Key**.
* **User-Specific Content:** Unique user icons for recipes uploaded by the user, managed via API Key identification.
* **Pagination:** Smooth navigation through search results.
* **State Management:** Robust local state for bookmarks and recipe data.

## 🛠️ Technical Challenges & Solutions
* **API Key Security:** Implemented a unique API key system to allow users to create and store their own recipes privately.
* **Rate Limiting:** Handled 429 errors (Too many requests) by implementing defensive programming and informing the user about server constraints.
* **Internal Server Errors (500):** Debugged complex POST requests by validating ingredient formats and ensuring data mapping matched the API schema.
* **Efficient UI Updates:** Used a custom `update()` method to modify text and attributes in the DOM without re-rendering entire components.

## 💻 Tech Stack
* **JavaScript (ES6+):** Async/Await, OOP, Closures.
* **Sass/CSS:** For modular styling.
* **Parcel:** Module bundling and development server.
