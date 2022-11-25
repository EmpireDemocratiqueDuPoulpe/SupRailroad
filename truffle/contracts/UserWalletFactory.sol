pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./TicketFactory.sol";

contract UserWalletFactory {
    constructor() {}

    /// Constants
    struct UserWallet {
        TicketFactory.Ticket[] tickets;
    }

    /// Events
    event NewWallet();

    /// Mappings
    mapping (address => UserWallet) userToWallet;

    /// Functions
    function getWallet() public view returns(UserWallet memory) {
        return userToWallet[msg.sender];
    }

    function _addTicket(address _to, TicketFactory.Ticket memory _ticket) internal {
        userToWallet[_to].tickets.push(_ticket);
    }
}
