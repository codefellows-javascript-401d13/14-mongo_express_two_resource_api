# Streetz REST API
This API has full CRUD routes for two resources with the use of MongoDB for data persistance

### Resources
- **Squad** - each squad has a unique ID, name, and list of playas in the squad
  - *endpoint*: `/api/squad`
    - POST request: adds squad to database
      - Must provide a *squadName* property in the request body
  - *endpoint*: `/api/squad/id`
    - GET request: returns squad with the provided id
    - PUT request: updates squad with the provided id
      - Provide *squadName* property in the request body
    - DELETE request: removes squad with the provided id

- **Playa** - each playa has a unique ID, name, swag level, and a squad they belong to
  - *endpoint*: `/api/squad/squadId/playa`
    - POST request: adds playa to database
      - Must provide a *playaName* and *swagLevel* property in the request body
  - *endpoint*: `/api/playa/id`
    - GET request: returns playa with the provided id
    - PUT request: updates playa with the provided id
      - Provide *playaName* property in the request body
    - DELETE request: removes playa with the provided id
