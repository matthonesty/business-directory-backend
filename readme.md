
---

# Business Directory Backend

## Project Overview

This repository contains the backend code for the Business Directory platform, a service designed to connect business owners and users by allowing businesses to be registered, rated, and managed efficiently. The backend is built using Node.js and Express and leverages PostgreSQL for data storage. It includes features such as JWT authentication for security, role-based access control to differentiate between regular users, business owners, and admins, and an API for interacting with the platform's data.

## Features

- **Business Registration**: Business owners can register their businesses by selecting from a predefined list of categories.
- **User Authentication**: Secure user authentication using JWT (JSON Web Token).
- **Role-Based Access Control**: Differentiates between regular users, business owners, and admins.
- **Business Search and Ratings**: Allows users to search for businesses and leave ratings.
- **Admin Management**: Admins can manage the platform by approving or rejecting business registrations.
- **Data Persistence**: Integration with PostgreSQL for reliable data storage.
- **Category Management**: Businesses are categorized into predefined categories for easier search and filtering.

## Technologies Used

- **Node.js**: JavaScript runtime environment used to build the backend server.
- **Express**: Web framework for Node.js, used for building APIs and handling requests.
- **PostgreSQL**: Relational database used for data storage and management.
- **Prisma**: ORM (Object-Relational Mapping) tool used to interact with the PostgreSQL database.
- **JWT (JSON Web Tokens)**: Used for secure user authentication and authorization.
- **Nodemon**: Development tool that automatically restarts the server when file changes are detected.

## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed on your system. You can download it from [here](https://nodejs.org/).
- **PostgreSQL**: Install PostgreSQL and set up a database for the application.
- **Docker** (Optional): For running the application inside a container.

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

    Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    DATABASE_URL=postgresql://username:password@localhost:5432/business_directory
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```

    Replace `username`, `password`, and other placeholders with your actual database credentials and preferred settings.

4. **Migrate the Database**:

    Set up your database schema using Prisma migrations:

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

    The server will start, and you can access it on `http://localhost:5000`.

### API Endpoints

- **Authentication**:
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Login and receive a JWT token.

- **Categories**:
  - `GET /api/categories`: Retrieve all categories.

- **Businesses**:
  - `POST /api/business/register`: Register a new business.
  - `GET /api/business`: Get a list of all businesses.
  - `GET /api/business/:id`: Get a specific business by ID.

- **Admin**:
  - `GET /api/admin/pending-businesses`: Get all pending business registrations.
  - `PUT /api/admin/approve-business/:id`: Approve a business registration.
  - `DELETE /api/admin/reject-business/:id`: Reject a business registration.

### Running Tests

Tests are located in the `tests` directory. To run the tests, use:

```bash
npm test
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For any questions or suggestions, please contact
 - [Fitsum Helina](mailto:dev.fitsum@gmail.com).
 - [Yeabsira Behailu](https://github.com/Yabe12).

---