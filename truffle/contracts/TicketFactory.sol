pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./UserWalletFactory.sol";
import "./Administrable.sol";

contract TicketFactory is UserWalletFactory, Administrable {
    constructor() {}

    /// Properties
    struct Coordinate {
        int32 lat;
        int32 long;
    }

    struct Ticket {
        address owner;
        string name;
        Coordinate origin;
        Coordinate destination;
    }

    uint256 ticketPrice = 0.001 ether;

    /// Events
    event BoughtTicket(address indexed owner, string name);
    event TicketPriceChanged(uint256 newPrice);

    /// Functions
    function getPrice() external view returns(uint256) {
        return ticketPrice;
    }

    function setPrice(uint256 price) external mustBeAdmin {
        ticketPrice = price;
        emit TicketPriceChanged(ticketPrice);
    }

    // TODO: Send value if too much?
    function buyTicket(Coordinate calldata origin, Coordinate calldata destination) external payable {
        require(msg.value == ticketPrice);

        Ticket memory ticket = Ticket(msg.sender, "Bonjour", origin, destination);
        super._addTicket(msg.sender, ticket);

        emit BoughtTicket(ticket.owner, ticket.name);
    }
}
