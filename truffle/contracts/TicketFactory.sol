pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./UserWalletFactory.sol";
import "./Administrable.sol";
import "./OracleLinked.sol";
import "./BalanceManager.sol";

// ISSUE 01 :
// Storing an array of Coordinates in a Ticket is forbidden by the Solidity gods. But storing the same Ticket in an array
// of Ticket in another struct is allowed. I don't know why. I didn't found a fix.

contract TicketFactory is UserWalletFactory, Administrable, OracleLinked, BalanceManager {
    constructor() {}

    /// Properties
    struct PriceRequest {
        bool requested;
        // Coordinate[] points; // See ISSUE 01
        uint256 id;
        uint256 standardPrice;
        uint256 distance;
        uint256 price;
        string[] types;
    }

    struct Coordinate {
        int32 lat;
        int32 long;
    }

    struct Ticket {
        address owner;
        string name;
        string[] types;
        // Coordinate[] points; // See ISSUE 01
        uint256 distance;
    }

    uint256 ticketPrice = 0.00030 ether;

    /// Mappings
    mapping (address => PriceRequest) private callerToPriceRequest;

    /// Events
    event TicketPriceChanged(uint256 newPrice);
    event TicketPriceRequested(uint256 requestId, address indexed caller, string[] types, Coordinate[] points, int256 cardId);
    event TicketPriceCalculated(uint256 indexed requestId, address indexed caller, uint256 price);
    event BoughtTicket(uint256 indexed requestId, address indexed owner);

    /// Functions
    function getStandardPrice() public view returns(uint256) {
        return ticketPrice;
    }

    function getPrice(string[] calldata _types, Coordinate[] calldata _points, int256 _cardId) external {
        uint256 requestId = super._addRequest();
        emit TicketPriceRequested(requestId, msg.sender, _types, _points, _cardId);
    }

    function setCalculatedPrice(uint256 _requestId, address _caller, uint256 _standardPrice, uint256 _distance, uint256 _price, string[] calldata _types) public validRequestId(_requestId) mustBeOracle {
        super._removeRequest(_requestId);
        // callerToPriceRequest[_caller] = PriceRequest(true, _points, _standardPrice, _distance, _price); // See ISSUE 01
        callerToPriceRequest[_caller] = PriceRequest(true, _requestId, _standardPrice, _distance, _price, _types);

        emit TicketPriceCalculated(_requestId, _caller, _price);
    }

    function setPrice(uint256 price) external mustBeAdmin {
        ticketPrice = price;
        emit TicketPriceChanged(ticketPrice);
    }

    // TODO: Send value if too much?
    function buyTicket() external payable {
        require(callerToPriceRequest[msg.sender].requested == true, "You must request the price before buying a ticket!");
        PriceRequest memory request = callerToPriceRequest[msg.sender];

        require(request.standardPrice == getStandardPrice(), "The ticket price has changed: Please do another request.");
        // require(msg.value >= request.price, "Not enough ETH!"); // TODO: In some case, this line triggers a revert even if there's enough ETH is the message

        delete callerToPriceRequest[msg.sender];
        // Ticket storage ticket = _createTicket(msg.sender, "Bonjour", request.points, request.distance); // See ISSUE 01
        Ticket memory ticket = _createTicket(msg.sender, "Ticket", request.types, request.distance);

        emit BoughtTicket(request.id, ticket.owner);
    }

    function _createTicket(address _owner, string memory _name, string[] memory _types, uint256 _distance) private returns(Ticket memory) {
        // Ticket storage ticket = super._addTicket(_owner, Ticket(_owner, _name, new Coordinate[](_points.length), _distance)); // See ISSUE 01
        Ticket memory ticket = Ticket(_owner, _name, _types, _distance);
        super._addTicket(_owner, ticket);

        // for(uint i = 0; i < _points.length; i++) { // See ISSUE 01
        //     ticket.points.push(_points[i]);        // See ISSUE 01
        // }                                          // See ISSUE 01

        return ticket;
    }
}
