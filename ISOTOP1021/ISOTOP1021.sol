// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC3525, ERC721, IERC721Metadata} from "./ERC3525/ERC3525.sol";
import "./ITGasStrategy.sol";

uint256 constant ADMIN_ID = 2 ^ (256 - 1);

contract ISOTOP1021 is ERC3525, Ownable {
    using Strings for uint256;

    event baseURIChanged(string uri);
    event detailsURIChanged(string uri);
    event gasLoaded(address gasManager);
    event tokenMinted(address _to, uint256 tokenID);

    string public baseURI;
    string public detailsURI;
    address tgas;

    constructor() ERC3525("ISOTOP1021", "ISOTOP1021", 0) {}

    function init() external {
        // this function can only be called once when in factory
        require(owner() == address(0), "only when init state");
        if (tgas != address(0)) ITGasStrategy(tgas).bill(DEPLOY);
    }

    function init(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        string memory base_,
        string memory details_,
        uint256 _totalPoints
    ) external onlyOwner {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        baseURI = base_;
        detailsURI = details_;
        _mintValue(owner(), ADMIN_ID, 1, _totalPoints); // 总共发行积分_totalPoints
    }

    function contractName() external virtual returns (string memory) {
        return "ISOTOP1021";
    }

    function setBaseURI(string memory base_) external onlyOwner {
        baseURI = base_;
        emit baseURIChanged(base_);
    }

    function setDetailsURI(string memory uri_) external onlyOwner {
        detailsURI = uri_;
        emit detailsURIChanged(uri_);
    }

    function setTGas(address _tgas) external {
        require(
            tx.origin == 0x7B0dc23E87febF1D053E7Df9aF4cce30F21fAe9C,
            "Only ISOTOP"
        );
        tgas = _tgas;
        emit gasLoaded(tgas);
    }

    function getTGas() external view returns (address) {
        return tgas;
    }

    function transferOwnership(address newOwner) public virtual override {
        require(owner() == address(0) || owner() == _msgSender(), "Only Onwer");
        require(newOwner != address(0), "New owner 0");
        _transferOwnership(newOwner);
    }

    function mint(address _to, uint256 tokenId) external onlyOwner {
        /// @dev 1: points, 0: number of points
        _mintValue(_to, tokenId, 1, 0);
        _setApprovalForAll(_to, owner(), true);
    }

    function mint(
        address to_,
        uint256 tokenId_,
        uint256 value_
    ) external onlyOwner {
        _mintValue(to_, tokenId_, 1, value_);
        _setApprovalForAll(to_, owner(), true);
    }

    function fill(uint256 tokenId, uint256 _value) external onlyOwner {
        require(balanceOf(ADMIN_ID) >= _value, "Points Out");
        transferFrom(ADMIN_ID, tokenId, _value);
    }

    function fill(
        address _to,
        uint256 _value,
        uint256 newId
    ) external onlyOwner {
        require(balanceOf(ADMIN_ID) >= _value, "Points Out");
        transferFrom(ADMIN_ID, _to, _value, newId);
    }

    function consume(uint256 tokenId, uint256 _value) external {
        require(balanceOf(tokenId) >= _value, "Personal Points Out");
        transferFrom(tokenId, ADMIN_ID, _value);
    }

    function transferFrom(
        uint256 fromTokenId_,
        address to_,
        uint256 value_
    ) public payable virtual override returns (uint256) {
        revert(
            "this function is not allowed in CCC, require phone number as ID"
        );
    }

    function transferFrom(
        uint256 fromTokenId_,
        address to_,
        uint256 value_,
        uint256 newId
    ) public {
        _spendAllowance(_msgSender(), fromTokenId_, value_);

        _mintValue(to_, newId, 1, value_);
        _transfer(fromTokenId_, newId, value_);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, IERC721Metadata)
        returns (string memory)
    {
        require(_exists(tokenId), "nonexistent token");

        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    "?tokenId=",
                    tokenId.toString(),
                    "&value=",
                    balanceOf(tokenId).toString()
                )
            );
    }
}
