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
    event BoughtTicket(string name);

    /// Functions
    function buyTicket() external payable {
        require(msg.value == ticketPrice);

        Ticket memory ticket = Ticket(msg.sender, "Bonjour");
        super._addTicket(msg.sender, ticket);

        emit BoughtTicket(ticket.name);
    }
}
