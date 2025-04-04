# Sputnik APP

## Client

#### General
Stores recomposition is needed for all parts to work properly

#### NFT exchange
User can send NFT only to itself, to different collection.
This is because without separate blockchain we cannot synchronize both users consent which is required
The other way around is to create separate smart contract though
    
### Libraries: 
- [Vue3](https://vuejs.org/)
- [PrimeVue](https://primevue.org/) as UI library, in [unstyled mode](https://primevue.org/theming/unstyled/), customization is in some components and __prime.scss__ file
- [Pinia](https://pinia.vuejs.org/) for store management
- Keplr + @cosmjs libraries

### Notes

#### .env
```
VITE_API_URL: server address
VITE_HOST: client address
VITE_TAPI_URL: TAPI address (look below)
```


## Server

#### General
MongoDB is used for now, I suggest changing it to Postgres

### Libraries:
- [Fastify](https://fastify.dev/) — chosen over Express as it is a lot faster, as they say
- [Passport port for Fastify](https://github.com/fastify/fastify-passport)

### Notes

#### .env
```
DATABASE_URL: Prisma connection string
DATABASE_KEY: Useful if DB encryption is needed
DATABASE_VECTOR: Same as above
FRONTEND_HOST: client address
JWT_SECRET: needed for secure cookie storing
EXCHANGE_TWITTER_URL: Krogla exposed API for getting exchange rates
```
## TAPI

Fastify + passport does not handle Twitter authentication well, so this is the separate server for this purpose built on Express 
