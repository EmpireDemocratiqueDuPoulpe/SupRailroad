const TicketMarket = artifacts.require("TicketMarket");
const CardMarket = artifacts.require("CardMarket");

module.exports = async function (deployer) {
  // Deploy the ticket market
  await deployer.deploy(TicketMarket);

  // Deploy the card market
  await deployer.deploy(CardMarket);
};
