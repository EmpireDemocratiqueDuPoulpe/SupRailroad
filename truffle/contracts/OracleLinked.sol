// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./Administrable.sol";

/// @title Handles a list of oracle that listens a contract.
/// @author Alexis L. <alexis.lecomte@supinfo.com>
contract OracleLinked is AccessControlEnumerable, Administrable {
    constructor() {}

    /// Properties
    /// @notice The "ORACLE" role used for access control.
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    /// @notice Used to generate a random key that never use the same values.
    uint256 private randNonce = 0;
    /// @notice Specifies the max value of the random key.
    uint256 private constant modulus = 1000;

    /// Mappings
    /// @notice Every pending request are stored in this mapping.
    mapping (uint256 => bool) private pendingRequests;

    /// Events
    /// @notice Triggerred when an Oracle is added.
    event AddedOracle(address addr);
    /// @notice Triggerred when an Oracle is removed.
    event RemovedOracle(address addr);

    /// Modifiers
    modifier validRequestId(uint256 _requestId) {
        require(pendingRequests[_requestId], "Invalid request ID!");
        _;
    }

    modifier mustBeOracle() {
        require(super.hasRole(ORACLE_ROLE, msg.sender), "This address is not a registered oracle!");
        _;
    }

    /// Functions
    // Functions - Oracle
    /// @notice Adds an oracle to the oracle group. You must be an administrator to perform this action.
    /// @param _oracle - The address of the new oracle.
    function addOracle(address _oracle) external mustBeAdmin {
        require(!super.hasRole(ORACLE_ROLE, _oracle), "This oracle is already registered!");

        super._grantRole(ORACLE_ROLE, _oracle);
        emit AddedOracle(_oracle);
    }

    /// @notice Removes an oracle from the oracle group. You must be an administrator to perform this action.
    /// @param _oracle - The address of the oracle.
    /// @param _forced - If true, the oracle will be removed without checking if it's the last connected. This parameter must only be used if the oracle encountered a fatal error.
    function removeOracle(address _oracle, bool _forced) external mustBeAdmin {
        require(super.hasRole(ORACLE_ROLE, _oracle), "This address is not a registered oracle!");
        if (!_forced) require(super.getRoleMemberCount(ORACLE_ROLE) > 1, "The last oracle cannot be removed!");

        super._revokeRole(ORACLE_ROLE, _oracle);
        emit RemovedOracle(_oracle);
    }

    // Functions - Requests
    /// @notice Adds a request to the request mapping.
    function _addRequest() internal returns(uint256) {
        uint256 requestId = _getNewId();
        pendingRequests[requestId] = true;

        return requestId;
    }

    /// @notice Removes a request from the request mapping.
    /// @param _requestId - The identifier of the request to remove.
    function _removeRequest(uint256 _requestId) internal {
        delete pendingRequests[_requestId];
    }

    /// @notice Returns a random identifier.
    /// @return A random identifier.
    function _getNewId() private returns(uint256) {
        ++randNonce;
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % modulus;
    }
}
