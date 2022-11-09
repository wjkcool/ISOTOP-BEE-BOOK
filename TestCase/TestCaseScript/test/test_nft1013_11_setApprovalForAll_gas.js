import('./config.js');
const { getContractAddressForNFT1013, call_setApprovalForAll, call_mint_or_safeMint, getTokenIdForIndx } = require('./test_common');
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("测试连接文昌测试链 - NFT1013合约", function(){
     
    //NFT1013合约
    let newContractSubAddr;     //签发者最新签发的NFT1013合约地址
    let newContractSub;         //签发者最新签发的NFT1013合约对象（消息）
    let newContractSub_rw;      //签发者最新签发的NFT1013合约对象（交易与消息）
    let newContractSub_rw_not_signer; //非签发者NFT1013合约对象（交易与消息）

    //gasPrice
    let gas_price;
    let tokenId;

    describe("获取链上信息", function() {
        it("获取链上信息", async function() {           
            gas_price = await PROVIDER.getGasPrice();          
            expect(gas_price).to.not.be.undefined;           
        })
    });

    describe("调用NFT1013合约 - setApprovalForAll", function(){

        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
            newContractSub_rw_not_signer = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER);
            newContractSub_rw_not_signer_2 = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER_2);
        });
            

        describe("调用 setApprovalForAll 函数 - gas消耗", function() { 
            //发行数量
            let issue_count = 10000;

            //创建一定数量的token
            it("1. 创建一定数量的token", async function() {
                await call_mint_or_safeMint(newContractSub, newContractSub_rw, 1, PUBLIC_KEY, issue_count, false);
            }) 

            it("2. 批量授权 - true", async function() { 
                
                try {
                    await call_setApprovalForAll(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, true);
                } catch (error) {
                    expect(error.message).to.be.empty;
                }
            }); 

            it("3. 批量授权 - false", async function() { 
                
                try {
                    await call_setApprovalForAll(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, false);
                } catch (error) {
                    expect(error.message).to.be.empty;
                }
            }); 
                    
        }); 
    });
 
});


