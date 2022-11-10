// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

address constant BEE_DEPLOYER_ADDRESS = 0x18C353Ca538702f862526Cd2DEeabA35f0ED3BEE;

/// @title PLAN-BEE IDeployer 同位素合约部署器
/// @author Iwan Cao
/// @notice 开放使用合约，任何人可以部署自己的合约到指定地址
/// @dev 此合约可以通过salt来修改部署合约的地址
/// @custom:planbee 这是一个PLAN-BEE计划认证的合约

interface IDeployer {
    event Deployed(address addr, address indexed owner, uint256 salt);

    function getAddress(bytes memory bytecode, uint256 _salt)
        external
        view
        returns (address);

    function Deploy(bytes memory bytecode, uint256 _salt) external;

    function transferOwnership(address _addr, address _newOwner) external;
}
