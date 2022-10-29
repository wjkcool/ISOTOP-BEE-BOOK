// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

address constant BEE_DEPLOYER_ADDRESS = 0xA0307fF0b18A05a0B14B0a1221f417aEDF9c3bEE;

/// @title PLAN-BEE IDeployer 同位素合约部署器
/// @author Iwan Cao
/// @notice 开放使用合约，任何人可以部署自己的合约到指定地址
/// @dev 此合约可以通过salt来修改部署合约的地址
/// @custom:planbee 这是一个PLAN-BEE计划认证的合约

interface IDeployer {
    event Deployed(address addr, address indexed owner, uint256 salt);

    /// 根据salt和合约的bytecode计算合约地址
    function getAddress(bytes memory bytecode, uint256 _salt)
        external
        view
        returns (address);

    /// 使用salt值部署一个合约
    function Deploy(bytes memory bytecode, uint256 _salt) external;
}
