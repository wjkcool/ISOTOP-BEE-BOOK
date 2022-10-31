import('./config.js');
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
 

describe("测试连接文昌测试链 - 工厂合约", function(){
    //return;

    //工厂合约
    let contract_factory_rw;
    
    //NFT1013合约
    let contractAddrSub;        //签发者的所有NFT1013合约地址
    let newContractSubAddr;     //签发者最新签发的NFT1013合约地址

    //gasPrice
    let gas_price;

    describe("获取链上信息", function() {
        it("获取链上信息", async function() {       
            gas_price = await PROVIDER.getGasPrice();
            expect(gas_price).to.not.be.undefined;
        });

        it("创建工厂合约对象", async function() {
            contract_factory_rw = new ethers.Contract(CONTRACT_ADDRESS, ABI_FACTORY, WALLET_SIGNER); 
        });

    });

    describe("调用 deployContract 函数 - Success", function(){

        it("1.1 创建1013合约 -> 参数 NFT1013", async function() {
            if (RUN_CONFIG.isCreateContract1013) { 
                let tx = await contract_factory_rw.deployContract("NFT1013", { gasPrice: "1", gasLimit: "300000" });

                //等待交易确认
                await tx.wait().then((txResult) => {
                    console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
                });

                //console.log(tx);
                expect(tx.hash).to.not.be.null;
                contractAddrSub = await contract_factory_rw.getContractsDeployed();  

                //返回结果要大于0
                expect(contractAddrSub.length).to.greaterThan(0);

                //签发者最新的1013合约地址
                newContractSubAddr = contractAddrSub[contractAddrSub.length - 1];
                console.log("新建1013合约地址 =", newContractSubAddr);
            } 
        });  

    });

    describe("调用 deployContract 函数 - Error", function(){
        
        it("2.1 创建1013合约-> 参数 NFT101333333", async function() {          
           try {    
                await contract_factory_rw.deployContract("");   
            } catch (error) {
                console.log("错误信息：", error.message);
                expect(error.message).to.not.be.empty;
            }
        });
        
        it("2.2 创建1013合约-> 参数 空字符串", async function() {            
            try {    
                 await contract_factory_rw.deployContract("");   
             } catch (error) {
                 console.log("错误信息：", error.message);
                 expect(error.message).to.not.be.empty;
             } 
        });
    }); 

});
