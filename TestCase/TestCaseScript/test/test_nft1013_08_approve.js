import('./config.js');
const { getContractAddressForNFT1013, call_approve, getOrCreateTokenIdFromAddr, call_transferFrom, getTimestampForNow, call_setUser } = require('./test_common');
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

    describe("调用NFT1013合约 - approve", function(){

        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
            newContractSub_rw_not_signer = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER);
            newContractSub_rw_not_signer_2 = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER_2);
        });
            
        describe("调用 approve 函数 - 调用者为合约Owner", function() {  

            it("1.1 授权给 非Owner，tokenId存在", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);        
                
                try {
                    await call_approve(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER,tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.2 授权给 Owner（自租），tokenId存在", async function() {
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);  
                
                try {
                    await call_approve(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY,tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.3 授权给 合约地址，tokenId存在", async function() {
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);  
                
                try {
                    await call_approve(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, RUN_CONFIG.contractSubAddr,tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        });    

        describe("调用 approve 函数 - 调用者为非合约Owner", function() { 

            it("2.1 授权给 非Owner，tokenId存在", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);   
                
                //授权非Owner
                await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                
                try {
                    await call_approve(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER,  PUBLIC_KEY_IS_NOT_SIGNER_2, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("2.2 授权给 合约Owner，tokenId存在", async function() {
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);   
                
                //转给非Owner
                await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                
                try {
                    await call_approve(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER,  PUBLIC_KEY, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("2.3 授权给 合约地址，tokenId存在", async function() {
                
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);   
                
                //转给非Owner
                await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                
                try {
                    await call_approve(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER,  RUN_CONFIG.contractSubAddr, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        }); 
        
        describe("调用 approve 函数 - 调用者为合约Owner - Error", function() { 

            it("3.1 授权给零地址", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY); 
                
                try {
                    await call_approve(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_ZERO, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 

            it("3.2 授权给无效地址", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY); 
                
                try {
                    await call_approve(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_INVALID, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 

            it("3.3 tokenId为非调用者", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY); 
                
                try {
                    await call_approve(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
                
            }); 
                    
        }); 

        describe("调用 approve 函数 - 场景1 - 授权后转账", function() { 

            it("4.1 为账户A创建一个token", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY); 
            }); 

            it("4.2 账户A将token授权给账户B", async function() { 
                
                try {
                    await call_approve(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("4.3 账户A将token转账给账户C", async function() { 
                
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER_2, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        }); 

        describe("调用 approve 函数 - 场景2 - 授权后租借", function() { 

            it("5.1 为账户A创建一个token", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY); 
                //过期时间10分钟
                expires = getTimestampForNow(10);
            }); 

            it("5.2 账户A将token授权给账户B", async function() { 
                
                try {
                    await call_approve(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("5.3 账户A将token租借给账户C", async function() { 
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY,tokenId, PUBLIC_KEY_IS_NOT_SIGNER_2, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("5.4 账户A将token租借给账户D", async function() { 
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY,tokenId, RUN_CONFIG.contractSubAddr, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        });
    });
 
});


