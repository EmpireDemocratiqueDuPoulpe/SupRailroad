pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Administrable.sol";

contract CardFactory is ERC721, Administrable {
    using Counters for Counters.Counter;
    Counters.Counter private _cardIdCounter;

    constructor() ERC721("CardFactory", "CRD") {}

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControlEnumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// Constants
    struct Card {
        uint256 cardId; // token ID generated by Counter
        uint256 price;
        uint8 discountPercent;
        address owner;
        address approvedTo;
        string name;
        string imagePath;
        string description;
        bool forSale;
    }

    /// Mappings
    mapping (address => uint256[]) private userApprovals;
    mapping (address => Card[]) private userToCards;

    /// Events
    event BoughtCard(address owner, uint256 cardId);

    /// Modifiers
    modifier isOwnerOf(uint256 cardId) {
        require(super.ownerOf(cardId) == msg.sender);
        _;
    }

    /// Functions

    function createCard(uint256 price, uint8 discountPercent, string calldata name, string calldata imagePath, string calldata description)
    external mustBeAdmin
    returns (uint256)
    {
        uint256 newCardId = _cardIdCounter.current();
        super._mint(msg.sender, newCardId);
        _addCard(msg.sender, Card(newCardId, price, discountPercent, msg.sender, address(0), name, imagePath, description, true));

        _cardIdCounter.increment();
        return newCardId;
    }

    function setApproval(address to, uint256 cardId) public {
        super.approve(to, cardId);
        userApprovals[to].push(cardId);
        userToCards[msg.sender][cardId].approvedTo = to;
    }

    function buyCard(address from, address to, uint256 cardId, uint256 price) public payable {
        require(msg.value == price);
        super.safeTransferFrom(from, to, cardId);
        emit BoughtCard(msg.sender, cardId);
    }

    function transferCard(address from, address to, uint256 cardId) public {
        super.safeTransferFrom(from, to, cardId);

        Card memory card = userToCards[from][cardId];
        Card memory newCard = Card(card.cardId, card.price, card.discountPercent, to, address(0), card.name, card.imagePath, card.description, false);
        userToCards[to][cardId].push(newCard);
        delete userToCards[from][cardId]; // Delete the card from the old owner

        uint256[] memory newApprovals;
        for (uint i = 0; j < userApprovals[to].length; i++) {
            if (ownerCards[j].cardId != id) {
                newApprovals.push(cardId);
            }
        }
        userApprovals[to] = newApprovals;

        emit TransferCard(msg.sender, cardId);
    }

    function safeTransferFrom(address, address, uint256) override public pure {
        revert("You must use buyCard.");
    }

    function transferFrom(address, address, uint256) override public pure {
        revert("You must use buyCard.");
    }

    function changeSaleStatus(uint256 cardId, bool saleStatus) external isOwnerOf(cardId) {
        Card memory card = _getCard(cardId);
        card.forSale = saleStatus;
        _setCard(cardId, card);
    }

    function _addCard(address _to, CardFactory.Card memory _card) private {
        userToCards[_to].push(_card);
    }

    function _getCard(uint256 cardId) private view returns(CardFactory.Card memory) {
        return userToCards[msg.sender][cardId];
    }

    function _setCard(uint256 cardId, CardFactory.Card memory card) private {
        userToCards[msg.sender][cardId] = card;
    }

    function getCards() public view returns (Card[] memory){
        return userToCards[msg.sender];
    }

    function getUserApprovals() public view returns (Card[] memory) {
        uint256[] memory cardsIDs = userApprovals[msg.sender];
        Card[] memory approvedCards = new Card[](cardsIDs.length);

        for (uint i = 0; i < cardsIDs.length; i++) {
            uint256 id = cardsIDs[i];
            address cardsOwner = super.ownerOf(id);
            Card[] memory ownerCards = userToCards[cardsOwner];

            for (uint j = 0; j < ownerCards.length; j++) {
                if (ownerCards[j].cardId == id) {
                    approvedCards[i] = ownerCards[j];
                    break;
                }
            }
        }

        return approvedCards;
    }
}
