// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TicketFactory.sol";
import "./Administrable.sol";
import "./OracleLinked.sol";
import "./BalanceManager.sol";

/// @title Makes tickets tradeable.
/// @author Alexis L. <alexis.lecomte@supinfo.com>
contract TicketMarket is TicketFactory, Administrable, OracleLinked, BalanceManager {
    constructor() {}

    /// Properties
    /// @notice A price request structure.
    /// @param requested - Is this requested? Used to check if this struct exist.
    /// @param id - The request identifier.
    /// @param standardPrice - The standard price at the time of the request.
    /// @param distance - The calculated distance in kilometer.
    /// @param price - The ticket price.
    /// @param types - A list of transport types (bus, train, subway).
    struct PriceRequest {
        bool requested;
        uint256 id;
        uint256 standardPrice;
        uint256 distance;
        uint256 price;
        // Coordinate[] points; // See ISSUE 01
        string[] types;
    }

    /// @notice The base price of a ticket.
    uint256 ticketPrice = 0.00030 ether;

    /// Mappings
    mapping (address => PriceRequest) private callerToPriceRequest;

    /// Events
    /// @notice Triggerred when the base price of the ticket is changed.
    event TicketPriceChanged(uint256 newPrice);
    /// @notice Triggerred when a price calculation is requested.
    event TicketPriceRequested(uint256 indexed requestId, address indexed caller, string[] types, Coordinate[] points, int256 cardId);
    /// @notice Triggerred when a price has been calculated.
    event TicketPriceCalculated(uint256 indexed requestId, address indexed caller, uint256 price);
    /// @notice Triggerred when a ticket is bought.
    event BoughtTicket(uint256 indexed requestId, address indexed owner);

    /// Functions
    // Functions - Getters
    /// @notice Returns the standard price of a ticket.
    /// @return The standard ticket price.
    function getStandardPrice() public view returns(uint256) {
        return ticketPrice;
    }

    /// @notice Requests a price calculation.
    /// @param _types - A list of transport types (bus, train, subway).
    /// @param _points - A list of Coordinates used to calculate the total distance.
    /// @param _cardId - The identifier of the discount card that is used for this transaction.
    function getPrice(string[] calldata _types, TicketFactory.Coordinate[] calldata _points, int256 _cardId) external {
        uint256 requestId = super._addRequest();
        emit TicketPriceRequested(requestId, msg.sender, _types, _points, _cardId);
    }

    // Functions - Setters
    /// @notice Changes the standard price of a ticket. You must be an administrator to perform this action.
    /// @param _price - The new standard price (in Wei).
    function setPrice(uint256 _price) external mustBeAdmin {
        ticketPrice = _price;
        emit TicketPriceChanged(_price);
    }

    /// @notice Sends the response to a price request.
    /// @param _requestId - The request identifier.
    /// @param _caller - The address who requested the price calculation.
    /// @param _standardPrice - The standard price at the time of the request calculation.
    /// @param _distance - The distance in kilometer.
    /// @param _price - The calculated ticket price.
    /// @param _types - A list of transport types (bus, train, subway).
    function setCalculatedPrice(uint256 _requestId, address _caller, uint256 _standardPrice, uint256 _distance, uint256 _price, string[] calldata _types) public validRequestId(_requestId) mustBeOracle {
        super._removeRequest(_requestId);
        // callerToPriceRequest[_caller] = PriceRequest(true, _requestId, _standardPrice, _distance, _price, _types, _points); // See ISSUE 01
        callerToPriceRequest[_caller] = PriceRequest(true, _requestId, _standardPrice, _distance, _price, _types);

        emit TicketPriceCalculated(_requestId, _caller, _price);
    }

    // Functions - CardsMarket
    // TODO: Send value if too much?
    /// @notice Buys a ticket.
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
