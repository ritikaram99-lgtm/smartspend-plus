# SmartSpend+ 💸

SmartSpend+ is a modern, responsive personal finance management application built with the MERN stack (MongoDB, Express, React, Node.js). It helps users track their income, monitor expenses across various categories, and get smart insights into their spending habits.

## 🌟 Features

- **User Authentication:** Secure sign-up and login using JWT (JSON Web Tokens).
- **Interactive Dashboard:** Visual breakdown of expenses using dynamic charts and a calculated "Financial Health Score".
- **Expense Tracking:** Add, edit, and delete daily expenses with ease.
- **Expense Calendar:** View all your transactions laid out on a monthly calendar view.
- **Smart Insights:** Get AI-like suggestions and alerts based on your spending rate.
- **Responsive Design:** A beautiful, dark-themed UI that works perfectly on desktop, tablet, and mobile devices.

## 🛠 Tech Stack

- **Frontend:** React.js, React Router, Chart.js (for data visualization), FullCalendar.
- **Backend:** Node.js, Express 5.x.
- **Database:** MongoDB (using Mongoose).
- **Authentication:** JWT & bcryptjs.

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/ritikaram99-lgtm/smartspend-plus.git
cd smartspend-plus
```

### 2. Setup the Backend
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder with the following variables:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:3000
```
Start the backend server:
```bash
npm dev
```

### 3. Setup the Frontend
Open a new terminal and navigate to the `client` directory:
```bash
cd client
npm install
```
Create a `.env.local` file in the `client` folder:
```env
REACT_APP_API_URL=http://localhost:5001
```
Start the React application:
```bash
npm start
```
The app will automatically open in your browser at `http://localhost:3000`.

## 🌍 Deployment

SmartSpend+ is designed to be deployed easily on platforms like Render, Heroku, or Vercel. 

### Frontend (Static Site)
- Set the build command to `npm install && npm run build` (if deploying from the client directory).
- Set the publish directory to `build`.
- **Important:** Add `REACT_APP_API_URL` to your environment variables and point it to your deployed backend URL.
- **Important:** Set up a Rewrite Rule to catch all routes (`/*` to `/index.html`) to support React Router.

### Backend (Web Service)
- Set the root directory to `server`.
- Add `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` to your environment variables.
- Ensure your MongoDB Atlas Network Access is configured to allow connections from your hosting provider (e.g., `0.0.0.0/0`).

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/smartspend-plus/issues).

## 📝 License
This project is open-source and available under the MIT License.
