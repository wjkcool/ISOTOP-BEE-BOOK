import('./config.js');
const { getContractAddressForNFT1013, sleep } = require('./test_common');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("测试连接文昌测试链 - NFT1013合约", function(){
     
    //NFT1013合约
    let newContractSubAddr;     //签发者最新签发的NFT1013合约地址
    let newContractSub;         //签发者最新签发的NFT1013合约对象（消息）

    describe("调用NFT1013合约", function(){
        it("创建NTF1013合约对象", async function() {
            newContractSubAddr = getContractAddressForNFT1013();
            console.log("合约地址 = ", newContractSubAddr);
            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
        });    

        it("销毁数量", async function() {
            let count = await newContractSub.burned();
            console.log("销毁数量 = ", count.toNumber());
            expect(count.toNumber()).to.greaterThanOrEqual(0);
        });  

    });
 
});


