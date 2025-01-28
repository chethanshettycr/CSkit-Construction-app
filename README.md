 # Project Name: CSkit-Construction-app

## Overview
CS-Kit is a modern web application built using **Next.js** and **TypeScript**, leveraging **Tailwind CSS** for styling and reusable UI components. It includes various pages and functionalities tailored for different user roles such as consumer, seller, and admin.

## Features
- Multi-role support: Consumer, Seller, and Admin.
- Modular and reusable UI components.
- State-of-the-art UI/UX using Tailwind CSS.
- Authentication flows for login and profile management.
- Shopping cart and order management.

## Prerequisites
To run this project locally, ensure you have the following installed:
- **Node.js** (v16 or higher) and npm (v8 or higher)
- A code editor like VSCode

## Installation
Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cs-kit.git
   ```

2. Navigate to the project directory:
   ```bash
   cd cs-kit
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Project
To run the project in development mode:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Building for Production
To create a production build:

1. Build the project:
   ```bash
   npm run build
   ```

2. Serve the production build:
   ```bash
   npm start
   ```

## Project Structure
Here is a brief overview of the key directories:

- **`/app`**: Contains all the pages and core logic for the app.
  - `page.tsx`: Main landing page.
  - `layout.tsx`: Shared layout structure.
  - Subfolders like `consumer`, `seller`, `admin` for role-specific pages.

- **`/components/ui`**: Reusable UI components (e.g., buttons, dialogs, inputs).

- **`/hooks`**: Custom React hooks (e.g., `use-toast.ts`, `use-mobile.tsx`).

- **`/public`**: Static assets like images and logos.

- **`/styles`**: Global CSS files.

## Key Scripts
Here are the main npm scripts included in the `package.json`:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Runs the production server.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature-name'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For questions or support, reach out at [your-email@example.com].

