# ISOTOP Plan-Bee repo
## 《THE BEE BOOK》 

本目录存储ISOTOP发布的智能合约接口，设计理念，和使用场景  
1. ISOTOP1010: 低GAS费ERC721合约  
2. ISOTOP1011: 可销毁  
3. ISOTOP1012: 可租借 
4. ISOTOP1013: 可租借可销毁  
5. ISOTOP1014: 跨链资产转移合约  
6. ISOTOP1015: 单一图像徽章NFT合约，兼容ISOTOP1010  
7. ISOTOP1016: 动态NFT
8. ISOTOP1020：ERC3525半同质化通证合约  
9. ISOTOP1021：WEB3会员卡（URL版本）  
10. ISOTOP1022：WEB3会员卡（SVG 动态NFT版本）  
11. ISOTOP1030: 预言机调用合约，使用chainlink 预言机，无需LINK，直接使用TGAS费用
12. ISOTOP1040: SoulBondToken 灵魂绑定合约  

工具合约：  
1. Deployer : 合约部署器  
2. DDS :  一个通用的域名数据库存储系统  
3. TGas : GAS费用的充账及分配系统  
4. Factory : 合约工厂，可以通过deployContract输入合约名称生产需要的合约, 合约名称见上面列表  
5. DateTime : 一个时间和日期转换工具合约  


## 合约部署地址：

***
1. Deployer : 0x18C353Ca538702f862526Cd2DEeabA35f0ED3BEE  
2. DDS : 0xCFfFDE169Afbd51F081d2e82aCcA0f19cAdCbbeE  
3. Factory:  "BEE_FACTORY_ADDRESS"   
4. TGas: "BEE_TGAS_ADDRESS"   
其中，Factory已经注册ISOTOP1010-1016,1021,1022 合约  

数图链core地址：
1. DDS testnet: 0x89212dcE4dEaa27a25AAea1140a589D18aeBf362/cfxtest:adh991u0xn77mh2jdy1jfngmb6p6z1f572vrjhgev4    
2. DDS core: 待更新   
3. Factory："BEE_FACTORY_ADDRESS"   
4. TGas: "BEE_TGAS_ADDRESS"   
其中，Factory已经注册ISOTOP1010-1016,1021,1022 合约   
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

## WEB3会员卡接口说明：   
ISOTOP1021 & ISOTOP1022

```
            # 创建一个1022合约
            clone22 = ISOTOP1022.at(factory.getLastDeployed(addr(consumer)))

            # 初始化，名字，代号，baseURI，detailsURI，总积分数量，管理员是consumer
            clone22.init("Coffee-Cup-Card", "CCC", "base/",
                         "details", 10000, addr(consumer))

            # 在全局的DDS数据库里面定制token的名字。 第一个参数必须是初始化的name.symbol。第二个参数是TOKEN_NAME。 第三个参数是一个bytes类型，需要把字符串转化成bytes
            dds.put("Coffee-Cup-Card.CCC", 'TOKEN_NAME',
                    str_to_bytes('咖啡杯卡'), addr(consumer))

            # 在全局的DDS数据库里面定制token的图片。第一个和第二个参数同上。第三个参数是一个SVG文件的内容，读取后整个保存到DDS里面
            # Note：SVG文件的内容中包含有[TOKEN_BALANCE]这个字段，会被合约自动替换为当前的积分value数字
            with open('coffee500.svg') as f:
                dds.put("Coffee-Cup-Card.CCC", 'TOKEN_IMAGE',
                        str_to_bytes(f.read()), addr(consumer))

            # 同上设置积分的名称和图片
            dds.put("Coffee-Cup-Card.CCC", 'SLOT_NAME',
                    str_to_bytes('积分豆'), addr(consumer))
            with open('points.svg') as f:
                dds.put("Coffee-Cup-Card.CCC", 'SLOT_IMAGE',
                        str_to_bytes(f.read()), addr(consumer))

            # 给手机号为IWAN的用户铸造一个会员卡，初始积分100分
            clone22.mint(iwan, IWAN, 100, addr(consumer))

            # 给手机号为CAO的用户铸造一个会员卡，初始积分100份
            clone22.mint(creator, CAO, 100, addr(consumer))
```


## ConfluxWeb3 脚本说明：   
包装了Conflux的python SDK脚本，主要支持功能：  
1. 初始化。 支持test测试网和main主网core   
2. 创建账户，返回地址和私钥   
3. 根据私钥创建账户   
4. 根据同名ABI文件和地址加载合约   

更多conflux SDK请参考：https://python-conflux-sdk.readthedocs.io/zh_CN/latest/README.html

