import('./config.js');
const { getContractAddressForNFT1013, call_setBaseURI } = require('./test_common');
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
            newContractSub_rw_not_signer = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER);
        });

        describe("调用 setBaseURI 函数 - Success", function() {
   

            it("1.1 签发者调用 -> 参数非空", async function() {
                let baseURI = "https://bafybeigtb3tt4a2eyurd4vk7jrjuiwnetufyfy7evmf4e2nwljatrcsdhq.ipfs.nftstorage.link/"
                await call_setBaseURI(newContractSub, newContractSub_rw, gas_price, baseURI);
            }); 

            it("1.2 签发者调用 -> 参数为空字符串", async function() {
                await call_setBaseURI(newContractSub, newContractSub_rw, gas_price, "");
            });
                 
        }); 
        
        describe("调用 setBaseURI 函数 - Error", function() {                      
            it("2.1 非签发者调用", async function() {
                let baseURI = "bafybeigtb3tt4a2eyurd4vk7jrjuiwnetufyfy7evmf4e2nwljatrcsdhq"

                try {
                    await call_setBaseURI(newContractSub, newContractSub_rw_not_signer, gas_price, baseURI);
                } catch (error) {
                    console.log("错误信息：", error.message);
                    expect(error.message).to.not.be.empty;
                }   
            });                
        });

    });
 
});


