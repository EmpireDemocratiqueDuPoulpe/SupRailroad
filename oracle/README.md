# SupRailroad - Oracle

## Index
- [Home](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/README.md)
	1. [Solidity contracts](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/truffle/README.md)
	2. [Oracle - _you are here_](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/oracle/README.md)
	3. [Front-end app](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/client/README.md)

## Installation
### Dependencies
Install the dependencies with the following command: `npm install`.

### Environnement
For security reasons, the oracle must call certain functions that are protected. You must provide an address that the
oracle will use for these calls. The address must be a registered administrator (see [1. Solidity contracts](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/truffle/README.md)).

Create an `.env` file in the [oracle root folder](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/tree/main/oracle)
containing the following data:
```dotenv
NODE_ENV="development"
ACCOUNT="YOUR ACCOUNT ADDRESS HERE"  # This address must be a registered administrator.
# SLEEP_INTERVAL=1000  # Optional (default=1000): Interval between queue processing.
# CHUNK_SIZE=10  # Optional (default=10): How many requests are addressed per queue processing.
```

## Starting
After the truffle migration, start the oracle with the following command: `npm start`. You should then see two messages
in the console confirming that the oracle is running and listening to events.
```
Successfully connected to the blockchain!
Announce done: this oracle is ready to work.
```
