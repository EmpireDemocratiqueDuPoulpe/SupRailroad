const UserWalletFactory = artifacts.require("UserWalletFactory");
const TicketFactory = artifacts.require("TicketFactory");
const CardFactory = artifacts.require("CardFactory");

module.exports = function (deployer) {
  deployer.deploy(UserWalletFactory);
  deployer.deploy(TicketFactory);
  deployer.deploy(CardFactory);
};
