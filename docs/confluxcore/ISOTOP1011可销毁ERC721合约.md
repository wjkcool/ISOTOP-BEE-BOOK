# IISOTOP1011合约极简教程

如果你要使用树图core链上的ISOTOP合约，首先需要下载一个fluent钱包：



![如图所示](https://upload.cc/i1/2022/12/10/WjhbIz.png)


另外写Dapp的前端，使用ISOTOP1011合约时，需要用到` js-conflux-sdk`。


## 1. js-conflux-sdk简述

js-conflux-sdk软件开发工具包是一个完整的库，用于在 Node.js 和浏览器环境中与 Conflux 区块链进行交互。

文档地址：https://docs.confluxnetwork.org/js-conflux-sdk

安装方式：
```
$ npm install js-conflux-sdk
```
使用方法：
``` js
import { Conflux，format } from 'js-conflux-sdk';
```

## 2 . 获得工厂合约对象


1. 要使用ISOTOP1011合约，首先需要通过DDS系统获得**工厂合约地址**`FactoryContractAddr`
```js
    const conflux = new  Conflux({url:'https://test.confluxrpc.com',networkId:  1 });   
    const DDSAddr = 'cfxtest:acfkpsbbgwsuvw0mfw1d2uapus6pp1zkf6x7rfpjkg';
    let abi = [
                   "function get(string calldata _domain, string calldata _key) external view returns (bytes memory)",
                    // ......此处省略
                   "function toAddress(bytes memory b) external pure returns (address addr)"
                    ]
    const DDSContract = new  conflux.Contract({abi, address:  DDSAddr });
    const DDSBytes = await  DDSContract.get('ISOTOP', 'BEE_FACTORY_ADDRESS');
    const FactoryContractAddr = await  DDSContract.toAddress(DDSBytes);
```

2.  通过**工厂合约地址**获得**工厂合约对象**

    获得**工厂合约对象**`conflux.Contract({ abi, address:  FactoryContractAddr })`需要两个参数，**工厂合约地址**`FactoryContractAddr`,**工厂合约ABI**`ABI`,接着用**钱包**`account`发送交易即可部署子合约

 ```javascript
    abi = [" function deployContract(string) external returns (address)",
                          // ......此处省略
                          " function getContractsDeployed() external view returns (address[])"
                          ];
                           const PRIVATE_KEY = 'YOUR_PRIVATE_KEY' ; // sender private key
    const account = conflux.wallet.addPrivateKey(PRIVATE_KEY);
    const Factory = conflux.Contract({ abi, address:  FactoryContractAddr });
    const receipt = await  Factory.deployContract("ISOTOP1011").sendTransaction({ from:  account }).executed();
   
 ``` 
 其中`FactoryContractAddr`是工厂合约地址，`Factory`是生成的工厂合约对象
 
## 3.  查询子合约地址并获得`IISOTOP`对象
  然后查询子合约地址，使用`IISOTOP1011.getContractsDeployed()`方法获得`IISOTOP1011Addr`

  ```js
      let IISOTOP1011AddrArray = new Array();
      IISOTOP1011AddrArray = await  Factory.getContractsDeployed('ISOTOP1011');
      const IISOTOP1011Addr = format.address((IISOTOP1011AddrArray[IISOTOP1011AddrArray.length-1]）,1);  //这里需要将hex40地址格式转换成conflux的cip37地址格式
  ```
之后根据`IISOTOP1011Addr`，`IISOTOP1011ABI`获得**子合约对象**`IISOTOP`，就可以调用它的各种方法了
```js
    abi = ["function mint(address, uint256) external",
            //......此处省略
           "function balanceOf(address) external view returns (uint256)"
          ];
    const IISOTOP = new conflux.Contract({ abi, address:  IISOTOP1011Addr });
```
## 4.  铸造NFT

获得子合约地址之后，就可以调用IISOTOP1011合约下面的各种方法了，比如mint`IISOTOP.mint(address, uint) `
  ```js
      let  waiter = await  IISOTOP.mint(address,5).sendTransaction({ from:  account }).executed();  //铸造5个nft
  ```

## 5.  查询某地址拥有的NFT数量
查询address地址拥有的NFT数量使用` IISOTOP.balanceOf(address)`方法
  ```js
      const  balance = await  IISOTOP.balanceOf(address);
  ```
## 6. 转移NFT
转移NFT需要用到`IISOTOP.transferFrom(from,to,tokenID)`方法
  ```js
     let  waiter = await  IISOTOP.transferFrom(from,to,tokenID).sendTransaction({ from:  account }).executed();
  ```
  其中from，to是地址，tokenID是NFT编号
## 7. 查询某NFT ID对应的所有人
查询某NFT对应所有人使用` IISOTOP.ownerOf(tokenID)`方法
  ```js
     owneraddr = await  IISOTOP.ownerOf(tokenID);
  ```
## 8. 查询NFT ID对应的授权地址
查询NFT ID对应的授权地址` IISOTOP.getApproved(tokenID)`方法
  ```js
     approvedaddr = await  IISOTOP.getApproved(tokenID);
  ```
  ## 9. 授权NFT给对应的地址
授权NFT给对应的地址使用` IISOTOP.approved(address,tokenID)`方法
  ```js
    let  waiter = await  IISOTOP.approve(address,tokenID);
  ```
## 10. 设置NFT元数据
设置NFT元数据使用` IISOTOP.setBaseURI(baseURI)`方法
  ```js
    await  IISOTOP.setBaseURI(baseURI).sendTransaction({ from:  account }).executed();
  ```

 ## 11. 查询NFT合集详情
查询NFT详情使用`IISOTOP.Details()`方法
  ```js
    let details = await  IISOTOP.Details()；
  ```



   ## 12. 查询NFT元数据
查询NFT元数据使用`IISOTOP.tokenURI()`方法
  ```js
    let tokenURI = await  IISOTOP.tokenURI()；
  ```
   ## 13. 查询第index的NFT的tokenID
查询NFT元数据使用`IISOTOP.tokenByIndex(index)`方法
  ```js
    let tokenID = await  IISOTOP.tokenByIndex(index)；
  ```
  ## 14. 查询owner第index的NFT的tokenID
查询owner第index的NFT的tokenID使用`IISOTOP.tokenOfOwnerByIndex(owner,index)`方法
  ```js
    let tokenID = await  IISOTOP.tokenOfOwnerByIndex(owner,index)；
  ```
  ## 15. 查询NFT的总发行量
查询NFT的总发行量使用`IISOTOP.totalSupply()`方法
  ```js
    let totalSupply = await  IISOTOP.totalSupply()；
  ```
  ## 16. NFT安全转账
NFT安全转账使用`IISOTOP.safeTransferFrom(from,to，tokenID)`方法，此方法不会将NFT转入到无法转出的合约中
  ```js
    await  IISOTOP.safeTransferFrom(from,to，tokenID).sendTransaction({ from:  account }).executed()；
  ```
  其中from是NFT源地址，to是目标地址
   ## 17. NFT带数据安全转账
NFT安全转账使用`IISOTOP.safeTransferFrom(from,to，tokenID，_data)`方法，此方法不会将NFT转入到无法转出的合约中
  ```js
    await  IISOTOP.safeTransferFrom(from,to，tokenID,_data).sendTransaction({ from:  account }).executed()；
  ```
   其中from是NFT源地址，to是目标地址，_data是附加数据
   ## 18. 授权所有操作权限
授权所有操作权限使用`IISOTOP.setApprovalForAll(operator,approved)`方法
  ```js
    await  IISOTOP.setApprovalForAll(operator,approved).sendTransaction({ from:  account }).executed()；
  ```
  其中operator是授权操作者地址，approved是bool值
   ## 19. 查询目标地址是否有所有操作权限
查询目标地址是否有所有操作权限使用`IISOTOP.isApprovedForAll(owner,operator)`方法
  ```js
    let isApprovedForAll = await  IISOTOP.isApprovedForAll(owner,operator)；
  ```
  其中owner是源地址，operator是授权操作者地址
  ## 20. 查询是否支持Interface
查询是否支持Interface使用`IISOTOP.supportsInterface(interfaceID)`方法
  ```js
    let isSupportsInterface = await  IISOTOP.supportsInterface(interfaceID)；
  ```
## 21. 转移所有权transferOwnership
  转移所有权使用`IISOTOP.transferOwnership(newOwner)`方法
  ```js
    await  IISOTOP.transferOwnership(newOwner).sendTransaction({ from:  account }).executed()；
  ```
## 22. 安全铸造NFT
安全铸造NFT使用`IISOTOP.safeMint(to,quantity)`方法，此方法不会将NFT铸造至无法转出的合约地址中
  ```js
    await  IISOTOP.safeMint(to,quantity).sendTransaction({ from:  account }).executed()；
  ```
  其中to是铸造目标地址，quantity是铸造数量
 ## 23. 设置TGas
  设置TGas使用`IISOTOP.setTGas(address)`方法
  ```js
    await  IISOTOP.setTGas(address).sendTransaction({ from:  account }).executed()；
  ```
   ## 24. 查询TGas
  查询TGas使用`IISOTOP.getTGas()`方法
  ```js
     let address = await  IISOTOP.getTGas()；
  ```
  ## 25. 设置DetailsURI
设置DetailsURI使用`IISOTOP.setDetailsURI(uri)`方法
  ```js
     await  IISOTOP.setDetailsURI(uri).sendTransaction({ from:  account }).executed()；
  ```
  ## 26. NFT数据初始化
NFT数据初始化使用`IISOTOP.init(name,symbol,baseURI,details)`方法
  ```js
     await  IISOTOP.init(name,symbol,baseURI,details).sendTransaction({ from:  account }).executed()；
  ```
  其中name是NFT合集名字，symbol是NFT合集符号，baseURI是NFT初始元数据，details是NFT初始详情信息
## 27. 查询NFT合集名字
查询NFT合集名字使用`IISOTOP.name()`方法
  ```js
     let name = await  IISOTOP.name()；
  ```
## 28. 查询NFT合集符号
查询NFT合集符号使用`IISOTOP.symbol()`方法
  ```js
     let symbol = await  IISOTOP.symbol()；
  ```
 ## 29. 查询合约名
查询合约名使用`IISOTOP.contractName( )`方法
  ```js
     let contractName = await  IISOTOP.contractName( )；
  ```



  
  



##  30. 燃烧NFT

燃烧NFT使用`IISOTOP.burn(tokenID)`方法

```js

await IISOTOP.burn(tokenId)；

```

## 31. 查询已经燃烧的NFT

查询已经燃烧的NFT使用`IISOTOP.burned`方法

```js

let burned = await IISOTOP.burned()；

```

## 32. 查询NFT是否存在

查询NFT是否存在使用`IISOTOP.exists(tokenID)`方法

```js

let isExist = await IISOTOP.exists(tokenID)；

```
