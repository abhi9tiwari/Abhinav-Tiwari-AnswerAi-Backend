
# AnswerAi Application

This application is a scalable API service that allows users to submit questions and receive AI-generated answers. It is built with Node.js, Express, and MongoDB, and integrates an AI model (Google Gemini) to generate answers for user-submitted questions.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Dockerization](#dockerization)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**: Secured with JWT for stateless, token-based authentication.
- **AI-Generated Answers**: Integrates with an AI model to generate responses based on user-submitted questions.
- **Scalable Architecture**: Designed to handle high concurrency with message queues and caching.
- **Real-Time Notifications**: Users are notified when answers are ready through WebSockets or push notifications.
- **Error Handling**: Comprehensive error handling and graceful fallbacks for high loads or AI service downtime.

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Integration**: Google Gemini
- **Authentication**: JWT

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB instance running on MongoDb Atlas
- Docker (for containerization)

### Installation

1. Clone the repository:
   bash
   git clone https://github.com/your-username/Abhinav-Tiwari-AnswerAi-Backend.git

2. Install dependencies:
   bash
   npm install

3. Set up the environment variables (see below).

4. Start the application:
   bash
   npm start

### Environment Variables

Create a `.env` file in the root directory and set the following environment variables:

PORT=8000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key

## Dockerization

To run the app in a Docker container:

1. Build the Docker image:
   bash
   docker build .

2. Run the container:
   bash
   docker run -p 8000:8000


Replace placeholders (like `your-mongodb-connection-string`, `your-openai-api-key`, etc.) with actual values or instructions on where to obtain them. All the other related docs are added in otherRequiredDocs folder please take a look.
