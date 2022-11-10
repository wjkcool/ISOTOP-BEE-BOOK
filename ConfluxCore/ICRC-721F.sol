// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

/**
 * @dev Interface of ISOTOP1015： ERC721低GAS的兼容版，单一徽章

主要功能：
*） 给NFT加持内容：setBaseURI
*） 铸造NFT：mint
*） 安全铸造NFT（检查是否可以被合约地址拥有）：safeMint
*） 可查询接口：tokenByIndex, tokenOfOwnerByIndex
*） 转移：transferFrom

设计要点：
1） 完全兼容ISOTOP1010
2） tokenURI 返回固定的链接，所有token内容相同
 */

import "./ICRC-721E.sol";

interface ICRC721F is ICRC721E {}
