pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./UserWalletFactory.sol";

contract TicketFactory is UserWalletFactory {
    constructor() {}

    /// Constants
    struct Ticket {
        address owner;
        string name;
    }

    uint ticketPrice = 0.001 ether;

    /// Events
    event BoughtTicket(address owner, string name);
    event TicketPriceChanged(uint newPrice);

    /// Functions
    function getPrice() external view returns(uint) {
        return ticketPrice;
    }

    function setPrice(uint price) external {
        ticketPrice = price;
        emit TicketPriceChanged(ticketPrice);
    }

    // TODO: Send value if too much
    function buyTicket() external payable {
        require(msg.value == ticketPrice);

        Ticket memory ticket = Ticket(msg.sender, "Bonjour");
        super._addTicket(msg.sender, ticket);

        emit BoughtTicket(ticket.owner, ticket.name);
    }
}
