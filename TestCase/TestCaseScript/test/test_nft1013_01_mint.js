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

        describe("调用 mint 函数 - Success", function() {
            //发行数量
            let issue_count = 1;

            it("1.1 签发者发token -> 大于0 且为签发者地址", async function() {
                await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, issue_count, false);
            });       

            it("1.2 签发者发token -> 大于0 且为非签发者地址", async function() {
                await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, issue_count, false);
            });

            it("1.3 签发者发token -> 大于0 且为合约地址", async function() {
                await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, RUN_CONFIG.contractSubAddr, issue_count, false);
            });
        });

        describe("调用 mint 函数 - Error", function() {
           
            it("2.1 签发者发token -> 无效地址", async function() {      
                //发行数量
                let issue_count = 10;   

                try {    
                    await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY_INVALID, issue_count, false);
                } catch (error) {
                    console.log("错误信息：", error.message);
                    expect(error.message).to.not.be.empty;
                }
            });
    
            it("2.2 签发者发token -> 发行数量为0", async function() {
                //发行数量
                let issue_count = 0;

                try {
                    await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, issue_count, false);
                } catch (error) {
                    console.log("错误信息：", error.message);
                    expect(error.message).to.not.be.empty;
                }
            });
    
            it("2.3 签发者发token -> 小于0", async function() {
                //发行数量
                let issue_count = -1;

                try {    
                    await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, issue_count, false);
                } catch (error) {
                    console.log("错误信息：", error.message);
                    expect(error.message).to.not.be.empty;
                }
            });

            it("2.4 非签发者发token -> 大于0 且为签发者地址", async function() {  
                //发行数量
                let issue_count = 10;

                try {    
                    let tx = await call_mint_or_safeMint(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY, issue_count, false);

                    //等待交易确认
                    await tx.wait().then((txResult) => {
                        console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
                    });                     
                } catch (error) {
                    console.log("错误信息：", error.message);
                    expect(error.message).to.not.be.empty;
                }
            });

            it("2.5 签发者发token -> 发行数量使用的gas超过默认的 gasLimit=300000", async function() {  
                if (RUN_CONFIG.isIssueToken) {    
                    //发行数量
                    let issue_count = 10000;

                    try {
                        let tx = await newContractSub_rw.mint(PUBLIC_KEY, issue_count, { gasPrice: gas_price, gasLimit: "300000" });

                        //等待交易确认
                        await tx.wait().then((txResult) => {
                            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
                        });  
                    } catch (error) {
                        console.log("错误信息：", error.message);
                        expect(error.message).to.not.be.empty;
                    } 
                }              
            });         
        });

    });
 
});


