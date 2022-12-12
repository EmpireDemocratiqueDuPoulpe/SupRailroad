// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Administrable.sol";

/// @title Exposes functions to transfer ETH between an address and the contract inheriting this one.
/// @author Alexis L. <alexis.lecomte@supinfo.com>
/// @notice Can be used in every contracts that need to transfer their balances.
contract BalanceManager is Administrable {
    constructor() {}

    /// Events
    /// @notice Triggerred when the contract balance is transferred.
    event BalanceTransferred(address indexed to);

    /// Functions
    // Functions - Getters
    /// @notice Get the balance of this contract.
    /// @return The balance of this contract.
    function getBalance() public view mustBeAdmin returns(uint256) {
        return address(this).balance;
    }

    /// @notice Transfert the balance of this contract to the specified address. You must be an administrator to perform this action.
    /// @param _to - The address that will receive the contract balance.
    function transfer(address payable _to) external mustBeAdmin {
        require(super.hasRole(ADMIN_ROLE, _to), "The provided address is not a registered address!");

        uint256 balance = getBalance();
        require(balance > 0, "The balance of this contract is empty!");
        _to.transfer(balance);

        emit BalanceTransferred(_to);
    }
}
