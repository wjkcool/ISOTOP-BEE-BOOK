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


            it("获取tokenId所有者， ownerOf", async function() {   
                let i = 83203;
        // for (i = 14999; i < 15000; i++) {    
                console.log("token( " + i + " ) 持有者=");
                let addr = await newContractSub.ownerOf(i);

                //验证NFT名称已定义
                expect(addr).to.not.be.undefined;
                console.log("token( " + i + " ) 持有者=", addr);

                if (addr == undefined || addr == "") {
                    
                    var fs  = require("fs");

                    //发行指定数量
                    fs.writeFile("test3.txt",i + ", ",{flag:"w"},function(err){
                        if(!err){
                            console.log("写入成功！");
                        }
                    });
                }

           // sleep(1);
    //    }

            });  
            return;
        for (i = 11000; i < 11120; i++) {
            it("获取tokenId所有者， ownerOf", async function() {    
                let a = i;   
                console.log("token( " + a + " ) 持有者=");
                let addr = await newContractSub.ownerOf(a);

                //验证NFT名称已定义
                expect(addr).to.not.be.undefined;
                console.log("token( " + a + " ) 持有者=", addr);

                if (addr == undefined || addr == "") {
                    
                    var fs  = require("fs");

                    //发行指定数量
                    fs.writeFile("test3.txt",i + ", ",{flag:"w"},function(err){
                        if(!err){
                            console.log("写入成功！");
                        }
                    });
                }

            });  

            sleep(1000);
        }
            return;
                   
        it("获取tokenId所有者， ownerOf", async function() {       
            let addr = await newContractSub.ownerOf(11200);

            //验证NFT名称已定义
            expect(addr).to.not.be.undefined;
            console.log("token持有者=", addr);
        }); return;

        it("获取NFT名称 - name()", async function() {
            let name = await newContractSub.name();

            //验证NFT名称已定义
            expect(name).to.not.be.undefined;
            console.log("NFT名称=", name);
        });

        it("获取NFT符号 - symbol()", async function() {
            let symbol = await newContractSub.symbol();

            //验证NFT符号已定义
            expect(symbol).to.not.be.undefined;
            console.log("NFT符号=", symbol);
        });  
      
        it("获取总发行量 - totalSupply()", async function() {
            totalSupply = await newContractSub.totalSupply();

            //验证总发行量是否大于等于0
            expect(totalSupply).to.greaterThanOrEqual(0);
            console.log("总发行量=", totalSupply);

        });
      
        it("获取baseURI，通过tokenId=0的tokenURI查看baseURI - tokenURI(0)", async function() {
            if ( totalSupply > 0 ) {
                let tokenURI_0 = await newContractSub.tokenURI(0);
                console.log("NFT baseURI tokenURI(0)=", tokenURI_0);
            } else {
                console.log("总发行量为0，还不能获取到NFT的baseURI")
            }
        }); 

        it("获取签发者持有的NFT数量 - balanceOf(签发者地址)", async function() {
            let balance_signer = await newContractSub.balanceOf(PUBLIC_KEY);

            //验证签发者token数量是否大于等于0
            expect(balance_signer).to.greaterThanOrEqual(0);
            console.log("签发者 " + PUBLIC_KEY + " 持有的NFT数量=", balance_signer);
        });

        it("获取合约地址持有的NFT数量 - balanceOf(合约地址)", async function() {
            let balance_contract = await newContractSub.balanceOf(newContractSubAddr);

            //验证合约地址余额是否大于等于0
            expect(balance_contract).to.greaterThanOrEqual(0);
            console.log("合约地址NFT数量=", balance_contract);
        });

        it("获取合约地址余额", async function() {
            let balance_contract = await PROVIDER.getBalance(newContractSubAddr);

            //验证合约地址余额是否大于等于0
            expect(balance_contract).to.greaterThanOrEqual(0);
            console.log("合约地址余额=", balance_contract);
        });

        
        it("获取一定范围内地址持有的所有tokenId - tokensOfOwnerIn()", async function() {
            let tokenId_arr = await newContractSub.tokensOfOwnerIn(PUBLIC_KEY, 0, 6205);

            //验证合约地址余额是否大于等于0
            expect(tokenId_arr).to.not.be.undefined;
            console.log("地址持有的tokenId =", tokenId_arr.length, tokenId_arr);
        });

        
        it("获取某一地址持有的所有tokenId - tokensOfOwner()", async function() {
            let tokenId_arr = await newContractSub.tokensOfOwner(PUBLIC_KEY_IS_NOT_SIGNER_2);

            //验证合约地址余额是否大于等于0
            expect(tokenId_arr).to.not.be.undefined;
            console.log("地址持有的tokenId =", tokenId_arr.length, tokenId_arr);
        });

    });
 
});


