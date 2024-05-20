# Final Project SOA & Microservices
# Authors: Achraf BEN CHEIKH LADHARI & Nour Alislem SBAA
This project is a demonstration of a microservices architecture using Python and Node.js, with Kafka and gRPC for inter-service communication. The project consists of three microservices:

1. **Games Service** (Python)
2. **Orders Service** (Node.js)
3. **Users Service** (Node.js)

## Technologies Used

- **gRPC**: For communication between services also between API Gateway and services.
- **Kafka**: For message passing between the API Gateway and services (If the request was send from client with GraphQL).
- **REST and GraphQL**: Supported for sending requests to the API Gateway from the client.
- **Swagger UI**: Provided for sending REST requests to APIs.
- **Docker**: Dockerfiles are included to generate containers for each service, API Gateway, and Swagger UI.
- **docker-compose**: Configuration provided for spinning up all containers with one command.
- **Jenkins**: CI/CD pipeline setup for automated builds and deployment.

## Project Structure

- **Games Service**: Python service for handling game-related operations.
- **Orders Service**: Node.js service for managing order operations.
- **Users Service**: Node.js service for user management.
- **API Gateway**: Routes requests to the appropriate service using gRPC.
- **Swagger UI**: Web interface for sending REST requests to the APIs.
- **Bash Script**: Included for sending requests with GraphQL and REST.
- **Jenkins Pipeline**: CI/CD pipeline for building, testing, and deploying the services.

## Usage

### API Gateway

The API Gateway runs on port 3000 and accepts requests via gRPC. You can send requests using either REST or GraphQL.

### Swagger UI

Swagger UI is available for sending REST requests to all APIs. It runs on port 4000.

### Docker

Use the provided Dockerfiles to generate containers for each service, API Gateway, and Swagger UI. The docker-compose.yml file is available for spinning up all containers with one command.

### Bash Script

A bash script is included for sending all requests with GraphQL and REST.


### Jenkins

The CI/CD pipeline in Jenkins includes the following steps:

1. Verifying tools
2. Versioning
3. Clean up before building
4. Building
5. Send Requests (Test)
6. Logging containers (Test)
7. Deploy
8. Emailing

## API Routes

### Users Service

- **GET /users**: Retrieve all users.
- **GET /users/:id**: Retrieve a specific user by ID.
- **UPDATE /users/:id**: Update a specific user by ID.
- **POST /users**: Create a new user.
- **DELETE /users/:id**: Delete a specific user by ID.

### Games Service

- **GET /games/:id**: Retrieve a specific game by ID.
- **GET /games**: Retrieve all games.
- **POST /games**: Create a new game.

### Orders Service

- **GET /orders/:id**: Retrieve a specific order by ID.
- **GET /orders**: Retrieve all orders.
- **POST /orders**: Create a new order.

## Architecture
### REST
![REST](https://raw.githubusercontent.com/Achraf-Ben-Cheikh-Ladhari/projet-microservices/main/screens/rest.png)

### GraphQL
![GraphQL](https://raw.githubusercontent.com/Achraf-Ben-Cheikh-Ladhari/projet-microservices/main/screens/graphql.png)

### Kafka
![Kafka](https://raw.githubusercontent.com/Achraf-Ben-Cheikh-Ladhari/projet-microservices/main/screens/kafka.png)


## Contributors

- [Achraf BEN CHEIKH LADHARI](https://github.com/Achraf-Ben-Cheikh-Ladhari)
- [Nour ALISLEM SBAA](https://github.com/NourSbaa)

### Tools: NodeJS, gRPC, Kafka, MongoDB, Python, Apollo, Swagger, Docker, Jenkins
