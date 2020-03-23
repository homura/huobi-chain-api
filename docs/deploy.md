# Deployment

## Requirement

- MySQL ≥ 5.7
- NodeJS >= 12.0

## Quick start with Ubuntu

### Install MySQL

```shell script
apt install mysql
```

## Install NodeJS

https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages

## Clone this project

```
git clone https://github.com/homura/hermit-purple-server.git
cd hermit-purple-server
```

## Define environment variables

### (Recommend) Create an `.env` file in the directory of this project

this is an example `.env` file

```env
# the Muta GraphQL RPC endpoint
# note:
# /graphql is an endpoint
# /graphiql is an IDE of GraphQL
# we should use "http://x.x.x.x/graphql" here
MUTA_ENDPOINT=http://127.0.0.1:8000/graphql

HERMIT_DATABASE_URL=mysql://user:password@localhost:3306/muta

# The maximum skip size of page turning during list query
HERMIT_MAX_SKIP_SIZE=10000

# ChainID of the running Muta instance
MUTA_CHAINID=0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036

# maximum concurrency when sync
# note: a large number may make Muta slower
HERMIT_FETCH_CONCURRENCY=50

# server listening port
# after start the server, we can open http://127.0.0.1:4040
# to a GraphQL playground
HERMIT_PORT=4040

# maximum cost each query task
HERMIT_MAX_COMPLEXITY=100

# CORS origin, empty to disable CORS
HERMIT_CORS_ORIGIN=
```

## Build this project

```
npm install
npm run build
```

## Setup the database(via MySQL and migration script automatic )

Create the schema automatic if `HERMIT_DATABASE_URL` is set

```
npm run migrate 001 up
```

Also we can drop the database

```
npm run migrate 001 down
```

## Start server and sync(via pm2)

Recommend to use **[pm2](https://pm2.keymetrics.io/)** as the daemon process manager

### Create a `pm2.json` as configuration file

```json
{
  "apps": [
    {
      "name": "huobi-chain-api",
      "script": "npm",
      "args": "start"
    },
    {
      "name": "huobi-chain-sync",
      "script": "npm",
      "args": "run sync",
      "env": {
        "DEBUG": "sync:*"
      }
    }
  ]
}
```

### Install `pm2` and start it

```
npm install pm2 -g
pm2 start pm2.json
```

Then we would see a table like this

```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ huobi-chain-api    │ fork     │ 0    │ online    │ 0.2%     │ 45.9mb   │
│ 1  │ huobi-chain-sync   │ fork     │ 0    │ online    │ 0.2%     │ 45.5mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

### View log files

```
pm2 log huobi-chain-api
# or
pm2 log huobi-chain-sync
```

## Start the server and sync (directly)

### Sync remote block to database

```
# Open the log on console
export DEBUG=sync:*
# recommend pm2
npm run sync
```

### Run the API server

```
# recommend pm2
npm run start

# try the API in browser directly
open http://127.0.0.1:4040
```