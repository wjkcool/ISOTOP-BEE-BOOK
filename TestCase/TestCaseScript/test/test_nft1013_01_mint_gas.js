import('./config.js');
const { getContractAddressForNFT1013, call_mint_or_safeMint } = require('./test_common');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("测试连接文昌测试链 - NFT1013合约", function(){
     
    //NFT1013合约
    let newContractSubAddr;     //签发者最新签发的NFT1013合约地址
    let newContractSub;         //签发者最新签发的NFT1013合约对象（消息）
    let newContractSub_rw;      //签发者最新签发的NFT1013合约对象（交易与消息）

    //gasPrice
    let gas_price;

    describe("获取链上信息", function() {
        it("获取链上信息", async function() {           
            gas_price = await PROVIDER.getGasPrice();          
            expect(gas_price).to.not.be.undefined;
           // gas_price = gasPrice.toNumber();
        })
    });

    describe("调用NFT1013合约", function(){
        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
        });

        describe("调用 mint 函数", function() {
            it("1. 签发者发token -> 大于0 且为签发者地址", async function() {
                let issue_count = 0;
                let base = 10000;

                for (i = 1; i < 20; i++) {

                    issue_count += base;

                    console.log("本次发行量=", issue_count, i)
                    await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, issue_count, true);             

                    if (issue_count < 10) {
                        base = 1;
                    } else if (issue_count < 100) {
                        base = 10;
                    } else if (issue_count < 1000) {
                        base = 100;
                    } else {
                        base = 1000;
                    }
                }          
            });      
        });

    });
 
});


