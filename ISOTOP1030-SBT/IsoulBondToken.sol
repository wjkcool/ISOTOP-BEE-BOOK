// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

address constant BEE_SBT_ADDRESS = 0xC9E7da9DA7c92b63453b9d6d4D7101A31dF14bEe;

interface IsoulBondToken {
    struct tokenStructure {
        string issuer;
        string certification;
        uint256 date;
    }

    function issue(
        string calldata _issuer,
        string calldata _certification,
        address[] memory _allows
    ) external;

    function claim(
        uint256 _soulId,
        string calldata _issuer,
        string calldata _certification
    ) external;

    function getTokenIds(uint256 soulId)
        external
        view
        returns (uint256[] memory);

    function getToken(uint256 tokenId)
        external
        view
        returns (tokenStructure memory);
}
