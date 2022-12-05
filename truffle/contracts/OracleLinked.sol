pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./Administrable.sol";

contract OracleLinked is AccessControlEnumerable, Administrable {
    constructor() {}

    /// Properties
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    uint256 private randNonce = 0;
    uint256 private constant modulus = 1000;

    /// Mappings
    mapping (uint256 => bool) private pendingRequests;

    /// Events
    event AddedOracle(address addr);
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
    function _addRequest() internal returns(uint256) {
        uint256 requestId = _getNewId();
        pendingRequests[requestId] = true;

        return requestId;
    }

    function _removeRequest(uint256 _requestId) internal {
        delete pendingRequests[_requestId];
    }

    function addOracle(address _oracle) external mustBeAdmin {
        require(!super.hasRole(ORACLE_ROLE, _oracle), "This oracle is already registered!");

        super._grantRole(ORACLE_ROLE, _oracle);
        emit AddedOracle(_oracle);
    }

    function removeOracle(address _oracle, bool _forced) external mustBeAdmin {
        require(super.hasRole(ORACLE_ROLE, _oracle), "This address is not a registered oracle!");
        if (!_forced) require(super.getRoleMemberCount(ORACLE_ROLE) > 1, "The last oracle cannot be removed!");

        super._revokeRole(ORACLE_ROLE, _oracle);
        emit RemovedOracle(_oracle);
    }

    function _getNewId() private returns(uint256) {
        ++randNonce;
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % modulus;
    }
}
