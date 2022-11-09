import('./config.js');
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");


//工厂合约 - 创建新的NFT1013合约
async function call_deployContract(contract_factory_rw, contractMark) {
    let newContractSubAddr;

    if (RUN_CONFIG.isCreateContract1013) { 
        let contractAddrSub = await contract_factory_rw.getContractsDeployed(); 
        console.log("生成前，NFT1013合约总数量 = ", contractAddrSub.length);


        let tx = await contract_factory_rw.deployContract(contractMark, { gasPrice: "1", gasLimit: "300000" });

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
        console.log("生成后，NFT1013合约总数量 = ", contractAddrSub.length);

        console.log("生成的NFT1013合约地址 =", newContractSubAddr);
    } 

    return newContractSubAddr;
}


//获取NFT1013合约地址， 是最新的还是指定的
async function getContractAddressForNFT1013() {
    if (RUN_CONFIG.isCreateContract1013) {
        //创建工厂合约对象，查看签发者生成的NFT1013合约
        let contract_factory_rw = new ethers.Contract(CONTRACT_ADDRESS, ABI_FACTORY, WALLET_SIGNER); 
        let contractAddrSub = await contract_factory_rw.getContractsDeployed();  

        //返回结果要大于0
        expect(contractAddrSub.length).to.greaterThan(0);

        //签发者最新的1013合约地址
        newContractSubAddr = contractAddrSub[contractAddrSub.length - 1];
        console.log("newContractSubAddr =", newContractSubAddr);
    } else {
        newContractSubAddr = RUN_CONFIG.contractSubAddr;
    }

    return newContractSubAddr;
}

/*
调用mint或safeMint函数
参数说明：
@param newContractSub object NFT1013合约对象
@param newContractSub_rw object NFT1013合约对象
@param gas_price
@param address 用户地址或合约地址
@param issue_count 发行数量
@param isSafeMint 是否要调用safeMint，false 则调用mint
*/
async function call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, address, issue_count, isSafeMint) {
    if (RUN_CONFIG.isIssueToken) {
        console.log("mint参数_to, quantity分别 = ", address, issue_count);
        //获取签发者当前余额
        let balance_current_signer = await newContractSub.balanceOf(address);   
        console.log("发行token前，账户 "+ address +" 持有token总数量 =", balance_current_signer.toNumber());

        //获取总发行量
        let totalSupply_before = await newContractSub.totalSupply();   
        console.log("发行token前，总发行量=", totalSupply_before.toNumber());

        //调用合约，发起交易
        let tx;

        if (isSafeMint) {
            tx = await newContractSub_rw.safeMint(address, issue_count, { gasPrice: gas_price, gasLimit: "400000000" });
        } else {
            tx = await newContractSub_rw.mint(address, issue_count, { gasPrice: gas_price, gasLimit: "400000000" });
        }

          //  console.log(tx);
        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });
        
        //查看签发者余额
        let balance = await newContractSub.balanceOf(address);
        let balance_new_signer = parseInt(balance_current_signer) + parseInt(issue_count);
        console.log("发行token后，账户 "+ address +" 持有token总数量 = ", balance_new_signer);

        //1、验证签发者余额是否累加
        expect(balance).to.equal(balance_new_signer);

        //查看总发行量
        let totalSupply_after = await newContractSub.totalSupply();
        let totalSupply_new = totalSupply_before.toNumber() + parseInt(issue_count);
        console.log("发行token后，总发行量=",totalSupply_after, totalSupply_new);

        //2、验证总发行量是否累加
        expect(totalSupply_after.toNumber()).to.equal(totalSupply_new);

        // //3、验证发行数量范围内的token持有者, 因有销毁，所以不能以此条件作为验证
        // // 发行的第1个token持有者
        // let owner = await newContractSub.ownerOf(totalSupply_after.toNumber() - issue_count);
        // console.log("本次发行第一个token ( " + (totalSupply_after.toNumber() - issue_count) + " ) 的持有者 = ", owner);
        // expect(owner).to.equal(address);

        // // 发行的第1个token持有者
        // owner = await newContractSub.ownerOf(totalSupply_after.toNumber() - 1);
        // console.log("本次发行最后一个token ( " + (totalSupply_after.toNumber() - 1) + " ) 的持有者 = ", owner);
        // expect(owner).to.equal(address);
    }
}

//设置NFTT名称
async function call_setName(newContractSub, newContractSub_rw, gas_price, name) {

    if (RUN_CONFIG.isSetName) {
        //获取NFT名称
        let name_current = await newContractSub.name();   
        console.log("重置NFT名称前，name=", name_current);

        //调用合约，发起交易
        let tx = await newContractSub_rw.setName(name, { gasPrice: gas_price, gasLimit: "100000000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });
        
        //查看重置后NFT名称
        let name_new = await newContractSub.name();
        console.log("重置NFT名称后，name=", name_new);

        //1、验证重置后NFT名称与参数NFT名称是否相等
        expect(name_new).to.be.equal(name);
    }
}

//设置NFT符号
async function call_setSymbol(newContractSub, newContractSub_rw, gas_price, symbol) {

    if (RUN_CONFIG.isSetSymbol) {
        //获取NFT符号
        let symbol_current = await newContractSub.symbol();   
        console.log("重置NFT符号前，symbol=", symbol_current);

        //调用合约，发起交易
        let tx = await newContractSub_rw.setSymbol(symbol, { gasPrice: gas_price, gasLimit: "300000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });
        
        //查看重置后结果
        let symbol_new = await newContractSub.symbol();
        console.log("重置NFT符号后，symbol=", symbol_new);

        //1、验证重置后NFT符号与参数NFT符号是否相等
        expect(symbol_new).to.be.equal(symbol);
    }
}

//设置BaseURI
async function call_setBaseURI(newContractSub, newContractSub_rw, gas_price, baseURI) {

    if (RUN_CONFIG.isSetBaseURI) {
        //调用合约，发起交易
        let tx = await newContractSub_rw.setBaseURI(baseURI, { gasPrice: gas_price, gasLimit: "300000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });
        
        //查看tokenId为0的URI结果
        let tokenURI_0 = await newContractSub.tokenURI(0);
        console.log("tokenURI(0)=", tokenURI_0);

        //1、验证URI是否包含设置的baseURI
        expect(tokenURI_0).to.include(baseURI);
    }
}

//转移token
async function call_transferFrom(newContractSub, newContractSub_rw, gas_price, from, to, tokenId) {

    if (RUN_CONFIG.isTransferFrom) {
        console.log("transferFrom参数from, to, tokenId分别 = ", from, to, tokenId);
        //获取from当前token总数
        let from_before = await newContractSub.balanceOf(from);   
        console.log("token转移前，账户 "+ from +" 持有token总数=", from_before);

        //获取to当前oken总数
        let to_before = await newContractSub.balanceOf(to);   
        console.log("token转移前，账户 "+ to +" 持有token总数=", to_before);

        //获取token持有者
        let token_owner_before = await newContractSub.ownerOf(tokenId);
        console.log("token转移前，token持有者=", token_owner_before);

        //调用合约，发起交易
        let tx = await newContractSub_rw.transferFrom(from, to, tokenId, { gasPrice: gas_price, gasLimit: "40000000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });
        
        //查看from持有token总数， 自己转给自己的，与转前数量一致
        let from_new = await newContractSub.balanceOf(from);   
        console.log("token转移后，账户 "+ from +" 持有token总数=", from_new);
        let from_count = (from == to) ? from_before : (parseInt(from_before) - parseInt(1));

        //查看to持有token总数， 自己转给自己的，与转前数量一致
        let to_new = await newContractSub.balanceOf(to);   
        console.log("token转移后，账户 "+ to +" 持有token总数=", to_new);
        let to_count = (from == to) ? to_before : (parseInt(to_before) + parseInt(1));
     
        //查看token持有者
        let token_owner_new = await newContractSub.ownerOf(tokenId);
        console.log("token转移后，token持有者=", token_owner_new);

        //1、验证from总量是否减一
        expect(from_new).to.equal(from_count);   

        //2、验证to总量是否加一
        expect(to_new).to.equal(to_count);

        //3、验证token持有者是否为to
        expect(token_owner_new).to.equal(to);
    }
}

//租借token
async function call_setUser(newContractSub, newContractSub_rw, gas_price, from, tokenId, to, expires) {

    if (RUN_CONFIG.isSetUser) {
        console.log("setUser参数tokenId, to, expires分别 = ", tokenId, to, expires);
        //获取from当前token总数
        let from_before = await newContractSub.balanceOf(from);   
        console.log("租借前，from 账户 "+ from +" 持有token总数=", from_before);

        //获取to当前oken总数
        let to_before = await newContractSub.balanceOf(to);   
        console.log("租借前，to 账户"+ to +" 持有token总数=", to_before);

        //获取token持有者
        let token_owner_before = await newContractSub.ownerOf(tokenId);
        console.log("租借前，tokenId( " + tokenId + " ) 持有者=", token_owner_before);

        //获取token当前租借给谁了
        let token_userOf_before = await newContractSub.userOf(tokenId);
        console.log("租借前，tokenId( " + tokenId + " ) 租借者=", token_userOf_before);

        //调用合约，发起交易
        let tx = await newContractSub_rw.setUser(tokenId, to, expires, { gasPrice: 1, gasLimit: "40000000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
            //消耗写入文件
            var fs  = require("fs");
            fs.appendFile("test3.txt", txResult.cumulativeGasUsed + "    " + txResult.effectiveGasPrice,{flag:"w"},function(err){
                if(!err){
                    console.log("写入成功！");
                } else {
                    console.log("写入失败");
                }
            });
        });
        
        //查看from持有token总数
        let from_after = await newContractSub.balanceOf(from);   
        console.log("租借后，账户 "+ from +" 持有token总数=", from_after);

        //查看to持有token总数
        let to_after = await newContractSub.balanceOf(to);   
        console.log("租借后，账户 "+ to +" 持有token总数=", to_after);

        //查看token持有者
        let token_owner_after = await newContractSub.ownerOf(tokenId);
        console.log("租借后，tokenId( " + tokenId + " ) 持有者=", token_owner_after);

        //查看token租借者
        let token_userOf_after = await newContractSub.userOf(tokenId);
        console.log("租借后，tokenId( " + tokenId + " ) 租借者=", token_userOf_after);

        //查看token租借时间
        let token_userOf_expires = await newContractSub.userExpires(tokenId);
        console.log("租借后，tokenId( " + tokenId + " ) 租借时间=", token_userOf_expires);


        //1、验证from总量是否不变
        expect(from_after).to.equal(from_before);   

        //2、验证to总量是否不变
        expect(to_before).to.equal(to_after);

        //3、验证token持有者是否为from
        expect(token_owner_after).to.equal(token_owner_before);

        //4、验证token租借者是否为to
        expect(token_userOf_after).to.equal(to);

        //5、验证租借时间是否与参数的租借时间相同
        expect(token_userOf_expires.toNumber()).to.equal(expires);
    }
}

//授权token
async function call_approve(newContractSub, newContractSub_rw, gas_price, from,  to, tokenId) {

    if (RUN_CONFIG.isApprove) {
        console.log("approve参数 to, tokenId 分别 = ", to, tokenId);
        //获取from当前token总数
        let from_before = await newContractSub.balanceOf(from);   
        console.log("授权前，from 账户 "+ from +" 持有token总数=", from_before);

        //获取to当前oken总数
        let to_before = await newContractSub.balanceOf(to);   
        console.log("授权前，to 账户"+ to +" 持有token总数=", to_before);

        //获取token持有者
        let token_owner_before = await newContractSub.ownerOf(tokenId);
        console.log("授权前，tokenId( " + tokenId + " ) 持有者=", token_owner_before);

        //获取token被授权者
        let token_approve_before = await newContractSub.getApproved(tokenId);
        console.log("授权前，tokenId( " + tokenId + " ) 被授权者=", token_approve_before);

        //调用合约，发起交易
        let tx = await newContractSub_rw.approve(to, tokenId, { gasPrice: gas_price, gasLimit: "40000000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
            //消耗写入文件
            var fs  = require("fs");
            fs.appendFile("test3.txt", tokenId + "    " + txResult.cumulativeGasUsed + "\n",{flag:"a"},function(err){
                if(!err){
                    console.log("写入成功！");
                } else {
                    console.log("写入失败");
                }
            });
        });
        
        //查看from持有token总数
        let from_after = await newContractSub.balanceOf(from);   
        console.log("授权后，账户 "+ from +" 持有token总数=", from_after);

        //查看to持有token总数
        let to_after = await newContractSub.balanceOf(to);   
        console.log("授权后，账户 "+ to +" 持有token总数=", to_after);

        //查看token持有者
        let token_owner_after = await newContractSub.ownerOf(tokenId);
        console.log("授权后，tokenId( " + tokenId + " ) 持有者=", token_owner_after);

        //查看token授权者
        let token_approve_after = await newContractSub.getApproved(tokenId);
        console.log("授权后，tokenId( " + tokenId + " ) 授权者=", token_approve_after);


        //1、验证from总量是否不变
        expect(from_after).to.equal(from_before);   

        //2、验证to总量是否不变
        expect(to_before).to.equal(to_after);

        //3、验证token持有者是否为from
        expect(token_owner_after).to.equal(token_owner_before);

        //4、验证token被授权者是否为to
        expect(token_approve_after).to.equal(to);

    }
}

//销毁token
async function call_burn(newContractSub, newContractSub_rw, gas_price, tokenId) {

    if (RUN_CONFIG.isBurn) {
        console.log("burn参数 tokenId = ", tokenId);

        //获取总发行量
        let totalSupply_before = await newContractSub.totalSupply();   
        console.log("销毁前，总发行量=", totalSupply_before);

        //获取销毁数量
        // let burned_before = await newContractSub.burned();
        // console.log("销毁前，销毁数量 =", burned_before);

        //获取token持有者
        let token_owner_before = await newContractSub.ownerOf(tokenId);
        console.log("销毁前，tokenId( " + tokenId + " ) 持有者=", token_owner_before);

        //获取token持有者数量
        let token_owner_count_before = await newContractSub.balanceOf(token_owner_before.toString());
        console.log("销毁前，tokenId( " + tokenId + " ) 持有者( " + token_owner_before + " ) 总数量 =", token_owner_count_before);

        //获取token被授权者
        let token_approve_before = await newContractSub.getApproved(tokenId);
        console.log("销毁前，tokenId( " + tokenId + " ) 被授权者=", token_approve_before);

        //获取token当前租借给谁了
        let token_userOf_before = await newContractSub.userOf(tokenId);
        console.log("销毁前，tokenId( " + tokenId + " ) 租借者=", token_userOf_before);

        //调用合约，发起交易
        let tx = await newContractSub_rw.burn(tokenId, { gasPrice: gas_price, gasLimit: "40000000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
            //消耗写入文件
            var fs  = require("fs");
            fs.appendFile("test3.txt", tokenId + "    " + txResult.cumulativeGasUsed + "\n",{flag:"a"},function(err){
                if(!err){
                    console.log("写入成功！");
                } else {
                    console.log("写入失败");
                }
            });
        });
        
        //获取总发行量
        let totalSupply_after = await newContractSub.totalSupply();   
        console.log("销毁后，总发行量=", totalSupply_after);


        //1、验证发行总量减一
        expect(totalSupply_after.toNumber() ).to.equal(totalSupply_before.toNumber() - 1);   

        
        //获取销毁数量
        // let burned_after = await newContractSub.burned();
        // console.log("销毁后，销毁数量 =", burned_after);

        // //2、验证销毁数量加一
        // expect(burned_after.toNumber()).to.be.equal(burned_before.toNumber() + 1);
        
        //获取token持有者数量
        let token_owner_count_after = await newContractSub.balanceOf(token_owner_before.toString());
        console.log("销毁后，tokenId持有者( " + token_owner_before + " ) 总数量 =", token_owner_count_after);

        //3、验证销毁前token持有者数量减一
        expect(token_owner_count_after.toNumber()).to.be.equal(token_owner_count_before.toNumber() - 1);

        //4、验证token持有者
        try {
            //查看token持有者
            let token_owner_after = await newContractSub.ownerOf(tokenId);
            console.log("销毁后，tokenId( " + tokenId + " ) 持有者=", token_owner_after);
        } catch (error) {
            console.log("错误信息：", error.message)
            expect(error.message).to.not.be.empty;
        }
        
        //5、验证token授权者
        try {
            //查看token授权者
            let token_approve_after = await newContractSub.getApproved(tokenId);
            console.log("销毁后，tokenId( " + tokenId + " ) 授权者=", token_approve_after);
        } catch (error) {
            console.log("错误信息：", error.message)
            expect(error.message).to.not.be.empty;
        }

        //6、验证租借者
        let token_userOf_after = await newContractSub.userOf(tokenId);
        console.log("销毁后，tokenId( " + tokenId + " ) 租借者=", token_userOf_after);

    }
}

//批量转移token
async function call_transferOwnership(newContractSub, newContractSub_rw, gas_price, from, to) {

    if (RUN_CONFIG.isTransferOwnership) {
        console.log("transferOwnership参数newOwner = ", to);

        //获取总发行量
        let totalSupply_before = await newContractSub.totalSupply();   
        console.log("批量转移前，总发行量 = ", totalSupply_before.toNumber());

        //获取from当前token总数
        let from_before = await newContractSub.balanceOf(from);   
        console.log("批量转移前，账户 "+ from +" 持有token总数 = ", from_before.toNumber());

        //获取to当前oken总数
        let to_before = await newContractSub.balanceOf(to);   
        console.log("批量转移前，账户 "+ to +" 持有token总数 = ", to_before.toNumber());

        //调用合约，发起交易
        let tx = await newContractSub_rw.transferOwnership(to, { gasPrice: gas_price, gasLimit: "40000000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });

        
        //获取总发行量
        let totalSupply_after = await newContractSub.totalSupply();   
        console.log("批量转移后，总发行量 = ", totalSupply_after.toNumber());
        
        //查看from持有token总数， 自己转给自己的，与转前数量一致
        let from_new = await newContractSub.balanceOf(from);   
        console.log("批量转移后，账户 "+ from +" 持有token总数=", from_new.toNumber());
        let from_count = (from == to) ? from_before : 0;

        //查看to持有token总数， 自己转给自己的，与转前数量一致
        let to_new = await newContractSub.balanceOf(to);   
        console.log("批量转移后，账户 "+ to +" 持有token总数=", to_new.toNumber());
        let to_count = (from == to) ? to_before : (parseInt(from_before) + parseInt(to_before));

        //1、验证总量不变
        expect(totalSupply_before).to.be.equal(totalSupply_after);

        //2、验证from总量是否减
        expect(from_new.toNumber()).to.equal(from_count);   

        //3、验证to总量是否加
        expect(to_new.toNumber()).to.equal(to_count);

    }
}


//批量授权token
async function call_setApprovalForAll(newContractSub, newContractSub_rw, gas_price, from, to, approved) {

    if (RUN_CONFIG.isSetApprovalForAll) {
        console.log("setApprovalForAll参数operator, approved 分别 = ", to, approved);

        //获取总发行量
        let totalSupply_before = await newContractSub.totalSupply();   
        console.log("批量授权前，总发行量 = ", totalSupply_before.toNumber());

        //获取from当前token总数
        let from_before = await newContractSub.balanceOf(from);   
        console.log("批量授权前，账户 "+ from +" 持有token总数 = ", from_before.toNumber());

        //获取to当前oken总数
        let to_before = await newContractSub.balanceOf(to);   
        console.log("批量授权前，账户 "+ to +" 持有token总数 = ", to_before.toNumber());

        //调用合约，发起交易
        let tx = await newContractSub_rw.setApprovalForAll(to, approved, { gasPrice: gas_price, gasLimit: "40000000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });

        
        //获取总发行量
        let totalSupply_after = await newContractSub.totalSupply();   
        console.log("批量授权后，总发行量 = ", totalSupply_after.toNumber());
        
        //查看from持有token总数
        let from_new = await newContractSub.balanceOf(from);   
        console.log("批量授权后，账户 "+ from +" 持有token总数=", from_new.toNumber());

        //查看to持有token总数
        let to_new = await newContractSub.balanceOf(to);   
        console.log("批量授权后，账户 "+ to +" 持有token总数=", to_new.toNumber());

        //查看授权状态
        let approved_after = await newContractSub.isApprovedForAll(from, to);

        //1、验证总量不变
        expect(totalSupply_before).to.be.equal(totalSupply_after);

        //2、验证from总量是否减
        expect(from_new).to.equal(from_before);   

        //3、验证to总量是否加
        expect(to_new).to.equal(to_before);

        //4、验证授权后的状态
        expect(approved_after).to.be.equal(approved);


    }
}

async function get_totalSupply() {
    let totalSupply = await newContractSub.totalSupply();
    expect(totalSupply).to.greaterThanOrEqual(0);

    return totalSupply.toNumber();
}

//获取合约Owner是否持有token中的一个，若没有则为合约Owner mint 一个tokenId
async function getOrCreateTokenIdFromAddr(newContractSub, newContractSub_rw, gas_price, address) {
    // //获取发行总量
    // let totalSupply = await get_totalSupply();   

    // if (totalSupply == 0) { //

    // }

    // let tokenId_arr = await newContractSub.tokensOfOwnerIn(address, 1, 20);

    // //验证
    // expect(tokenId_arr).to.not.be.undefined;

    // console.log("地址持有的tokenId =", tokenId_arr.length, tokenId_arr);

    let issue_count = 1;

    await call_mint_or_safeMint(newContractSub, newContractSub_rw, gas_price, address, issue_count, false);

    let token = await newContractSub.totalSupply();
    expect(token).to.be.not.undefined;

    let tokenId = token.toNumber() - 1;
    expect(tokenId).to.greaterThanOrEqual(0);

    return tokenId;
}

//根据发行数量，返回指定索引的一个tokenId
//@param issue_count 一次发行数量
//@param index 发行数量的第几个
async function getTokenIdForIndx(newContractSub, issue_count, index) {
    let totalSupply = await newContractSub.totalSupply();
    expect(totalSupply).to.be.not.undefined;

    let tokenId = totalSupply.toNumber() - 1 - issue_count + index;
    expect(tokenId).to.greaterThanOrEqual(0);
    expect(tokenId).to.lessThanOrEqual(totalSupply.toNumber() - 1);

    return tokenId;
}

//测试用户地址互转
async function transfer() {
    
    let provider = new ethers.providers.JsonRpcProvider(process.env.API_URL); 
    let wallet_signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    let tx = {
        to: process.env.PUBLIC_KEY_IS_NOT_SIGNER,
        value: 10,
        chainId: 12231,
        nonce: 322
      }

        console.log(tx);
        
      provider.estimateGas(tx).then(function(estimate) {
        tx.gasLimit = estimate;
        tx.gasLimit = 300000;
        tx.gasPrice = ethers.utils.parseUnits("1", "gwei");


        wallet_signer.signTransaction(tx).then((signedTX)=>{
            provider.sendTransaction(signedTX).then(console.log);
        });
    });

}

//获取当前时间位移时间戳
//@param expiresMinute 过期分钟（单位：分钟）
function getTimestampForNow(expiresMinute) {
    //当前时间
    let now = new Date();
    //过期时间
    return parseInt((now.setMinutes(now.getMinutes() + parseInt(expiresMinute))) / 1000);
}


//参数n为休眠时间，单位为毫秒:
async function sleep(n) {
    var start = new Date().getTime();
    //  console.log('休眠前：' + start);
    while (true) {
        if (new Date().getTime() - start > n) {
            break;
        }
    }
    // console.log('休眠后：' + new Date().getTime());
}

module.exports = {
    getContractAddressForNFT1013,
    call_deployContract,
    call_mint_or_safeMint,
    call_setName,
    call_setSymbol,
    call_setBaseURI,
    call_transferFrom,
    call_setUser,
    getOrCreateTokenIdFromAddr,
    getTokenIdForIndx,
    getTimestampForNow,
    call_approve,
    call_burn,
    call_transferOwnership,
    call_setApprovalForAll,
    sleep
}