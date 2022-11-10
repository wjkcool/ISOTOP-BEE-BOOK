// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

/**
 * @dev Interface of ISOTOP1014 跨链转移智能合约

主要功能：
*） 给NFT加持内容：setBaseURI
*） 铸造NFT：mint
*） 安全铸造NFT（检查是否可以被合约地址拥有）：safeMint
*） 租借：setUser
*） 检查租借用户，有效期： userOf
*） 销毁：burn
*） 可查询接口：tokenByIndex, tokenOfOwnerByIndex
*） 转移：transferFrom
*)  跨链转移：transferFrom

设计要点：
1） 跨链转移资产

 */

import "./IISOTOP1013.sol";

interface IISOTOP1014 is IISOTOP1013 {
    /// @dev 新增接口

    event transferTokenAcrossChain(
        address from,
        uint256 chainId,
        address to,
        uint256 tokenId,
        uint256 totalSupply,
        string baseURI
    );
    event tokenAcrossChainTransfered(
        uint256 chainFromId,
        address from,
        uint256 chainToId,
        address to,
        uint256 tokenId
    );

    function transferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 chainId
    ) external;

    function transferAcrossChain(
        uint256 chainId,
        address from,
        address to,
        uint256 tokenId,
        uint256 totalSupply
    ) external;
}
