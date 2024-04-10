# GPT Trivia Metadata Service

Backend service serving API endpoints to support the GPT Trivia application

## Tech stack

- [NestJS](https://docs.nestjs.com/)

## TODO

- Build stuff.
    - Docker container setup.
    - SSL/TLS for DB connection.
    - Secrets management for DB credentials
- Improve logging.
    - The [Logger](./src/common/logger/logger.service.ts) can be more robust. Enabling exporting logs to a data store or external service (Elastic) would be beneficial.
- Error management.
    - Current implementation is simplistic and redundant. Util functions can consolidate logic.
- Documentation.
    - Generating OpenAPI documentation for the API will be beneficial
