// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./IDDS.sol";
import "./ITGas.sol";
import "./ITGasStrategy.sol";

interface IsotopTemplate {
    function contractName() external returns (string memory);
}

contract SimpleTGas is ITGasStrategy, Ownable {
    using SafeMath for uint256;
    IDDS dds;

    constructor() {
        dds = IDDS(BEE_DDS_ADDRESS);
    }

    function getDDS() external view returns (address) {
        return address(dds);
    }

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
        uint256 _price = dds.toInt(dds.get("ISOTOP", info));
        uint256 _factor = quantity.div(100) + 1;
        _bill(
            string(
                abi.encodePacked(
                    info,
                    _toString(quantity),
                    "(",
                    _toString(_factor),
                    ")"
                )
            ),
            _price.mul(_factor)
        );
    }

    function _bill(string memory funcInfo, uint256 price) internal {
        address tgas = dds.toAddress(dds.get("ISOTOP", "BEE_TGAS_ADDRESS"));
        require(tgas != ZERO, "No TGas found in DDS");

        ITGas(tgas).bill(BEE_ISOTOP_ADDRESS, BEE_IWAN_ADDRESS, price, funcInfo);
    }

    function _toString(uint256 value)
        internal
        pure
        virtual
        returns (string memory str)
    {
        assembly {
            // The maximum value of a uint256 contains 78 digits (1 byte per digit), but
            // we allocate 0xa0 bytes to keep the free memory pointer 32-byte word aligned.
            // We will need 1 word for the trailing zeros padding, 1 word for the length,
            // and 3 words for a maximum of 78 digits. Total: 5 * 0x20 = 0xa0.
            let m := add(mload(0x40), 0xa0)
            // Update the free memory pointer to allocate.
            mstore(0x40, m)
            // Assign the `str` to the end.
            str := sub(m, 0x20)
            // Zeroize the slot after the string.
            mstore(str, 0)

            // Cache the end of the memory to calculate the length later.
            let end := str

            // We write the string from rightmost digit to leftmost digit.
            // The following is essentially a do-while loop that also handles the zero case.
            // prettier-ignore
            for { let temp := value } 1 {} {
                str := sub(str, 1)
                // Write the character to the pointer.
                // The ASCII index of the '0' character is 48.
                mstore8(str, add(48, mod(temp, 10)))
                // Keep dividing `temp` until zero.
                temp := div(temp, 10)
                // prettier-ignore
                if iszero(temp) { break }
            }

            let length := sub(end, str)
            // Move the pointer 32 bytes leftwards to make room for the length.
            str := sub(str, 0x20)
            // Store the length.
            mstore(str, length)
        }
    }
}
