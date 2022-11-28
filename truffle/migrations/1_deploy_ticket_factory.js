const UserWalletFactory = artifacts.require("UserWalletFactory");
const TicketFactory = artifacts.require("TicketFactory");

module.exports = function (deployer) {
  deployer.deploy(UserWalletFactory);
  deployer.deploy(TicketFactory);
};
