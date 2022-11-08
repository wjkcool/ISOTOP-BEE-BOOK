const { ethers } = require("hardhat");

async function listenEvent() {
    
    //连接节点
    let provider = new ethers.providers.JsonRpcProvider(process.env.API_URL); 
    //创建钱包对象
    let wallet_signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    //创建工厂合约对象
    let contract_factory_rw = new ethers.Contract(process.env.CONTRACT_ADDRESS, process.env.ABI_FACTORY, wallet_signer); 

    //事件1.1 - 工厂合约 - 创建NFT1013合约
    contract_factory_rw.on("ContractDeployed", (deployAddress, ownerAddress, event) => {
        console.log("event ContractDeployed==", new Date(), deployAddress, ownerAddress, event.blockNumber);
    });

    //创建NFT1013合约对象 - 只包含事件
    let contract_nft1013_rw = new ethers.Contract(process.env.NFT1013_CONTRACT_ADDR, process.env.ABI_NFT1013_EVENT, wallet_signer); 

    //事件2.1 - NFT1013合约 - 转移token
    contract_nft1013_rw.on("Transfer", (from, to, tokenId, event) => {
        console.log("event transferFrom ==", new Date(), from, to, tokenId, event.blockNumber);
    });

    //事件2.2 - NFT1013合约 - 租借token
    contract_nft1013_rw.on("UpdateUser", (tokenId, user, expires, event) => {
        console.log("event setUser ==", new Date(), tokenId, user, expires, event.blockNumber);
    });

}
listenEvent();