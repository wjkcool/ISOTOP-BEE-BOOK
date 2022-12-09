// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.13;

/// @title PLAN-BEE IIsotopFactory 同位素扩展合约的工厂
/// @author Iwan Cao
/// @notice 开放使用合约，任何人可以申请一个合约部署，已经支持的合约名称：
/// @dev 此合约为一个Ownable继承合约，只有owner可以注册模板合约地址
/// @custom:planbee 这是一个PLAN-BEE计划认证的合约

interface IFactory {
    /// @dev 合约模板注册，编号ID
    event ContractRegistered(string ID, address indexed deployAddress);

    /// @dev 新合约被创建
    event ContractDeployed(
        string ID,
        address indexed deployAddress,
        address indexed ownerAddress
    );

    /// @dev 注册一个合约地址，只有owner可以调用
    function register(string calldata _id, address master) external;

    /// @dev 部署一个合约，根据模板合约的ID克隆部署一个合约，并返回地址
    function deployContract(string calldata _id) external returns (address);

    // 获取本人最近申请的合约地址
    function getLastDeployed(string calldata _id)
        external
        view
        returns (address);

    // 获取工厂已经注册的合约
    function getContractRegistered() external view returns (string[] memory);

    // 获取合约模板的详情
    function getTemplateDetails(string calldata _id)
        external
        view
        returns (
            address template,
            address owner,
            address[] memory deployed
        );

    // 获取模板名字所有部署的合约地址列表
    function getContractsDeployed(string calldata _id)
        external
        view
        returns (address[] memory);
}
