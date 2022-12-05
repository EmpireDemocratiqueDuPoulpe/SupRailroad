pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./TicketFactory.sol";
import "./CardFactory.sol";

abstract contract IUserWalletFactory {
    /// Properties
    struct UserWallet {
        TicketFactory.Ticket[] tickets;
        CardFactory.Card[] cards;
    }

    /// Mappings
    mapping (address => UserWallet) userToWallet;

    /// Functions
    function _getWalletOf(address _owner) internal view virtual returns(UserWallet memory);

    function getWallet() public view virtual returns(UserWallet memory);

    function _addTicket(address _to, TicketFactory.Ticket memory _ticket) internal virtual returns(uint256);

    function getTicket(address _owner, uint256 _id) public view virtual returns(TicketFactory.Ticket memory);

    function _addCard(address _to, CardFactory.Card memory _card) public virtual;

    function _getCard(uint256 cardId) public view virtual returns(CardFactory.Card memory);

    function _setCard(uint256 cardId, CardFactory.Card memory card) public virtual;
}
