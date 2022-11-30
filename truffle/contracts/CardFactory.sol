pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

import "./IUserWalletFactory.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Administrable.sol";

contract CardFactory is ERC721URIStorage, Administrable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor(address walletAddr) ERC721("CardFactory", "CRD") {
        walletContract = IUserWalletFactory(walletAddr);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControlEnumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// Constants
    struct Card {
        uint256 tokenId;
        uint256 price;
        uint8 discountPercent;
        address owner;
        string name;
        string imagePath;
        string description;
    }

    IUserWalletFactory walletContract;

    /// Mappings
    mapping (uint => address) private cardApprovals;

    /// Events
    event BoughtCard(address owner, uint256 cardId);

    /// Functions
    //function createCard() public mustBeAdmin {
        //uint256 cardId = safeMint(msg.sender);
        //walletContract._addCard(msg.sender, Card(cardId, 10, 10, msg.sender, "TEST", "", "DESCRIPTION"));
    //}

    function createCard(string memory tokenURI)
    external mustBeAdmin
    returns (uint256)
    {
        uint256 newCardId = _tokenIdCounter.current();
        super._mint(msg.sender, newCardId);
        super._setTokenURI(newCardId, tokenURI);

        _tokenIdCounter.increment();
        return newCardId;
    }

    function buyCard(uint256 price, uint256 cardId) external payable {
        require(msg.value == price);
        super.safeTransferFrom(ownerOf(cardId), msg.sender, cardId);
        emit BoughtCard(msg.sender, cardId);
    }

}
