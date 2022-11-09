import('./config.js');
const { getContractAddressForNFT1013, call_burn, getOrCreateTokenIdFromAddr, call_approve, getTimestampForNow, call_setUser } = require('./test_common');
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
    let expires;

    describe("获取链上信息", function() {
        it("获取链上信息", async function() {           
            gas_price = await PROVIDER.getGasPrice();          
            expect(gas_price).to.not.be.undefined;           
        })
    });

    describe("调用NFT1013合约 - burn", function(){

        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
            newContractSub_rw_not_signer = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER);
            newContractSub_rw_not_signer_2 = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER_2);
        });
            
        describe("调用 burn 函数 - Success", function() {  

            it("1.1 调用者为合约Owner，销毁存在的tokenId（tokenId为合约Owner持有）", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);        
                
                try {
                    await call_burn(newContractSub, newContractSub_rw, gas_price, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.2 调用者为合约Owner，销毁存在的tokenId（tokenId为非合约Owner持有）", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY_IS_NOT_SIGNER);        
                
                try {
                    await call_burn(newContractSub, newContractSub_rw, gas_price, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.3 调用者为合约Owner，销毁存在的tokenId（tokenId为合约地址持有）", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, RUN_CONFIG.contractSubAddr);        
                
                try {
                    await call_burn(newContractSub, newContractSub_rw, gas_price, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        });    
            
        describe("调用 burn 函数 - Error", function() { 

            it("2.1 调用者为非合约Owner，销毁存在的tokenId", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY_IS_NOT_SIGNER);        
                
                try {
                    await call_burn(newContractSub, newContractSub_rw_not_signer, gas_price, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 

            it("2.2 调用者为合约Owner，销毁不存在的tokenId", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY_IS_NOT_SIGNER);        
                
                try {
                    await call_burn(newContractSub, newContractSub_rw_not_signer, gas_price, parseInt(tokenId) + 1000);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 
                    
        });     

        describe("调用 burn 函数 - 场景1 - 授权后销毁", function() { 

            it("3.1 为账户Owner创建一个token", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY); 
            }); 

            it("3.2 账户Owner将token授权给账户B", async function() {                
                try {
                    await call_approve(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("3.3 账户Owner将token销毁", async function() {               
                try {
                    await call_burn(newContractSub, newContractSub_rw, gas_price, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        }); 

        describe("调用 burn 函数 - 场景1 - 租借后销毁", function() { 

            it("4.1 为账户Owner创建一个token", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY); 
            }); 

            it("4.2 账户Owner将token租借给账户B", async function() {                
                try {
                    //设置过期分钟
                    let expiresMinute = 5;
                    //过期时间
                    expires = getTimestampForNow(expiresMinute);

                    await call_setUser(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY,tokenId, PUBLIC_KEY_IS_NOT_SIGNER, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("4.3 账户Owner将token销毁", async function() {               
                try {
                    await call_burn(newContractSub, newContractSub_rw, gas_price, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        }); 
    });
 
});


