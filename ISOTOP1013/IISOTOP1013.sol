// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

/**
 * @dev Interface of ISOTOP1013. 可租用，可销毁功能

主要功能：
*） 给NFT加持内容：setBaseURI
*） 铸造NFT：mint
*） 安全铸造NFT（检查是否可以被合约地址拥有）：safeMint
*） 租借：setUser
*） 检查租借用户，有效期： userOf
*） 销毁：burn
*） 可查询接口：tokenByIndex, tokenOfOwnerByIndex
*） 转移：transferFrom

设计要点：
1） 增加可租用，可销毁功能
2)  其它功能完全兼容ISOTOP1010, ISOTOP1011, ISOTOP1012
3） 兼容ERC721， ERC4907

 */

import "./IISOTOP1011.sol";
import "./IISOTOP1012.sol";

interface IISOTOP1013 is IISOTOP1011, IISOTOP1012 {}
