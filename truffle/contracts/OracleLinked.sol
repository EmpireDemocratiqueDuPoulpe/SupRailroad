pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

contract OracleLinked {
    constructor() {}

    /// Properties
    uint256 private randNonce = 0;
    uint256 private constant modulus = 1000;

    /// Mappings
    mapping (uint256 => bool) pendingRequests;

    /// Modifiers
    modifier validRequestId(uint256 _requestId) {
        require(pendingRequests[_requestId], "Invalid request ID!");
        _;
    }

    /// Functions
    function _getNewId() internal returns(uint256) {
        ++randNonce;
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % modulus;
    }
}
