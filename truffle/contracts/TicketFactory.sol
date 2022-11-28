pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./UserWalletFactory.sol";
import "./Administrable.sol";
import "./OracleLinked.sol";

contract TicketFactory is UserWalletFactory, Administrable, OracleLinked {
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

    uint256 ticketPrice = 0.00015 ether;

    /// Mappings
    mapping (address => uint256) private callerToPrice;

    /// Events
    event TicketPriceChanged(uint256 newPrice);
    event TicketPriceRequested(address caller, uint256 requestId, Coordinate origin, Coordinate destination);
    event TicketPriceCalculated(address caller, uint256 requestId, uint256 price);
    event BoughtTicket(address indexed owner, string name);

    /// Functions
    function getStandardPrice() external view returns(uint256) {
        return ticketPrice;
    }

    function getPrice(Coordinate calldata _origin, Coordinate calldata _destination) external returns(uint256) {
        uint256 requestId = super._getNewId();

        pendingRequests[requestId] = true;
        emit TicketPriceRequested(msg.sender, requestId, _origin, _destination);

        return requestId;
    }

    function sendCalculatedPrice(address _caller, uint256 _requestId, uint256 _price) public validRequestId(_requestId) mustBeOracle {
        delete pendingRequests[_requestId];
        emit TicketPriceCalculated(_caller, _requestId, _price);
    }

    function setPrice(uint256 price) external mustBeAdmin {
        ticketPrice = price;
        emit TicketPriceChanged(ticketPrice);
    }

    // TODO: Send value if too much?
    function buyTicket(Coordinate calldata _origin, Coordinate calldata _destination) external payable {
        require(msg.value == ticketPrice);

        Ticket memory ticket = Ticket(msg.sender, "Bonjour", _origin, _destination);
        super._addTicket(msg.sender, ticket);

        emit BoughtTicket(ticket.owner, ticket.name);
    }
}
