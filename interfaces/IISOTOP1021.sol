// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

// import "../contracts/ERC3525/interfaces/IERC3525.sol";
// import "../contracts/ERC3525/interfaces/IERC3525Metadata.sol";
import "./IERC3525.sol";
import "./IERC3525Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

uint256 constant ADMIN_ID = type(uint256).max;

interface IISOTOP1021 is IERC3525, IERC3525Metadata, IERC721Enumerable {
    event baseURIChanged(string uri);
    event detailsURIChanged(string uri);
    event gasLoaded(address gasManager);

    function init(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        string memory base_,
        string memory details_,
        uint256 _totalPoints
    ) external;

    function setBaseURI(string memory base_) external;

    function setDetailsURI(string memory uri_) external;

    function transferOwnership(address newOwner) external;

    function mint(address _to, uint256 tokenId) external;

    function mint(
        address to_,
        uint256 tokenId_,
        uint256 value_
    ) external;

    function fill(uint256 tokenId, uint256 _value) external;

    function fill(
        address _to,
        uint256 _value,
        uint256 newId
    ) external;

    function consume(uint256 tokenId, uint256 _value) external;
}
