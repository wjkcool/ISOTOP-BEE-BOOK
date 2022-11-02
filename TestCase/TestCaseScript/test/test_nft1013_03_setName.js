import('./config.js');
const { getContractAddressForNFT1013,  call_setName } = require('./test_common');
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

        describe("调用 setName 函数 - Success", function() {

            it("0.获取NFT名称", async function() {
                let name = await newContractSub.name();
                console.log("NFT名称=", name);

                //验证合约地址余额是否大于等于0
                expect(name).to.not.be.undefined;
            });    

            it("1.1 签发者调用 -> name 非空字符串，长度1", async function() {
                await call_setName(newContractSub, newContractSub_rw, gas_price, "M");
            }); 

            it("1.2 签发者调用 -> name 空字符串，长度0", async function() {
                await call_setName(newContractSub, newContractSub_rw, gas_price, "");
            });
                       
            it("1.3 签发者调用 -> name 非空字符串，长度100", async function() {
                await call_setName(newContractSub, newContractSub_rw, gas_price, "MyFirstNFTMyFirstNFTMyFirstNFTMyFirstNFTMyFirstNFTMyFirstNFTMyFirstNFTMyFirstNFTMyFirstNFTMyFirstNFT");
            }); 
                       
            it("1.4 签发者调用 -> name 非空字符串，长度10", async function() {
                await call_setName(newContractSub, newContractSub_rw, gas_price, "MyFirstNFT");
            }); 
                 
        });     
        
        describe("调用setName函数 - Error", function() {                      
            it("2.1 非签发者调用 -> name 非空字符串，长度10", async function() {
                try {
                    await call_setName(newContractSub, newContractSub_rw_not_signer, gas_price, "IsNoSigner");
                } catch (error) {
                    console.log("错误信息：", error.message);
                    expect(error.message).to.not.be.empty;
                }          
            });                 
        });
 

    });
 
});


