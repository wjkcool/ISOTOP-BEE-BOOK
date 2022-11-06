// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

address constant BEE_SOUL_ADDRESS = 0x5fd87014cf33F4c65956d0EA3835aF3d98C90BEE;

interface Soul {
    function mint(uint256 tokenId) external;

    function validateAddress(uint256 tokenId, address _from)
        external
        view
        returns (bool);

    function addToken(
        uint256 tokenId,
        address _token,
        bytes memory _data
    ) external;

    function removeAccount(uint256 tokenId, address _account) external;

    function getAccounts(uint256 tokenId)
        external
        view
        returns (address[] memory);

    function getKey(uint256 tokenId, address _account)
        external
        view
        returns (bytes memory);

    function key(bytes memory _public) external pure returns (address);
}
