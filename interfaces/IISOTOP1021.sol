// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../contracts/ERC3525/interfaces/IERC3525.sol";
import "../contracts/ERC3525/interfaces/IERC3525Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

// 管理员的用户标识
uint256 constant ADMIN_ID = type(uint256).max;

interface IISOTOP1021 is IERC3525, IERC3525Metadata, IERC721Enumerable {
    event baseURIChanged(string uri);
    event detailsURIChanged(string uri);
    event gasLoaded(address gasManager);

    // 初始化合约。名称，标识，基本URI，详情URI，总发行的积分数量
    function init(
        string memory name_,
        string memory symbol_,
        string memory base_,
        string memory details_,
        uint256 _totalPoints
    ) external;

    // 合约名称
    function contractName() external pure returns (string memory);

    function setBaseURI(string memory base_) external;

    function setDetailsURI(string memory uri_) external;

    function transferOwnership(address newOwner) external;

    // 铸造会员卡，tokenId建议是用户身份证数字，不能为0。初始积分的数量为0
    function mint(address _to, uint256 tokenId) external;

    // 铸造会员卡，初始积分为value_
    function mint(
        address to_,
        uint256 tokenId_,
        uint256 value_
    ) external;

    // 为编号为tokenId的会员卡充值_value
    function fill(uint256 tokenId, uint256 _value) external;

    function fill(
        address _to,
        uint256 _value,
        uint256 newId
    ) external;

    // 消耗积分
    function consume(uint256 tokenId, uint256 _value) external;

    // 转移积分给新用户，指定新用户的id为newId
    function transferFrom(
        uint256 fromTokenId_,
        address to_,
        uint256 value_,
        uint256 newId
    ) external;

    // 返回tokenId的可视化内容
    function tokenURI(uint256 tokenId) external view returns (string memory);

    // 返回积分的可视化内容
    function slotURI() external view returns (string memory);
}
