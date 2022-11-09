import('./config.js');
const { getContractAddressForNFT1013, sleep } = require('./test_common');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("测试连接文昌测试链 - NFT1013合约", function(){
     
    //NFT1013合约
    let newContractSubAddr;     //签发者最新签发的NFT1013合约地址
    let newContractSub;         //签发者最新签发的NFT1013合约对象（消息）
    let newContractSub_rw;      //签发者最新签发的NFT1013合约对象（交易与消息）

    //NFT总发行量 - 获取baseURI使用
    let totalSupply;

    describe("调用NFT1013合约", function(){
        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();
            console.log("合约地址 = ", newContractSubAddr);

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
        });    

        
        it("获取一定范围内地址持有的所有tokenId - tokenOfOwnerByIndex()", async function() {
            let tokenId = await newContractSub.tokenOfOwnerByIndex(PUBLIC_KEY, 1);

            expect(tokenId).to.not.be.undefined;
            console.log("地址持有Index的tokenId =", tokenId);
        });

        
        it("获取某一地址持有的所有tokenId - tokenByIndex()", async function() {
            let tokenId = await newContractSub.tokenByIndex(1);

            expect(tokenId).to.not.be.undefined;
            console.log("Index对应的tokenId =", tokenId);
        });

    });
 
});


