pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./TicketFactory.sol";
import "./Administrable.sol";
import "./OracleLinked.sol";
import "./BalanceManager.sol";

contract TicketMarket is TicketFactory, Administrable, OracleLinked, BalanceManager {
    constructor() {}

    /// Properties
    struct PriceRequest {
        bool requested;
        uint256 id;
        uint256 standardPrice;
        uint256 distance;
        uint256 price;
        // Coordinate[] points; // See ISSUE 01
        string[] types;
    }

    uint256 ticketPrice = 0.00030 ether;

    /// Mappings
    mapping (address => PriceRequest) private callerToPriceRequest;

    /// Events
    event TicketPriceChanged(uint256 newPrice);
    event TicketPriceRequested(uint256 indexed requestId, address indexed caller, string[] types, Coordinate[] points, int256 cardId);
    event TicketPriceCalculated(uint256 indexed requestId, address indexed caller, uint256 price);
    event BoughtTicket(uint256 indexed requestId, address indexed owner);

    /// Functions
    // Functions - Getters
    function getStandardPrice() public view returns(uint256) {
        return ticketPrice;
    }

    function getPrice(string[] calldata _types, TicketFactory.Coordinate[] calldata _points, int256 _cardId) external {
        uint256 requestId = super._addRequest();
        emit TicketPriceRequested(requestId, msg.sender, _types, _points, _cardId);
    }

    // Functions - Setters
    function setPrice(uint256 _price) external mustBeAdmin {
        ticketPrice = _price;
        emit TicketPriceChanged(_price);
    }

    function setCalculatedPrice(uint256 _requestId, address _caller, uint256 _standardPrice, uint256 _distance, uint256 _price, string[] calldata _types) public validRequestId(_requestId) mustBeOracle {
        super._removeRequest(_requestId);
        // callerToPriceRequest[_caller] = PriceRequest(true, _requestId, _standardPrice, _distance, _price, _types, _points); // See ISSUE 01
        callerToPriceRequest[_caller] = PriceRequest(true, _requestId, _standardPrice, _distance, _price, _types);

        emit TicketPriceCalculated(_requestId, _caller, _price);
    }

    // Functions - Market
    // TODO: Send value if too much?
    function buyTicket() external payable {
        require(callerToPriceRequest[msg.sender].requested == true, "You must request the price before buying a ticket!");
        PriceRequest memory request = callerToPriceRequest[msg.sender];

        require(request.standardPrice == getStandardPrice(), "The ticket price has changed: Please do another request.");
        // require(msg.value >= request.price, "Not enough ETH!"); // TODO: In some case, this line triggers a revert even if there's enough ETH is the message

        delete callerToPriceRequest[msg.sender];
        // Ticket storage ticket = _createTicket(msg.sender, "Ticket", request.types, request.points, request.distance); // See ISSUE 01
        Ticket memory ticket = super._createTicket(msg.sender, "Ticket", request.types, request.distance);

        emit BoughtTicket(request.id, ticket.owner);
    }
}
