pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

contract Administrable {
    constructor() {}

    /// Properties
    address public constant ADMIN = 0xf02Aea86D06DE1831258AC831b5eeAc14C4DB6BD;

    /// Modifiers
    modifier mustBeAdmin() {
        require(isAdmin(), "You must be the administrator to perform this action!");
        _;
    }

    /// Functions
    function isAdmin() public view returns(bool) {
        return msg.sender == ADMIN;
    }
}
