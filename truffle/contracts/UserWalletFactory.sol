pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./TicketFactory.sol";

contract UserWalletFactory {
    constructor() {}

    /// Constants
    struct UserWallet {
        bool exist;  // False by default, true when the wallet is initialized.
        TicketFactory.Ticket[] tickets;
    }

    /// Events
    event NewWallet();

    /// Mappings
    mapping (address => UserWallet) userToWallet;

    /// Modifiers
    modifier walletMustExist(address owner) {
        require(userToWallet[owner].exist == true);
        _;
    }

    modifier walletMustNotExist(address owner) {
        require(userToWallet[owner].exist == false);
        _;
    }

    /// Functions
    function _createWallet() internal walletMustNotExist(msg.sender) {
        userToWallet[msg.sender].exist = true;
        emit NewWallet();
    }

    function getWallet() public view walletMustExist(msg.sender) returns(UserWallet memory) {
        return userToWallet[msg.sender];
    }

    function _addTicket(address _to, TicketFactory.Ticket memory _ticket) internal walletMustExist(_to) {
        userToWallet[_to].tickets.push(_ticket);
    }
}
