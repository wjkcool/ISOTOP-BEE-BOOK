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
// angency address = admin
address constant BEE_ISOTOP_ADDRESS = 0x7B0dc23E87febF1D053E7Df9aF4cce30F21fAe9C;
// address constant BEE_ISOTOP_ADDRESS = 0x1b0Dc23E87FEbF1d053e7Df9aF4cce30f21FAe9c;
// contributor address = iwan
address constant BEE_IWAN_ADDRESS = 0x8Ce68C53Ec6C8A55A32dD6c84c9207BFbd901eaB;
// address constant BEE_IWAN_ADDRESS = 0x1cE68C53eC6c8A55A32dd6c84C9207bFBD901eaB;

address constant BEE_CREATOR_ADDRESS = 0xAb1fdD3F84b2019BEF47939E66fb6194532f9640;

// address constant BEE_CREATOR_ADDRESS = 0x1B1FdD3F84B2019bEf47939E66fb6194532F9640;

interface ITGasStrategy {
    function bill(string calldata func) external;

    function bill(string calldata func, uint256 quantity) external;
}
