pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./Administrable.sol";

contract BalanceManager is Administrable {
    constructor() {}

    /// Functions
    function getBalance() public view mustBeAdmin returns(uint256) {
        return address(this).balance;
    }

    function transfer(address payable _to) external mustBeAdmin {
        require(super.hasRole(ADMIN_ROLE, _to), "The provided address is not a registered address!");

        uint256 balance = getBalance();
        require(balance > 0, "The balance of this contract is empty!");
        _to.transfer(balance);
    }
}
