# SupRailroad - Oracle
## Installation
First, you must install the dependencies.
```
npm install
```
Then, create a `.env` file in the oracle root folder containing the following data:
```dotenv
ACCOUNT="YOUR ACCOUNT ADDRESS HERE"
# SLEEP_INTERVAL=1000  # Optional (default=1000): Interval between queue processing.
# CHUNK_SIZE=10  # Optional (default=10): How many requests are addressed per queue processing.
```
Be sure to run the truffle migration before starting the oracle. See `../truffle/README.md` for more information.

## Start the oracle
To start the oracle, use:
```
npm start
```
