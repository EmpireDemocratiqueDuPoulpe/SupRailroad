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

    /// Functions
    function getWallet() public view virtual returns(UserWallet memory);

    function _addTicket(address _to, TicketFactory.Ticket memory _ticket) internal virtual;

    //function _addCard(address _to, CardFactory.Card memory _card) internal virtual;
    function _addCard(address _to, CardFactory.Card memory _card) public virtual;
}
