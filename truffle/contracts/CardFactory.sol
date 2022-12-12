// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CardFactory {
    constructor() {}

    /// Properties
    struct Card {
        uint256 cardId; // token ID generated by Counter
        uint256 price;
        uint8 discountPercent;
        address owner;
        address approvedTo;
        string name;
        string imagePath;
        string description;
    }

    /// Mappings
    mapping (address => Card[]) private userToCards;

    /// Modifier
    modifier checkIndex(address _owner, uint256 _index) {
        require(_index < _getCardsOf(_owner).length, "Invalid card index!");
        _;
    }

    /// Functions
    // Functions - Create
    function _addCard(address _owner, Card memory _card) internal {
        userToCards[_owner].push(_card);
    }

    // Functions - Read
    function getCards() public view returns(Card[] memory) {
        return _getCardsOf(msg.sender);
    }

    function _getCardsOf(address _owner) internal view returns(Card[] memory) {
        return userToCards[_owner];
    }

    function _getCard(address _owner, uint256 _index) internal view checkIndex(_owner, _index) returns(Card memory) {
        return userToCards[_owner][_index];
    }

    function _findCardIndex(address _owner, uint256 _cardId) internal view returns(uint256) {
        Card[] memory cards = _getCardsOf(_owner);

        for (uint256 idx = 0; idx < cards.length; idx++) {
            if (cards[idx].cardId == _cardId) {
                return idx;
            }
        }

        revert("Invalid card id!");
    }

    function _getCardById(address _owner, uint256 _cardId) internal view returns(Card memory) {
        return _getCard(_owner, _findCardIndex(_owner, _cardId));
    }

    // Functions - Update
    function _setCard(address _owner, uint256 _index, Card memory _card) internal {
        userToCards[_owner][_index] = _card;
    }

    function _updateCardApproval(address _owner, address _target, uint256 _cardId) internal {
        uint256 index = _findCardIndex(_owner, _cardId);
        userToCards[_owner][index].approvedTo = _target;
    }

    // Functions - Delete
    function _removeCard(address _owner, uint256 _cardId) internal {
        // Delete the card
        Card[] storage cards = userToCards[_owner];
        uint256 idToRemove = _findCardIndex(_owner, _cardId);
        delete cards[idToRemove];

        // Sort the array and truncate it
        uint256 offset = 0;

        for (uint256 idx = 0; idx < cards.length; idx++) {
            if (offset > 0) {
                cards[idx - offset] = cards[idx];
            }

            if (cards[idx].discountPercent == 0) {
                offset++;
            }
        }

        for (uint256 i = 0; i < offset; i++) {
            cards.pop();
        }
    }
}
