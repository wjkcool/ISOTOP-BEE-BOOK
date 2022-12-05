// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface IISOTOP1040 {
    // 创建一个sould token， 地址_to 为创世地址
    function createSoul(address _to, uint256 soulId) external;

    // 增加一个地址给token
    function soulAddAccount(uint256 soulId, address _account) external;

    // 删除掉一个地址
    function soulRemoveAccount(uint256 soulId, address _account) external;

    // 将一个SBT赋予Soul token
    function assign(
        address _to,
        uint256 _soulId,
        string calldata _issuer,
        string calldata _certification
    ) external;
}
