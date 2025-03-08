# Software Advisor

The **Software Advisor** project provides software recommendations based on specific user task descriptions. Using **Node.js** in the backend, it connects to the **Google Gemini API** to generate AI-based recommendations. This repository contains the backend setup with a planned **Next.js** frontend.

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
    git clone https://github.com/RNViththagan/software-advisor.git
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    - Create a `.env` file and add your Google Gemini API key:
      ```
      VITE_GEMINI_API_KEY=your_api_key_here
      ```

4. **Run project:**
    ```bash
    npm run dev   
   ```
   

## Contributing

Feel free to fork the repository and submit pull requests for improvements, new features, or bug fixes.
