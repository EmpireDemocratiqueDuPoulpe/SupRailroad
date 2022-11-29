pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Administrable is AccessControlEnumerable {
    constructor() {
        super._grantRole(ADMIN_ROLE, ADMIN);
        super._grantRole(ADMIN_ROLE, ADMIN2);
    }

    /// Properties
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address private constant ADMIN = 0x9cF106fea3E1d92Cc04b3F9C34DAb57a21F3828D;
    address private constant ADMIN2 = 0x5fA3fe5ECBF931dfeF04147BDDd590D8dE30313E;

    /// Modifiers
    modifier mustBeAdmin() {
        require(isAdmin(), "You must be the administrator to perform this action!");
        _;
    }

    /// Functions
    function isAdmin() public view returns(bool) {
        return super.hasRole(ADMIN_ROLE, msg.sender);
    }
}
