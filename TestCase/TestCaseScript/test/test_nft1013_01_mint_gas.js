import('./config.js');
const { getContractAddressForNFT1013, sleep } = require('./test_common');
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

        describe("调用 mint 函数 - GAS", function() {
            let issue_count = 10000;

            for (i = 0; i < 500; i++) {
            // console.log(i);
                it("1.1 签发者发token ", async function() {

                    console.log("start == ", new Date())

                    //获取总发行量
                    let totalSupply_before = await newContractSub.totalSupply();   
                    console.log("发行token前，总发行量=", totalSupply_before);
                    let tx = await newContractSub_rw.mint(PUBLIC_KEY, issue_count, { gasPrice: 1, gasLimit: "40000000" });
                
                    //等待交易确认
                    await tx.wait().then((txResult) => {
                        console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice);
                        //消耗写入文件
                        var fs  = require("fs");
                        fs.appendFile("test3.txt", issue_count + "    " + txResult.cumulativeGasUsed + "\n",{flag:"a"},function(err){
                            if(!err){
                                console.log("写入成功！");
                            } else {
                                console.log("写入失败");
                            }
                        });
                    })

                    console.log("end == ", new Date())
                }); 

                sleep(1000);
            }     
             
        });

    });
 
});


