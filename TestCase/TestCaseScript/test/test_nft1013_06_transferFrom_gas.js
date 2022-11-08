import('./config.js');
const { getContractAddressForNFT1013, call_transferFrom, call_mint_or_safeMint, getTokenIdForIndx, sleep } = require('./test_common');
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

    // describe("获取链上信息", function() {
    //     it("获取链上信息", async function() {           
    //         gas_price = await PROVIDER.getGasPrice();          
    //         expect(gas_price).to.not.be.undefined;
    //     })
    // });

    describe("调用NFT1013合约 - transferFrom", function(){
        it("创建NTF1013合约对象", async function() {

            newContractSubAddr = getContractAddressForNFT1013();

            newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
            newContractSub_rw = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_SIGNER);
            newContractSub_rw_not_signer = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER);
            newContractSub_rw_not_signer_2 = new ethers.Contract(newContractSubAddr, ABI_NFT1013, WALLET_NOT_SIGNER_2);
           // console.log(newContractSub_rw);
        });

        
        describe("调用 transferFrom 函数 - 测试转账gas消耗", function() {  
            let issue_count = 1000;

            for (i = 0; i < 1; i++) {
               // console.log(i);
                it("1.1 签发者发token -> 大于0 且为签发者地址", async function() {

                   //await call_mint_or_safeMint(newContractSub, newContractSub_rw, 1, PUBLIC_KEY, issue_count, false);

                   console.log("start == ", new Date())

                   //获取总发行量
                    let totalSupply_before = await newContractSub.totalSupply();   
                    console.log("发行token前，总发行量=", totalSupply_before);
                    let tx = await newContractSub_rw.mint(PUBLIC_KEY, issue_count, { gasPrice: 1, gasLimit: "40000000" });
                   // console.log(tx);
                    //等待交易确认
                    await tx.wait().then((txResult) => {
                        console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
                    })

                    console.log("end == ", new Date())
                }); 

                sleep(1000);
            }

            // it("1.1 签发者发token -> 大于0 且为签发者地址", async function() {
            //     await call_mint_or_safeMint(newContractSub, newContractSub_rw, 1, PUBLIC_KEY, issue_count, false);
            // });  

            // it("测试转账gas消耗", async function() {       
            //     //发行数量
            //     issue_count = 1;

            //     call_mint_or_safeMint(newContractSub, newContractSub_rw, 1, PUBLIC_KEY, issue_count, false);



            //     //let tx = await newContractSub_rw.mint(PUBLIC_KEY, issue_count, { gasPrice: 1, gasLimit: "40000000" });


            //     // for (i = 0; i < 1; i++) {
              
            //     //     console.log("第" +i+ "次" );
            //     //     let tx = await newContractSub_rw.mint(PUBLIC_KEY, issue_count, { gasPrice: 1, gasLimit: "40000000" });

            //     //     //等待交易确认
            //     //     await tx.wait().then((txResult) => {
            //     //         console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
            //     //     });  
            //     //     // sleep(5000);

            
            //     // }
                       
            //     // try {

            //     //     for (i = 0; i < arr.length; i++) {
            //     //         let index = arr[i];
            //     //         tokenId = await getTokenIdForIndx(newContractSub, issue_count, index);

            //     //         console.log("第" + i + "次转账tokenId = ", tokenId);
                
            //     //         //A 转 B
            //     //        // await call_transferFrom(newContractSub, newContractSub_rw, gas_price, PUBLIC_KEY, PUBLIC_KEY_IS_NOT_SIGNER, tokenId);
            //     //         //B 转 A
            //     //         // await call_transferFrom(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, PUBLIC_KEY, tokenId);
            //     //         //B 转 C
            //     //         // await call_transferFrom(newContractSub, newContractSub_rw_not_signer, gas_price, PUBLIC_KEY_IS_NOT_SIGNER, PUBLIC_KEY_IS_NOT_SIGNER_2, tokenId);

            //     //     }
                    
            //     // } catch (error) {
            //     //     console.log("错误信息：", error.message)

            //     //     expect(error.message).to.not.be.empty;
            //     // }
            // }); 
                 
        });  

    });
 
});


