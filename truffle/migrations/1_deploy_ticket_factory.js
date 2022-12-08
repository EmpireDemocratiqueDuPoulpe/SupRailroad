const UserWalletFactory = artifacts.require("UserWalletFactory");
const TicketFactory = artifacts.require("TicketFactory");
const CardFactory = artifacts.require("CardFactory");

module.exports = async function (deployer) {
  // Deploy the user wallet.
  await deployer.deploy(UserWalletFactory);

  // Deploy the card factory
  await deployer.deploy(CardFactory);

  // Deploy the ticket factory
  await deployer.deploy(TicketFactory);
};
