// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

address constant BEE_DATETIME_ADDRESS = 0xE6b1b7214D99c8dfaBca77d4e0Dc5fDE74cb4BeE;

/// @title PLAN-BEE IDateTime 日期时间转化合约
/// @author Iwan Cao
/// @notice 开放使用合约，任何人可以使用转化功能
/// @dev 使用公开合约为了避免library导致的地址不确定，无法部署到特殊地址
/// @custom:planbee 这是一个PLAN-BEE计划认证的合约

interface IDateTime {
    /// @dev 返回中文的日期时间字符串
    function timeToDateCN(uint256 timestamp)
        external
        pure
        returns (string memory);

    /// @dev 返回英文的日期时间字符串
    function timeToDate(uint256 timestamp)
        external
        pure
        returns (string memory);

    function isLeapYear(uint16 year) external pure returns (bool);

    function leapYearsBefore(uint256 year) external pure returns (uint256);

    function getDaysInMonth(uint8 month, uint16 year)
        external
        pure
        returns (uint8);

    function getYear(uint256 timestamp) external pure returns (uint16);

    function getMonth(uint256 timestamp) external pure returns (uint8);

    function getDay(uint256 timestamp) external pure returns (uint8);

    function getHour(uint256 timestamp) external pure returns (uint8);

    function getMinute(uint256 timestamp) external pure returns (uint8);

    function getSecond(uint256 timestamp) external pure returns (uint8);

    function getWeekday(uint256 timestamp) external pure returns (uint8);

    function toTimestamp(
        uint16 year,
        uint8 month,
        uint8 day
    ) external pure returns (uint256 timestamp);

    function toTimestamp(
        uint16 year,
        uint8 month,
        uint8 day,
        uint8 hour
    ) external pure returns (uint256 timestamp);

    function toTimestamp(
        uint16 year,
        uint8 month,
        uint8 day,
        uint8 hour,
        uint8 minute
    ) external pure returns (uint256 timestamp);

    function toTimestamp(
        uint16 year,
        uint8 month,
        uint8 day,
        uint8 hour,
        uint8 minute,
        uint8 second
    ) external pure returns (uint256 timestamp);
}
