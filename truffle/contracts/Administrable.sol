// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

/// @title Handles the access control for admin-only functions.
/// @author Alexis L. <alexis.lecomte@supinfo.com>
/// @notice Can be used in every contracts that need to check if an address is a registered administrator.
contract Administrable is AccessControlEnumerable {
    constructor() {
        super._grantRole(ADMIN_ROLE, ADMIN1);
        super._grantRole(ADMIN_ROLE, ADMIN2);
        super._grantRole(ADMIN_ROLE, ADMIN3);
        super._grantRole(ADMIN_ROLE, ADMIN4);
    }

    /// Properties
    /// @notice The administrator groups. The following "ADMINX" constants are registered administrators.
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address private constant ADMIN1 = 0x9cF106fea3E1d92Cc04b3F9C34DAb57a21F3828D; // A.L. : PC-1
    address private constant ADMIN2 = 0xAa9AC3bBb0ef74bCF1f4B89Cf263d15dE7C15512; // M.P. : PC-1
    address private constant ADMIN3 = 0x663e106f3eaB2608d48D5eC7937798Cb9336b113; // M.P. : PC-hyd-ROG-lisseur
    address private constant ADMIN4 = 0x889b2fd9a32Af9FC8fD9A066f77a1Cea7257164d; // A.L. : PC-KingdomKhum

    /// Modifiers
    modifier mustBeAdmin() {
        require(isAdmin(), "You must be the administrator to perform this action!");
        _;
    }

    /// Functions
    // Functions - Getters
    /// @notice Checks if the message sender is a registered administrator.
    /// @return True if the address is an administrator, false otherwise.
    function isAdmin() public view returns(bool) {
        return super.hasRole(ADMIN_ROLE, msg.sender);
    }
}
