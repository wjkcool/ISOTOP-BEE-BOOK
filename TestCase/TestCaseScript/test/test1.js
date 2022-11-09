import('./config.js');
const { ethers } = require("hardhat");
const { Transaction } = require("ethereumjs-tx");

describe("test data", function() {  
    
    //     it("test", async function() {     
    //        // console.log(ABI_NFT1013);
    //         let iface = new ethers.utils.Interface(ABI_NFT1013);
    
    //         //let iface = new Interface(ABI_NFT1013);
            
    //         let x = iface.encodeFunctionData("mint", [PUBLIC_KEY, 2]);
    
    //         console.log(x);

    //         const txCount = await PROVIDER.getTransactionCount(PUBLIC_KEY);

    //         console.log(txCount);

    //         const tx1 = new Transaction({
    //             nonce: ethers.utils.hexlify(txCount),
    //             from: PUBLIC_KEY,
    //             to: NFT1013_CONTRACT_ADDR,
    //             gasLimit: 300000,
    //             gasPrice: 1,
    //             data: x,
    //             chainId: 12231
    //         });

    //         console.log(tx1);

    //         // tx1.sign(Buffer.from(PRIVATE_KEY, "hex"));

    //         // let hash = await PROVIDER.sendTransaction("0x" + tx1.serialize().toString("hex"));

    //         //await PROVIDER.waitForTransaction(hash);
    //         // console.log(hash);

    //         await WALLET_SIGNER.sendTransaction(tx1).then((transaction) => {
    //             console.dir(transaction);
    //         });

    //     });
});