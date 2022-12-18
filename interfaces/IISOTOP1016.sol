// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

/**
 * @dev Interface of ISOTOP1016： 动态NFT

主要功能：
*） 给NFT加持内容：调用dds.get 存入SVG文件内容，并且设定[TOKEN ID]为可变量
*） 如果baseURI不为空，则按照baseURI/tokenId.json返回内容
*） dds.get(NAME, 'IMAGE', svg_file_contnet) 存储默认的nft图片内容
*） 铸造NFT：mint
*） 安全铸造NFT（检查是否可以被合约地址拥有）：safeMint
*） 可查询接口：tokenByIndex, tokenOfOwnerByIndex
*） 转移：transferFrom

设计要点：
1） 完全兼容ISOTOP1010
2） tokenURI 返回固定的链接，所有token内容相同
 */

import "./IISOTOP1010.sol";

interface IISOTOP1016 is IISOTOP1010 {}
