import('./config.js');
const { getContractAddressForNFT1013, call_transferFrom, getOrCreateTokenIdFromAddr } = require('./test_common');
const { expect } = require("chai");
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

    describe("调用NFT1013合约 - transferFrom", function(){
        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
            newContractSub_rw_not_signer = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER);
            newContractSub_rw_not_signer_2 = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER_2);
        });

        describe("调用 transferFrom 函数 - 场景一", function() {  
            //获取合约Owner是否持有token中的一个，若没有则为合约Owner mint 一个tokenId
            it("1.0. 获取合约Owner是否持有token中的一个，若没有则为合约Owner mint 一个tokenId", async function() {
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);
            }); 

            it("1.1 token持有者（合约owner）调用 -> owner 转 非Owner，tokenId存在", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.2 token持有者（非合约owner）调用 -> 再将上面测试中的tokenId转回（依赖上一步）", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, PUBLIC_KEY, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.3 非持有tokenId者调用 -> from为非持有token地址（依赖上一步）", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, PUBLIC_KEY, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            });  
      
            it("1.4 token持有者（合约owner）调用 -> owner 转给 自己，tokenId存在", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("1.5 token持有者（合约owner）调用 -> 转给 合约地址，tokenId存在", async function() {              
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, RUN_CONFIG.contractSubAddr, tokenId);
                } catch (error) {
                    expect(error.message).to.be.empty;
                }
            }); 
                 
        });   
        
        describe("调用 transferFrom 函数 - 场景二", function() {  
            //为非合约Owner mint 一个tokenId
            it("2.0. 为非合约Owner mint 一个tokenId", async function() {
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY_IS_NOT_SIGNER);
            }); 

            it("2.1 token持有者（非合约owner）调用 -> 转给另一个非合约owner,tokenId存在", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, PUBLIC_KEY_IS_NOT_SIGNER_2, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 

            it("2.2 token持有者（非合约owner）调用 -> 转给合约owner,tokenId存在", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw_not_signer_2, gas_price, PUBLIC_KEY_IS_NOT_SIGNER_2, RUN_CONFIG.contractSubAddr, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.be.empty;
                }
            }); 
                 
        });  
        
        describe("调用 transferFrom 函数 - 场景三", function() {  
            //为合约Owner mint 一个tokenId
            it("3.0. 为合约Owner mint 一个tokenId", async function() {       
                tokenId = await getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY);
            }); 

            it("3.1 from为零地址 转 非Owner，tokenId存在", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY_ZERO, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 

            it("3.2 tokenId持有者 转 to为零地址，tokenId存在", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY, PUBLIC_KEY_ZERO, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 

            it("3.3 from, to 都为零地址, tokenId存在", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw_not_signer_2, gas_price, PUBLIC_KEY_ZERO, PUBLIC_KEY_ZERO, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 

            it("3.4 from为无效地址 转 有效地址, tokenId存在", async function() {               
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw_not_signer_2, gas_price, PUBLIC_KEY_INVALID, PUBLIC_KEY, tokenId);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            });        

            it("3.5 token持有者调用 转 有效地址r，tokenId不存在", async function() {
                try {
                    await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, 1000000000);
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 
                 
        });  

    });
 
});


