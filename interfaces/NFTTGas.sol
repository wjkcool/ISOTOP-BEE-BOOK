// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./NFTTGasInterface.sol";
import "./IDateTime.sol";
import "./IDDS.sol";
import "./ITGas.sol";

// angency address = admin
address constant BEE_ISOTOP_ADDRESS = 0x7B0dc23E87febF1D053E7Df9aF4cce30F21fAe9C;
// contributor address = iwan
address constant BEE_IWAN_ADDRESS = 0x8Ce68C53Ec6C8A55A32dD6c84c9207BFbd901eaB;
address constant BEE_CREATOR_ADDRESS = 0xAb1fdD3F84b2019BEF47939E66fb6194532f9640;

interface ISOTOP_CONTRACT {
    function contractName() external returns (string memory);
}

contract NFTTGas is NFTTGasInterface, Ownable {
    using SafeMath for uint256;

    IDDS dds = IDDS(BEE_DDS_ADDRESS);

    ITGas gas = ITGas(dds.toAddress(dds.get("ISOTOP", "BEE_TGAS_ADDRESS")));
    IDateTime date =
        IDateTime(dds.toAddress(dds.get("ISOTOP", "BEE_DATETIME_ADDRESS")));

    uint8 public currentMonth = 0;
    uint256 private monthlySum = 0;

    function bill(string calldata func) external {
        string memory info = string(
            abi.encodePacked(
                ISOTOP_CONTRACT(msg.sender).contractName(),
                ".",
                func
            )
        );
        _bill(info, dds.toInt(dds.get("ISOTOP", info)));
    }

    function bill(string calldata func, uint256 quantity) external {
        string memory info = string(
            abi.encodePacked(
                ISOTOP_CONTRACT(msg.sender).contractName(),
                ".",
                func
            )
        );
        _bill(info, dds.toInt(dds.get("ISOTOP", info)) * quantity);
    }

    function _bill(string memory func, uint256 cash) internal {
        uint8 _now = date.getMonth(block.timestamp);
        if (_now != currentMonth) {
            currentMonth = _now;
            monthlySum = 0;
        }

        /// @notice 1万元以上5折
        if (monthlySum > 100000000)
            cash = cash.div(2);
            /// @notice 1千元以上8折
        else if (monthlySum > 10000000) cash = cash.mul(8).div(10);

        gas.bill(BEE_ISOTOP_ADDRESS, BEE_IWAN_ADDRESS, cash.div(2), func);
        gas.bill(BEE_ISOTOP_ADDRESS, BEE_CREATOR_ADDRESS, cash.div(2), func);
        monthlySum += cash;
    }
}
