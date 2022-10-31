import('./config.js');
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");


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
        //获取签发者当前余额
        let balance_current_signer = await newContractSub.balanceOf(address);   
        console.log("发行token前，账户"+ address +"余额=", balance_current_signer);

        //获取总发行量
        let totalSupply_current = await newContractSub.totalSupply();   
        console.log("发行token前，总发行量=", totalSupply_current);

        //调用合约，发起交易
        let tx;

        if (isSafeMint) {
            tx = await newContractSub_rw.safeMint(address, issue_count, { gasPrice: gas_price, gasLimit: "30000000000" });
        } else {
            tx = await newContractSub_rw.mint(address, issue_count, { gasPrice: gas_price, gasLimit: "30000000000" });
        }

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });
        
        //查看签发者余额
        let balance = await newContractSub.balanceOf(address);
        let balance_new_signer = parseInt(balance_current_signer) + parseInt(issue_count);
        console.log("发行token后，账户"+ address +"余额=", balance_new_signer);

        //1、验证签发者余额是否累加
        expect(balance).to.equal(balance_new_signer);

        //查看总发行量
        let totalSupply = await newContractSub.totalSupply();
        let totalSupply_new = parseInt(totalSupply_current) + parseInt(issue_count);
        console.log("发行token后，总发行量=", totalSupply_new);

        //2、验证总发行量是否累加
        expect(totalSupply).to.equal(totalSupply_new);
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
        //获取from当前token总数
        let from_before = await newContractSub.balanceOf(from);   
        console.log("token转移前，账户"+ from +" 持有token总数=", from_before);

        //获取to当前oken总数
        let to_before = await newContractSub.balanceOf(to);   
        console.log("token转移前，账户"+ to +" 持有token总数=", to_before);

        //获取token持有者
        let token_owner_before = await newContractSub.ownerOf(tokenId);
        console.log("token转移前，token持有者=", token_owner_before);

        //调用合约，发起交易
        let tx = await newContractSub_rw.transferFrom(from, to, tokenId, { gasPrice: gas_price, gasLimit: "1000000000" });

        //等待交易确认
        await tx.wait().then((txResult) => {
            console.log("(gasUsed, gasPrice) = ", txResult.cumulativeGasUsed, txResult.effectiveGasPrice)
        });
        
        //查看from持有token总数， 自己转给自己的，与转前数量一致
        let from_new = await newContractSub.balanceOf(from);   
        console.log("token转移后，账户"+ from +" 持有token总数=", from_new);
        let from_count = (from == to) ? from_before : (parseInt(from_before) - parseInt(1));

        //查看from持有token总数， 自己转给自己的，与转前数量一致
        let to_new = await newContractSub.balanceOf(to);   
        console.log("token转移后，账户"+ to +" 持有token总数=", to_new);
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

module.exports = {
    getContractAddressForNFT1013,
    call_mint_or_safeMint,
    call_setName,
    call_setSymbol,
    call_setBaseURI,
    call_transferFrom,
    getOrCreateTokenIdFromAddr,
    getTokenIdForIndx
}