import('./config.js');
const { call_deployContract, getContractsDeployed } = require('./test_common');
const { expect } = require("chai");
const { ethers } = require("hardhat");

async function initISOTOP1013() {
    const isotopFactory = new ethers.Contract(CONTRACT_ADDRESS, ABI_FACTORY, WALLET_SIGNER); 

}

describe('ISOTOP1013', () => {
    beforeEach(async function () {
       // this.isotop1013 = 
    })
})