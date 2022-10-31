import('./config.js');
const { getContractAddressForNFT1013, call_transferFrom, call_mint_or_safeMint, getTokenIdForIndx } = require('./test_common');
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
    let issue_count;

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

        
        describe("调用 transferFrom 函数 - 发行一个tokenId，转账", function() {  
            //为合约Owner mint 一个tokenId
            it("3.0. 为合约Owner mint 一个tokenId", async function() {       
                let arr = [10]

                issue_count = 10;
                gas_price = 1;

                //发行
                await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, issue_count, false);
                       
                try {

                    for (i = 0; i < arr.length; i++) {
                         let index = arr[0];
                        tokenId = await getTokenIdForIndx(newContractSub, issue_count, index);

                        console.log("第" + i + "次转账tokenId = ", tokenId);
                
                        await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
                    }
                    
                } catch (error) {
                    console.log("错误信息：", error.message)

                    expect(error.message).to.not.be.empty;
                }
            }); 
                 
        });  

    });
 
});


