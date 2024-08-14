# App

Find a Friend API.

## FR (Functional Requirements)

- [x] Must be possible to register a pet;
- [x] Must be possible to list all pets;
- [x] Must be possible to filter pets by their characteristics;
- [x] Must be possible to get the pet details for adoption;
- [x] Must be possible to register as ORG;
- [x] Must be possible to authenticate as ORG;

## BR (Business Rules)

- [x] The user must inform the city to list all pets;
- [x] The ORG must have an address and whatsapp number;
- [x] A pet must be linked to a ORG;
- [x] The ORG number must be available in the pet's details;
- [x] All filters, aside from city, are optional;
- [x] For a ORG to access the app as admin, it must be loged in;

## NFR (Non-Functional Requirements)

- [ ] ORG must be in admin mode to register a pet;
- [x] The ORG password must be hashed;
- [x] The application data must be persistent in a PostgreSQL database;
- [x] All the lists must be paginated with 20 items per page;
- [ ] The ORG can be identified by a JWT(JSON Web Token);
