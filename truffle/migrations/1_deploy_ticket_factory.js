const UserWalletFactory = artifacts.require("UserWalletFactory");
const TicketFactory = artifacts.require("TicketFactory");
const CardFactory = artifacts.require("CardFactory");

module.exports = function (deployer) {
  deployer.deploy(UserWalletFactory).then(() => {
    deployer.deploy(CardFactory, UserWalletFactory.address);
  });
  deployer.deploy(TicketFactory);
};
