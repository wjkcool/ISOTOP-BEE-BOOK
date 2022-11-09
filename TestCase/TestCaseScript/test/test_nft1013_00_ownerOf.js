import('./config.js');
const { getContractAddressForNFT1013, getTokenIdForIndx } = require('./test_common');
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

        it("1. 获取tokenId所有者， ownerOf", async function() {
            let tokenId = 153556;
            let addr = await newContractSub.ownerOf(tokenId);

            //验证NFT名称已定义
            expect(addr).to.not.be.undefined;
            console.log("token( " + tokenId + " ) 持有者=", addr);


        });  
        it("2. 获取tokenId所有者， ownerOf", async function() {
            //发行数量
            let issue_count = 20000;

            //查询本次的第一个tokenId
            tokenIdFirst = await getTokenIdForIndx(newContractSub, issue_count, 1);
            tokenIdMiddle = await getTokenIdForIndx(newContractSub, issue_count, parseInt(issue_count/2));
            tokenIdLast = await getTokenIdForIndx(newContractSub, issue_count, issue_count);

            const tokenList = await Promise.all(
                [tokenIdFirst, tokenIdMiddle, tokenIdLast].map(i => newContractSub.ownerOf(i)),
            );

            expect(tokenList.map(t => t.toString())).to.have.members([PUBLIC_KEY, PUBLIC_KEY, PUBLIC_KEY ]);


        });  

    });
 
});


