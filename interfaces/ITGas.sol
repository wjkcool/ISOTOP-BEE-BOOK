// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// IISOTOP version 0.10
// Creator: Dr. Zu team

/// @title PLAN-BEE TGAS 服务费自动扣费系统合约
/// @author Iwan Cao
/// @notice 开放使用合约，任何人可以注册自己的余额系统

/// @dev contributor: 作者，每次被调用收取费用
/// @dev angency： 代理商，代收费，充值，提现
/// @dev sponsor： 赞助商：出钱，使用功能付费
/// @custom:planbee 这是一个PLAN-BEE计划认证的合约

interface ITGas {
    event Charge(address agency, address sponsor, uint256 amount);
    event Cash(address agency, address contributor, uint256 amount);
    event Bill(
        address sponsor,
        address agency,
        address contributor,
        uint256 amount,
        string info
    );

    function charge(address _sponsor, uint256 _amount) external;

    function cash(address _contributor, uint256 _amount) external;

    /// @dev Sponsor functions
    function bill(
        address _angency,
        address _contributor,
        uint256 _amount,
        string memory _info
    ) external;

    /// @dev View functions
    function balance_AC(address _agency) external view returns (uint256);

    function balance_AC() external view returns (uint256);

    function balance_CA(address _contributor) external view returns (uint256);

    function balance_CA() external view returns (uint256);

    function balance_SA(address _sponsor) external view returns (uint256);

    function balance_SA() external view returns (uint256);

    function balance_AS(address _agency) external view returns (uint256);

    function balance_AS() external view returns (uint256);
}
