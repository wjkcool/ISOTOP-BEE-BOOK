import('./config.js');
const { getContractAddressForNFT1013, call_transferOwnership, getOrCreateTokenIdFromAddr } = require('./test_common');
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

    describe("调用NFT1013合约 - transferOwnership", function(){

        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
            newContractSub_rw_not_signer = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER);
            newContractSub_rw_not_signer_2 = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER_2);
        });
            
        describe("调用 transferOwnership 函数 - Success", function() {  

            it("1.1 调用者为合约Owner，批量转移给合约Owner（自己）", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);        
                
                try {
                    await call_transferOwnership(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.2 调用者为合约Owner，批量转移给非合约Owner", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);        
                
                try {
                    await call_transferOwnership(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.3 调用者为合约Owner，批量转移合约地址", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);        
                
                try {
                    await call_transferOwnership(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, RUN_CONFIG.contractSubAddr);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            });            

            it("1.4 调用者为非合约Owner，批量转移合约Owner", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY_IS_NOT_SIGNER);        
                
                try {
                    await call_transferOwnership(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, PUBLIC_KEY);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        });    
            
        describe("调用 transferOwnership 函数 - Error", function() { 

            it("2.1 调用者为合约Owner，批量转移零地址", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);        
                
                try {
                    await call_transferOwnership(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_ZERO);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 

            
            it("2.2 调用者为合约Owner，批量转移无效地址", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);        
                
                try {
                    await call_transferOwnership(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_INVALID);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 
                    
        });     


    });
 
});


