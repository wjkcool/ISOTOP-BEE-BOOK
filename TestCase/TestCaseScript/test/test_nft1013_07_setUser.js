import('./config.js');
const { getContractAddressForNFT1013, call_setUser, getOrCreateTokenIdFromAddr, call_transferFrom, getTimestampForNow } = require('./test_common');
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

    describe("调用NFT1013合约 - setUser", function(){

        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
            newContractSub_rw_not_signer = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER);
            newContractSub_rw_not_signer_2 = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER_2);
        });
            
        //获取合约Owner是否持有token中的一个，若没有则为合约Owner mint 一个tokenId
        it("0 设置过期时间", async function() {
            //设置过期分钟
            let expiresMinute = 5;
            //过期时间
            expires = getTimestampForNow(expiresMinute);
        }); 

        describe("调用 setUser 函数 - 调用者为合约Owner", function() {  

            it("1.1 租借给 非Owner，tokenId存在", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);        
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY,tokenId, PUBLIC_KEY_IS_NOT_SIGNER, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.2 租借给 Owner（自租），tokenId存在", async function() {
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);  
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY,tokenId, PUBLIC_KEY, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.3 租借给给 合约地址，tokenId存在", async function() {
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);  
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY,tokenId, RUN_CONFIG.contractSubAddr, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        });    

        describe("调用 setUser 函数 - 调用者为非合约Owner", function() { 

            it("2.1 租借给 非Owner，tokenId存在", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);   
                
                //转给非Owner
                await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, tokenId, PUBLIC_KEY_IS_NOT_SIGNER_2, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("2.2 租借给 合约Owner，tokenId存在", async function() {
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);   
                
                //转给非Owner
                await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, tokenId, PUBLIC_KEY, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("2.3 租借给给 合约地址，tokenId存在", async function() {
                
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);   
                
                //转给非Owner
                await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER,tokenId, RUN_CONFIG.contractSubAddr, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                    
        }); 
        
        describe("调用 setUser 函数 - 调用者为合约Owner - Error", function() { 

            it("3.1 租借给 非Owner，tokenId存在", async function() {   
                //创建1个token   
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY); 

                let min = -5

                expires = getTimestampForNow(min);
                
                try {
                    await call_setUser(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY, tokenId, PUBLIC_KEY, expires);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 
                    
        }); 
    });
 
});


