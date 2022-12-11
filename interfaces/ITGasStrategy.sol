// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

string constant DEPLOY = "deploy";
string constant MINT = "mint";
string constant BURN = "burn";
string constant TRANSFER = "transferFrom";
string constant TRANSFERACROSSCHAIN = "transferAcrossChain";
string constant SETUSER = "setUser";
string constant VRF = "VRF";
string constant CONSUME = "consume";
string constant FILL = "fill";

address constant ZERO = 0x0000000000000000000000000000000000000000;

interface ITGasStrategy {
    function bill(string calldata func) external;

    function bill(string calldata func, uint256 quantity) external;
}
