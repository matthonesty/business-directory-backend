Here's an updated and more professional version of the README for the business directory backend repository:

---

# Business Directory Backend

## Project Overview

This repository contains the backend code for the **Business Directory** platform, a service designed to connect business owners and users by enabling businesses to be registered, rated, and managed efficiently. The backend is built using Node.js and Express and leverages PostgreSQL for data storage. Key features include JWT authentication for security, role-based access control to differentiate between regular users, business owners, and admins, and a RESTful API for interacting with the platform's data.

## Features

- **Business Registration**: Allows business owners to register their businesses by selecting from a predefined list of categories.
- **User Authentication**: Secure user authentication using JWT (JSON Web Token) for session management.
- **Role-Based Access Control**: Differentiates access rights among regular users, business owners, and administrators.
- **Business Search and Ratings**: Enables users to search for businesses and leave ratings and reviews.
- **Admin Management**: Admins can manage the platform, including approving or rejecting business registrations.
- **Data Persistence**: Uses PostgreSQL for robust data storage and management.
- **Category Management**: Businesses are categorized into predefined categories, facilitating easy search and filtering.

## Technologies Used

- **Node.js**: JavaScript runtime for building scalable network applications.
- **Express**: Web framework for Node.js, used for building RESTful APIs and handling HTTP requests.
- **PostgreSQL**: Relational database management system for data persistence.
- **Prisma**: ORM (Object-Relational Mapping) tool for database interaction and schema management.
- **JWT (JSON Web Tokens)**: Used for implementing secure authentication and authorization.
- **Nodemon**: Development tool to automatically restart the server upon detecting file changes.

## Getting Started

### Prerequisites

- **Node.js**: Install from [Node.js official website](https://nodejs.org/).
- **PostgreSQL**: Install and set up PostgreSQL. Refer to the [official documentation](https://www.postgresql.org/docs/) for installation guidance.
- **Docker** (Optional): For containerization and easier deployment of the application.

### Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/Fitsumhelina/business-directory-backend.git
    cd business-directory-backend
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:

    Create a `.env` file in the root directory and define the following environment variables:

    ```plaintext
    JWT_SECRET=your_jwt_secret
    DATABASE_URL="postgresql://username:password@localhost:5432/Business-Directory?schema=public"
    PORT=your_port
    ```

    Replace placeholders with your actual database credentials, JWT secret, and preferred port number.

4. **Migrate the Database**:

    Set up the database schema using Prisma migrations:

    ```bash
    npx prisma migrate dev --name init
    ```

5. **Seed the Database**:

    Seed the database with predefined categories:

    ```bash
    npm run seed
    ```

6. **Start the Server**:

    ```bash
    npm start
    ```

    The server will start, and you can access the application at `http://localhost:5000`.

### API Endpoints

- **Authentication**:
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in and receive a JWT token.

- **Categories**:
  - `GET /api/categories`: Retrieve all categories.

- **Businesses**:
  - `POST /api/business/register`: Register a new business.
  - `GET /api/business`: Retrieve a list of all businesses.
  - `GET /api/business/:id`: Retrieve details of a specific business by ID.

- **Admin**:
  - `GET /api/admin/pending-businesses`: Retrieve all pending business registrations.
  - `PUT /api/admin/approve-business/:id`: Approve a business registration.
  - `DELETE /api/admin/reject-business/:id`: Reject a business registration.

### Running Tests

To run tests, execute the following command in the root directory:

```bash
npm test
```

Tests are located in the `tests` directory and cover various functionalities of the application.

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add feature description'`).
5. Push to the branch (`git push origin feature-branch-name`).
6. Create a Pull Request.

## License

This project is licensed under the MIT License. For more information, see the [LICENSE](LICENSE) file.

## Contact

For questions or suggestions, please reach out:

- Fitsum Helina: [dev.fitsum@gmail.com](mailto:dev.fitsum@gmail.com)
- Yeabsira Behailu: [GitHub Profile](https://github.com/Yabe12)

---

This README provides a detailed overview of the Business Directory Backend project, including setup instructions, API endpoints, and contact information for maintainers. Be sure to update any placeholders with actual project-specific details before publishing.