pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./TicketFactory.sol";
import "./CardFactory.sol";

contract UserWalletFactory {
    constructor() {}

    /// Properties
    struct UserWallet {
        TicketFactory.Ticket[] tickets;
        uint256[] cards;
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

    function _addCard(address _to, uint256 _cardId) internal {
        userToWallet[_to].cards.push(_cardId);
    }
}
