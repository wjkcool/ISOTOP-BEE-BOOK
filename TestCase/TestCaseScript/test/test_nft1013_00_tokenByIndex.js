import('./config.js');
const { getContractAddressForNFT1013} = require('./test_common');
const { expect } = require("chai");
const { ethers } = require("hardhat");


 describe('tokenByIndex', function () {

 //NFT1013合约
    // let newContractSubAddr;     //签发者最新签发的NFT1013合约地址
    // let newContractSub;         //签发者最新签发的NFT1013合约对象（消息）

    describe("调用NFT1013合约", function(){
    
    it("创建NTF1013合约对象", async function() {
        newContractSubAddr = getContractAddressForNFT1013();
        newContractSub = new ethers.Contract(newContractSubAddr, ABI_NFT1013, PROVIDER);
    });
    it('returns all tokens', async function () {
       
      tokenId = await getTokenIdForIndx(newContractSub, issue_count, 1);
              
      try {
      await  newContractSub.tokenByIndex(0)
      } catch (error) {
          expect(error.message).to.be.empty;
      }
    });

  }); 
});