pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Administrable.sol";
import "./CardFactory.sol";

contract CardMarket is ERC721, Administrable, CardFactory {
    /// Libs
    using Counters for Counters.Counter;

    constructor() ERC721("CardFactory", "CRD") {}

    /// Properties
    Counters.Counter private cardCounter;

    /// Mappings
    mapping (address => uint256[]) private userApprovals;
    uint256[] private onSaleCards;

    /// Events
    event BoughtCard(address indexed owner, uint256 indexed cardId);
    event TransferredCard(address indexed owner, uint256 indexed cardId);

    /// Modifiers
    modifier isOwnerOf(uint256 cardId) {
        require(super.ownerOf(cardId) == msg.sender);
        _;
    }

    /// Functions
    // Functions - Cards creation and updates
    function createCard(uint256 price, uint8 discountPercent, string calldata name, string calldata imagePath, string calldata description) external mustBeAdmin returns (uint256) {
        // Create the card
        uint256 newCardId = cardCounter.current();
        super._mint(msg.sender, newCardId);
        super._addCard(
            msg.sender,
            Card(newCardId, price, discountPercent, msg.sender, address(0), name, imagePath, description, true)
        );

        // Return its id
        cardCounter.increment();
        onSaleCards.push(newCardId);
        return newCardId;
    }

    function changeSaleStatus(uint256 _cardId, bool _status) external isOwnerOf(_cardId) {
        super._updateSaleStatus(msg.sender, _cardId, _status);
    }

    // Functions - Cards market
    function buyCard(address _owner, address _target, uint256 _cardId, uint256 _price) public payable {
        require(msg.value == _price);
        super.safeTransferFrom(_owner, _target, _cardId);
        emit BoughtCard(_target, _cardId);
    }

    // Functions - Cards transfer
    function setApproval(address _target, uint256 _cardId) public {
        super.approve(_target, _cardId);
        userApprovals[_target].push(_cardId);
        super._updateCardApproval(msg.sender, _target, _cardId);
    }

    function getApprovals() public view returns (CardFactory.Card[] memory) {
        uint256[] memory cardsIDs = userApprovals[msg.sender];
        CardFactory.Card[] memory approvedCards = new CardFactory.Card[](cardsIDs.length);

        for (uint i = 0; i < cardsIDs.length; i++) {
            uint256 currentId = cardsIDs[i];
            address cardOwner = super.ownerOf(currentId);
            Card[] memory ownerCards = super._getCardsOf(cardOwner);

            for (uint j = 0; j < ownerCards.length; j++) {
                if (ownerCards[j].cardId == currentId) {
                    approvedCards[i] = ownerCards[j];
                    break;
                }
            }
        }

        return approvedCards;
    }

    function transferCard(address _owner, address _target, uint256 _cardId) public {
        super.safeTransferFrom(_owner, _target, _cardId);

        // Duplicate the transferred card
        Card memory card = super._getCardById(_owner, _cardId);
        Card memory newCard = Card(card.cardId, card.price, card.discountPercent, _target, address(0), card.name, card.imagePath, card.description, false);

        // Delete the card from the owner inventory and add it to the new owner inventory
        super._removeCard(_owner, _cardId);
        super._addCard(_target, newCard);

        // Updates the approvals array of the target
        uint256[] memory newApprovals = new uint256[](userApprovals[_target].length - 1);

        for (uint256 i = 0; i < userApprovals[_target].length; i++) {
            if (userApprovals[_target][i] != _cardId) {
                newApprovals[newApprovals.length - 1] = _cardId;
            }
        }

        userApprovals[_target] = newApprovals;

        emit TransferredCard(_target, _cardId);
    }

    function getAllOnSale() public view returns (CardFactory.Card[] memory) {
        Card[] memory saleCards = new Card[](onSaleCards.length);

        for (uint256 i = 0; i < onSaleCards.length; i++) {
            address cardOwner = super.ownerOf(onSaleCards[i]);
            Card memory card = super._getCardById(cardOwner, onSaleCards[i]);

            saleCards[i] = card;
        }

        return saleCards;
    }

    // Functions - Overrides
    // Required to resolve a conflict (ERC721 / AccessControlEnumerable)
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControlEnumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Overridden for security issue. Our function is public while is hidden from the outside.
    function safeTransferFrom(address, address, uint256) override public pure {
        revert("You must use the `transferCard()` function!.");
    }

    // Overridden for security issue. Our function is public while is hidden from the outside.
    function transferFrom(address, address, uint256) override public pure {
        revert("You must use the `transferCard()` function!.");
    }
}
