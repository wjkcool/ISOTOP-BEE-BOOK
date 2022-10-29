// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.13;

address constant BEE_FACTORY_ADDRESS = 0xa9804fA08259Ef88856E35BaeCd6FfC7BF9dbCd0;

/// @title PLAN-BEE IIsotopFactory 同位素扩展合约的工厂
/// @author Iwan Cao
/// @notice 开放使用合约，任何人可以申请一个合约部署，已经支持的合约名称：
/// ISOTOP1010: 低GAS费ERC7211合约
/// ISOTOP1011: 可销毁低GAS费合约
/// ISOTOP1012: 可查询可销毁
/// ISOTOP1013: 可租借合约
/// @dev 此合约为一个Ownable继承合约，只有owner可以注册模板合约地址
/// @custom:planbee 这是一个PLAN-BEE计划认证的合约

interface IFactory {
    /// @dev 合约模板注册，编号ID
    event ContractRegistered(string ID, address indexed deployAddress);

    /// @dev 新合约被创建
    event ContractDeployed(
        address indexed deployAddress,
        address indexed ownerAddress
    );

    /// @dev 注册一个合约地址，只有owner可以调用
    function register(string calldata _id, address master) external;

    /// @dev 部署一个合约，根据模板合约的ID克隆部署一个合约，并返回地址
    function deployContract(string calldata _id) external returns (address);

    /// @dev 查看msg.sender部署的合约列表
    function getContractsDeployed() external view returns (address[] memory);
}
