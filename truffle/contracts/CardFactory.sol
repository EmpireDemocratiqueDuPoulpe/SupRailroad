pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./UserWalletFactory.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CardFactory is UserWalletFactory,ERC721,Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CardFactory", "CRD") {}

    /// Constants
    struct Card {
        uint uid;
        uint price;
        uint8 discountPercent;
        address owner;
        string name;
        string imagePath;
        string description;
    }

    struct UserCards {
        Card[] cards;
    }

    /// Mappings & Arrays
    mapping (address => UserCards) ownerToCard;
    mapping (uint => address) cardToOwner;
    mapping (uint => address) cardApprovals;
    mapping (address => uint) ownerCardCount;

    /// Events
    event BoughtCard(address owner, string name);

    /// Functions
    function createCard() public onlyOwner {
        uint256 cardId = safeMint(msg.sender);
        cardToOwner[msg.sender].push(Card(cardId, 10, 10, msg.sender, "TEST", "", "DESCRIPTION"));
    }

    function safeMint(address to) internal onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        return tokenId;
    }

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerCardCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return cardToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerCardCount[_to]++;
        ownerCardCount[_from]--;
        cardToOwner[_tokenId] = _to;
        Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public ownerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public ownerOf(_tokenId) {
        cardApprovals[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(cardApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}