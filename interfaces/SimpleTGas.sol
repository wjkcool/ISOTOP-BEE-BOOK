// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./IDDS.sol";
import "./ITGas.sol";
import "./ITGasStrategy.sol";

// angency address = admin
address constant BEE_ISOTOP_ADDRESS = 0x7B0dc23E87febF1D053E7Df9aF4cce30F21fAe9C;
// contributor address = iwan
address constant BEE_IWAN_ADDRESS = 0x8Ce68C53Ec6C8A55A32dD6c84c9207BFbd901eaB;
address constant BEE_CREATOR_ADDRESS = 0xAb1fdD3F84b2019BEF47939E66fb6194532f9640;

interface IsotopTemplate {
    function contractName() external returns (string memory);
}

contract SimpleTGas is ITGasStrategy, Ownable {
    IDDS dds = IDDS(BEE_DDS_ADDRESS);

    function bill(string calldata func) external {
        string memory info = string(
            abi.encodePacked(
                IsotopTemplate(msg.sender).contractName(),
                ".",
                func
            )
        );
        _bill(info, dds.toInt(dds.get("ISOTOP", info)));
    }

    function bill(string calldata func, uint256 quantity) external {
        string memory info = string(
            abi.encodePacked(
                IsotopTemplate(msg.sender).contractName(),
                ".",
                func
            )
        );
        _bill(info, dds.toInt(dds.get("ISOTOP", info)) * quantity);
    }

    function _bill(string memory func, uint256 cash) internal {
        ITGas gas = ITGas(dds.toAddress(dds.get("ISOTOP", "BEE_TGAS_ADDRESS")));
        gas.bill(BEE_ISOTOP_ADDRESS, BEE_IWAN_ADDRESS, cash, func);
    }
}
