# SupRailroad - Solidity contracts

> **⚠️ WARNING**
> 
> Do not run `truffle migrate`, it will not work! Read the next section for more information.

## Index
- [Home](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/README.md)
	1. [Solidity contracts - _you are here_](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/truffle/README.md)
	2. [Oracle](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/oracle/README.md)
	3. [Front-end app](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/client/README.md)

## Installation
### Dependencies
Install the dependencies with the following command: `npm install`.

### Environnement
As specified in the [truffle-config.js](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/truffle/truffle-config.js)
file, these contracts are deployed locally on any network. Your environment (Ganache, ...) must use port `8545` in order
to successfully migrate the project. A change in this file can cause unexpected errors. Please don't.

You must define an address as administrator to use some of the features of this project. To do this, open the file
[Administrable.sol](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/truffle/contracts/Administrable.sol)
and replace the address of one of the `ADMINX` constants with your address. After the migration, this address will be a
registered administrator.

### Migration
This project uses an oracle that also needs the build files. Instead of running the `truffle migrate` command directly,
we exposed two scripts in the [package.json](https://github.com/EmpireDemocratiqueDuPoulpe/SupRailroad/blob/main/truffle/package.json)
file.

To start the migration, you need to run the following command: `npm run migrate-v1`. But as some computers are configured
in a strange way, it is possible that this command displays the following error at the very end:
```
/usr/bin/bash: postMigrate.cmd: command not found
```

If this is the case, you must use the second script instead of the previous one: `npm run migrate-v2`.
