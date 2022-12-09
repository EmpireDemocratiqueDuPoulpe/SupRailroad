const UserWalletFactory = artifacts.require("UserWalletFactory");
const TicketFactory = artifacts.require("TicketFactory");
const CardMarket = artifacts.require("CardMarket");

module.exports = async function (deployer) {
  // Deploy the user wallet.
  await deployer.deploy(UserWalletFactory);

  // Deploy the card market
  await deployer.deploy(CardMarket);

  // Deploy the ticket factory
  await deployer.deploy(TicketFactory);
};
