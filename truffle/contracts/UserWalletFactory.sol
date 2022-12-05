pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./TicketFactory.sol";
import "./CardFactory.sol";

contract UserWalletFactory {
    constructor() {}

    /// Properties
    struct UserWallet {
        TicketFactory.Ticket[] tickets;
        CardFactory.Card[] cards;
    }

    /// Mappings
    mapping (address => UserWallet) userToWallet;

    /// Functions
    function getWallet() public view returns(UserWallet memory) {
        return userToWallet[msg.sender];
    }

    function _addTicket(address _to, TicketFactory.Ticket memory _ticket) internal {
        userToWallet[_to].tickets.push(_ticket);
    }

    function _addCard(address _to, CardFactory.Card memory _card) internal {
        userToWallet[_to].cards.push(_card);
    }

    function _getCard(uint256 cardId) public view returns(CardFactory.Card memory) {
        return userToWallet[msg.sender].cards[cardId];
    }

    function _setCard(uint256 cardId, CardFactory.Card memory card) public {
        userToWallet[msg.sender].cards[cardId] = card;
    }
}
