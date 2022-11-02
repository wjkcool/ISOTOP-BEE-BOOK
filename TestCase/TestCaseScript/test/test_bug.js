import('./config.js');
const { getContractAddressForNFT1013, call_mint_or_safeMint, call_deployContract } = require('./test_common');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("测试连接文昌测试链 - NFT1013合约", function(){
    //工厂合约
    let contract_factory_rw;
     
    //NFT1013合约
    let newContractSubAddr;     //签发者最新签发的NFT1013合约地址
    let newContractSub;         //签发者最新签发的NFT1013合约对象（消息）
    let newContractSub_rw;      //签发者最新签发的NFT1013合约对象（交易与消息）


    describe("测试过程中出现的BUG", function(){
        it("创建NTF1013合约对象", async function() {
            //工厂合约对象
            contract_factory_rw = new ethers.Contract(CONTRACT_ADDRESS, ABI_FACTORY, WALLET_SIGNER); 

            //NFT1013合约地址
            newContractSubAddr = getContractAddressForNFT1013();

            //NFT1013合约对象
            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
        });

        // it("1. tokensOfOwnerIn - 持有者拥有的token数量比较多时报错", async function() {
        //     //发行数量
        //     let issue_count = 7000;
        //     let gas_price = 1;

        //     //发行指定数量的token
        //     await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, issue_count, false);

        //     //查看token总量
        //     let totalSupply = await newContractSub.totalSupply();

        //     //查义范围
        //     let start = totalSupply.toNumber() - 1 -parseInt(issue_count);
        //     let end = totalSupply.toNumber() - 1;

        //     console.log("查询范围：", start, end);

        //     //查看持有者拥有的所有tokenId
        //     let tokenId_arr = await newContractSub.tokensOfOwnerIn(PUBLIC_KEY, 0, 6500);

        //     //验证持有者拥有的所有tokenId大于0
        //     expect(tokenId_arr).to.not.be.undefined;
        //     expect(tokenId_arr).to.greaterThanOrEqual(0);
        //     console.log("地址持有的tokenId =", tokenId_arr.length, tokenId_arr);
                   
        // }); 

        it("2. tokensOfOwner - 持有者拥有的token数量比较多时", async function() {
            //发行数量
            let issue_count = 1;
            let gas_price = 1;

            //生成新的NFT1013合约对象
            let newNFT1013Addr = await call_deployContract(contract_factory_rw);

             //NFT1013合约对象
            let newNFT1013 = new ethers.Contract(newNFT1013Addr, ABI_NFT1013, PROVIDER);
            let newNFT1013_rw = new ethers.Contract(newNFT1013Addr, ABI_NFT1013, WALLET_SIGNER);

            //发行指定数量的token
            await call_mint_or_safeMint(newNFT1013, newNFT1013_rw, gas_price, PUBLIC_KEY, issue_count, false);

            //查看持有者拥有的所有tokenId
            let tokenId_arr = await newContractSub.tokensOfOwner(PUBLIC_KEY);

            //验证合约地址余额是否大于等于0
            expect(tokenId_arr).to.not.be.undefined;
            expect(tokenId_arr).to.greaterThanOrEqual(0);
            console.log("地址持有的tokenId =", tokenId_arr.length, tokenId_arr);
                   
        }); 
    });
 
});


