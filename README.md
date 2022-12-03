# ISOTOP Plan-Bee repo
## 《THE BEE BOOK》 

本目录存储ISOTOP发布的智能合约接口，设计理念，和使用场景  
1. ISOTOP1010: 低GAS费ERC721合约  
2. ISOTOP1011: 可销毁  
3. ISOTOP1012: 可租借 
4. ISOTOP1013: 可租借可销毁  
5. ISOTOP1014: 跨链资产转移合约  
6. ISOTOP1015: 单一图像徽章NFT合约，兼容ISOTOP1010  
7. ISOTOP1020：ERC3525半同质化通证合约  
8. ISOTOP1021：WEB3会员卡（URL版本）  
9. ISOTOP1022：WEB3会员卡（SVG 动态NFT版本）  
10. ISOTOP1030: 预言机调用合约，使用chainlink 预言机，无需LINK，直接使用TGAS费用
11. ISOTOP1040: SoulBondToken 灵魂绑定合约  

工具合约：  
1. Deployer : 合约部署器  
2. DDS :  一个通用的域名数据库存储系统  
3. TGas : GAS费用的充账及分配系统  
4. Factory : 合约工厂，可以通过deployContract输入合约名称生产需要的合约, 合约名称见上面列表  
5. DateTime : 一个时间和日期转换工具合约  


## 合约部署地址：

***
1. Deployer : 0x18C353Ca538702f862526Cd2DEeabA35f0ED3BEE  
2. DDS : 0x222d6d17f1f6967b81E40624fe6176b7be225BEE  
3. VRF: 0xe7582ab98aFB2DC7f84d5334fBebD18824C83bEE  
4. Factory: 0xecbf7436904B8De23f69dA6962f29352Cc9f8bEE 
其中，Factory已经注册ISOTOP1010-1015,1021,1022 合约  

数图链core，因为与etherum不兼容，只能单独部署一套地址：
1. DDS：cfx:acez9hfj5bds2sycn72k32gbrtwmp5x5mutujg1htg 
2. Factory：cfx:acgs1aj8cj6ah5ckzfdwus5dg880hzhvu643eum0cm   
其中，Factory已经注册ISOTOP1010-1013,1021,1022 合约  

***
## 部署链：
1. 测试链：文昌链Testnet，Arbitrum  
2. 正式链：文昌链，数图链eSpace，草田链 
***

## 使用方式

DDS是一个全局的注册表，允许任何机构注册自己的域名和数据。同位素的域名为ISOTOP，登记有同位素的工具合约地址，获取方式为：  

获取注册的Factory合约地址   
` ` `
dds.toAddress(dds.get('ISOTOP', 'BEE_FACTORY_ADDRESS'))   
` ` `

获取注册的DateTime合约地址  
` ` `
dds.toAddress(dds.get('ISOTOP', 'BEE_DATETIME_ADDRESS'))  
` ` `

获取注册的TGas合约地址  
` ` `
dds.toAddress(dds.get('ISOTOP', 'BEE_TGAS_ADDRESS'))  
` ` `

Factory 管理同位素的ERC721扩展合约，ERC3525扩展合约等，申请的方式为：  
部署一个ISOTOP1010模板合约   
` ` `
Factory.deployContract('ISOTO1010')   
` ` `

部署一个ISOTOP1011模板合约  
` ` `
Factory.deployContract('ISOTO1011')  
` ` `

部署一个ISOTOP1012模板合约  
` ` `
Factory.deployContract('ISOTO1012')  
` ` `

部署一个ISOTOP1013模板合约  
` ` `
Factory.deployContract('ISOTO1013')  
` ` `

部署一个ISOTOP1014模板合约  
` ` `
Factory.deployContract('ISOTO1014')  
` ` `

部署一个ISOTOP1015模板合约  
` ` `
Factory.deployContract('ISOTO1015')  
` ` `

部署一个ISOTOP1022模板合约  
` ` `
Factory.deployContract('ISOTO1022')  
` ` `

部署一个ISOTOP1021模板合约  
` ` `
Factory.deployContract('ISOTO1021')  
` ` `


last updated: 2022.12.02