# Ride Sharing App

This project implements a ride-sharing application using Node.js, Express, and MongoDB. The application facilitates communication between travelers, companions, and administrators. Users can share ride details, review audit trails, track rides, share feedback, view notifications, and more.

## Prerequisites:

- **Node.js:** It provides the runtime environment for executing JavaScript on the server side. [Download and Install Node.js](https://nodejs.org/).

- **MongoDB:** The application uses MongoDB as its database system. Install MongoDB on your machine. [Download and Install MongoDB](https://www.mongodb.com/try/download/community).

- **npm (Node Package Manager):** npm is used to manage dependencies. It comes bundled with Node.js.

## Installation:

1. Clone the repository:
git clone https://github.com/YourUsername/Ride-Sharing-App.git

2. Move to the directory where the project is cloned using the 'cd' command.

3. Install dependencies using the following command:
npm install

4. Configure the database connection by editing the `index.js` file with your MongoDB connection details.

## Running the Application:

Start the server using the following command:
npm start

The server will run on `http://localhost:3000` by default (port number can be changed in `index.js` file).

## API Endpoints:

## Share Ride Details

**Endpoint:** POST `/share-ride-details`

**Description:** Shares details of a ride, including trip ID, driver information, and duration.

**Request Body:** JSON object with ride details.

**Example:**
```json
{
"tripId": "123",
"driverName": "John Doe",
"driverPhoneNumber": "123-456-7890",
"cabNumber": "ABC123",
"duration": "2 hours",
"companionUsername": "companion1"
}
```
**Response:** JSON object with a success message or an error message.

## Review Audit Trail

**Endpoint:** `GET /review-audit-trail`

**Description:** Retrieves the audit trail for a traveler, showing details of shared rides.

**Response:** Array of ride objects in JSON format.

## Track Ride

**Endpoint:** `POST /track-ride/:tripId`

**Description:** Tracks the status of a ride with a specified Trip ID.

**Response:** JSON object with a success message or an error message.

## Complete Ride

**Endpoint:** `POST /complete-ride/:tripId`

**Description:** Marks a ride with a specified Trip ID as completed.

**Response:** JSON object with a success message or an error message.

## Share Feedback

**Endpoint:** `POST /share-feedback`

**Description:** Allows travelers to share feedback about their ride experience.

**Request Body:** JSON object with feedback details.

**Example:**
```json
{
  "feedbackText": "Great ride experience!"
}
```
**Response:** JSON object with a success message or an error message.

## Retrieve Companion Notifications

**Endpoint:** `GET /companion-notifications`

**Description:** Retrieves notifications for a companion user.

**Response:** Array of notification objects in JSON format.

## Mark Notifications as Read

**Endpoint:** `POST /mark-notifications-as-read`

**Description:** Marks companion notifications as read.

**Response:** JSON object with a success message or an error message.

## View All Rides

**Endpoint:** `GET /view-all-rides`

**Description:** Retrieves details of all rides in the system.

**Response:** Array of ride objects in JSON format.

## Access Feedback

**Endpoint:** `GET /access-feedback`

**Description:** Retrieves feedback shared by travelers.

**Response:** Array of feedback objects in JSON format.

## Additional Notes:

- Ensure that MongoDB is running and accessible before starting the application.

- Proper error handling is implemented for database connection issues and duplicate ride entries.

- The application includes a simple web interface with forms for sharing ride details, tracking rides, and viewing notifications. Access it by visiting [http://localhost:3000](http://localhost:3000) in your browser.

- Postman can be used to test the API using the provided endpoints.
