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
    Card[] private onSaleCards;

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
    function createCard(uint256 price, uint8 discountPercent, string calldata name, string calldata imagePath, string calldata description, uint8 cardsNumber) external mustBeAdmin {
        require(cardsNumber >= 1, "Not enough cards to create !");
        require(discountPercent >= 1, "Discount cant be below 1% !");

        // Create the cards
        for (uint8 i = 1; i <= cardsNumber; i++) {
            uint256 newCardId = cardCounter.current();
            onSaleCards.push(Card(newCardId, price, discountPercent, msg.sender, address(0), name, imagePath, description));

            cardCounter.increment();
        }
    }

    // Functions - Cards market
    function getSaleableCards() public view returns(CardFactory.Card[] memory) {
        return onSaleCards;
    }

    function buyCard(uint256 cardId) public payable {
        // Get the card for the sale array
        Card memory card;
        uint256 onSaleCardIndex;
        for (uint i = 0; i < onSaleCards.length; i++) {
            if (onSaleCards[i].cardId == cardId) {
                card = onSaleCards[i];
                onSaleCardIndex = i;
                break;
            }
        }

        // Add the card to the user inventory
        require(msg.value >= card.price, "Not enough ETH!");
        Card memory newCard = Card(card.cardId, card.price, card.discountPercent, msg.sender, address(0), card.name, card.imagePath, card.description);
        super._mint(msg.sender, newCard.cardId);
        super._addCard(msg.sender, newCard);

        // Remove the card from the sale array
        _removeOnSaleCard(onSaleCardIndex);

        emit BoughtCard(msg.sender, newCard.cardId);
    }

    function _removeOnSaleCard(uint256 idToRemove) internal {
        delete onSaleCards[idToRemove];

        // Sort the array and truncate it
        uint256 offset = 0;

        for (uint256 idx = 0; idx < onSaleCards.length; idx++) {
            if (offset > 0) {
                onSaleCards[idx - offset] = onSaleCards[idx];
            }

            if (onSaleCards[idx].discountPercent == 0) {
                offset++;
            }
        }

        for (uint256 i = 0; i < offset; i++) {
            onSaleCards.pop();
        }
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
        Card memory newCard = Card(card.cardId, card.price, card.discountPercent, _target, address(0), card.name, card.imagePath, card.description);

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