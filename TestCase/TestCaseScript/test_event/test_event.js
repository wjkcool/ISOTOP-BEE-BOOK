const { ethers } = require("hardhat");

async function listenEvent() {
    

    let provider = new ethers.providers.JsonRpcProvider(process.env.API_URL); 
    let wallet_signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    let contract_factory_rw = new ethers.Contract(process.env.CONTRACT_ADDRESS, process.env.ABI_FACTORY, wallet_signer); 

    //工厂合约 - 创建NFT1013合约
    contract_factory_rw.on("ContractDeployed", (deployAddress, ownerAddress, event) => {
        console.log("event ContractDeployed==", new Date(), deployAddress, ownerAddress, event.blockNumber);
    });

    let contract_nft1013_rw = new ethers.Contract(process.env.NFT1013_CONTRACT_ADDR, process.env.ABI_NFT1013_EVENT, wallet_signer); 

    //NFT1013合约 - 转移token
    contract_nft1013_rw.on("Transfer", (from, to, tokenId, event) => {
        console.log("event transferFrom ==", new Date(), from, to, tokenId, event.blockNumber);
    });

}
listenEvent();