# health-check-api

The api can be spin up with a test db using the provided [docker-compose.yaml](./docker-compose.yaml) file.

- Further instructions are provided in [project-setup.md](./project-setup.md).

To use the image, refer to [.env.example](./.env.example) for the required environment variables.

## Workflow
The project automatically builds an image when changes are pushed to the main branch using Github Actions. The image can be pulled from `ghcr.io/mattisjensen/health-check-api:latest`

On Pull Requests
- tests are run to ensure code quality and functionality before allowing a merge to main.
- the image is built to ensure that the code builds correctly, but not pushed to the registry.

## Architecture

The project follows principles of [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) leveraging maintainability by having clear dependency flow and decoupling components for high cohesion and low coupling. 

In combination with dependency injection, this allows for flexible swapping of implementations and easier testing.

![Clean Architecture](img/clean-architecture.png)



The following illustrates how clean architecture got applied to the project with dependency injection to inject the repository implementation into the use case layer.
![repo-injection](img/repo-injection.png)
