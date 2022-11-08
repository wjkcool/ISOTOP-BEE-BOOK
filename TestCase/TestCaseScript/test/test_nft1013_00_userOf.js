import('./config.js');
const { getContractAddressForNFT1013, sleep } = require('./test_common');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("测试连接文昌测试链 - NFT1013合约", function(){
     
    //NFT1013合约
    let newContractSubAddr;     //签发者最新签发的NFT1013合约地址
    let newContractSub;         //签发者最新签发的NFT1013合约对象（消息）
    let newContractSub_rw;      //签发者最新签发的NFT1013合约对象（交易与消息）

    //NFT总发行量 - 获取baseURI使用
    let totalSupply;

    describe("调用NFT1013合约", function(){
        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();
            console.log("合约地址 = ", newContractSubAddr);

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
        });    

            it("获取tokenId所有者， Of", async function() {    

                const tokenList = await Promise.all(
                    [40047,45046,50046].map(i => newContractSub.userOf(i)),
                );

                expect(tokenList.map(t => t.toString())).to.have.members([PUBLIC_KEY_IS_NOT_SIGNER, PUBLIC_KEY_IS_NOT_SIGNER, PUBLIC_KEY_IS_NOT_SIGNER ]);


                // let tokenId = 40047;
                // let addr = await newContractSub.userOf(tokenId);

                // //验证NFT名称已定义
                // expect(addr).to.not.be.undefined;
                // console.log("token( " + tokenId + " ) 租借者=", addr);

                // if (addr == undefined || addr == "") {
                    
                //     var fs  = require("fs");

                //     //发行指定数量
                //     fs.appendFile("test3.txt",addr,"utf8",function(err){
                //         if(!err){
                //             console.log("写入成功！");
                //         }
                //     });
                // }

            });  

    });
 
});


