# Software Recommender

The **Software Recommender** project provides software recommendations based on specific user task descriptions. Using **Node.js** in the backend, it connects to the **Google Gemini API** to generate AI-based recommendations. This repository contains the backend setup with a planned **Next.js** frontend.

## Project Structure


## Features

- **Software Recommendations**: Provides recommendations for software based on the user’s task description.
- **API Integration**: Fetches software data from the **Google Gemini API**.
- **JSON Response**: Returns structured JSON data with software details such as name, price, platforms, features, and alternatives.
- **Price Conversion**: Converts prices to LKR (Sri Lankan Rupees).
- **Official Links**: Provides links to the official websites of the recommended software.

## Backend Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/RNViththagan/software-recommender.git
    ```

2. **Navigate to the backend directory:**
    ```bash
    cd software-recommender/backend
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Set up environment variables:**
    - Create a `.env` file and add your Google Gemini API key:
      ```
      GEMINI_API_KEY=your_api_key_here
      ```

5. **Run the backend server:**
    ```bash
    npm start
    ```
   The backend will be available at `http://localhost:5000`.

## Frontend Setup (Next.js)

The frontend will be built using **Next.js** (planned for later).

## Contributing

Feel free to fork the repository and submit pull requests for improvements, new features, or bug fixes.
