
#  IISOTOP1022合约极简教程

如果你要使用文昌链上的ISOTOP合约，需要配置metamask的自定义RPC网络，具体如下：

网络名称:   文昌测试链

RPC URL:    http://testnet.bianjie.ai:8545

链ID:   12231

货币符号:   WEN


如下图所示：

![如图所示](https://upload.cc/i1/2022/11/23/2ThL60.png)


另外写Dapp的前端，使用IISOTOP1010合约时，需要用到`ethers.js`。


##  1. ethers.js简述

`ethers.js`是一个完整而紧凑的开源库，用于与以太坊区块链及其生态系统进行交互。

与更早出现的`web3.js`相比，它有以下优点：

1. 代码更加紧凑：`ethers.js`大小为116.5 kB，而`web3.js`为590.6 kB。

2. 更加安全：`Web3.js`认为用户会在本地部署以太坊节点，私钥和网络连接状态由这个节点管理（实际并不是这样）；`ethers.js`中，`Provider`提供器类管理网络连接状态，`Wallet`钱包类管理密钥，安全且灵活。

3. 原生支持`ENS`。

使用方法也很简单

``` js

import { ethers } from "ethers";

```

## 2 . 获得工厂合约对象


1. 要使用IISOTOP1022合约，首先需要通过DDS系统获得**工厂合约地址**`FactoryContractAddr`
```js
    const Provider = new ethers.providers.Web3Provider(window.ethereum);
    const Signer = Provider.getSigner();
    const DDSAddr = '0x8C0813590b65952197F5654ec953Ccc601725bEe';
    const DDSABI = [
                   "function get(string calldata _domain, string calldata _key) external view returns (bytes memory)",
                    // ......此处省略
                   "function toAddress(bytes memory b) external pure returns (address addr)"
                    ]
    const DDSContract = new  ethers.Contract(DDSAddr, DDSABI, signer);
    const DDSBytes = await  ddsContract.get('ISOTOP', 'BEE_FACTORY_ADDRESS');
    const FactoryContractAddr = await  ddsContract.toAddress(ddsBytes);
```

2.  通过**工厂合约地址**获得**工厂合约对象**

    获得**工厂合约对象**`ethers.Contract(FactoryContractAddr, FactoryABI, Signer)`需要三个参数，**工厂合约地址**`FactoryContractAddr`,**工厂合约ABI**`FactoryABI`,以及**钱包**`Signer`

 ```javascript
     const  factoryABI = [" function deployContract(string) external returns (address)",
                          // ......此处省略
                          " function getContractsDeployed() external view returns (address[])"
                          ];
     const FactoryContractAddr = '0x21264AbA1FdDECA4d89a992729b25Bd9060A4beE';
     const Factory = new ethers.Contract(FactoryContractAddr, FactoryABI, Signer);
     let waiter = await Factory.deployContract('ISOTOP1022');
     waiter.wait();
 ```
 其中`FactoryContractAddr`是工厂合约地址，`Factory`是生成的工厂合约对象

##  3. 查询子合约地址并获得`IISOTOP`对象

然后查询子合约地址，使用`IISOTOP1022.getContractsDeployed()`方法获得`IISOTOP1022Addr`

```js

let IISOTOP1022AddrArray = new Array();

IISOTOP1022AddrArray = await Factory.getContractsDeployed();

IISOTOP1022Addr = IISOTOP1022AddrArray[IISOTOP1022AddrArray.length-1];

```

之后根据`IISOTOP1022Addr`，`IISOTOP1022ABI`，`Signer`获得**子合约对象**`IISOTOP`，就可以调用它的各种方法了

```js

const IISOTOP1022ABI = ["function mint(address, uint256) external",

//......此处省略

"function balanceOf(address) external view returns (uint256)"

];

const IISOTOP = new ethers.Contract(IISOTOP1022Addr, IISOTOP1022ABI, Signer);

```

## 4.  铸造会员卡

获得子合约地址之后，就可以调用IISOTOP1021合约下面的各种方法了，比如mint`IISOTOP.mint(address, uint) `会员卡，tokenId建议是用户身份证数字，不能为0,初始积分的数量为0
  ```js
  
      data = IISOTOP.mint(address,5);  //铸造5个会员卡
      
  ```


##  5. 查询某地址拥有的会员卡数量

查询address地址拥有的会员卡数量使用` IISOTOP.balanceOf(address)`方法

```js

const balance = await IISOTOP.balanceOf(address);

```

##  6. 转移会员卡

转移会员卡需要用到`IISOTOP.transferFrom(from,to,tokenID)`方法

```js

let waiter = await IISOTOP.transferFrom(from,to,tokenID);

await waiter.wait();

```

其中from，to是地址，tokenID是会员卡编号

##  7. 查询某会员卡 ID对应的所有人

查询某会员卡对应所有人使用` IISOTOP.ownerOf(tokenID)`方法

```js

owneraddr = await IISOTOP.ownerOf(tokenID);

```

##  8. 查询会员卡 ID对应的授权地址

查询会员卡 ID对应的授权地址` IISOTOP.getApproved(tokenID)`方法

```js

approvedaddr = await IISOTOP.getApproved(tokenID);

```

## 9. 授权会员卡给对应的地址

授权会员卡给对应的地址使用` IISOTOP.approved(address,tokenID)`方法

```js

let waiter = await IISOTOP.approve(address,tokenID);

await waiter.wait();

```

##  10. 设置会员卡元数据

设置会员卡元数据使用` IISOTOP.setBaseURI(baseURI)`方法

```js

await IISOTOP.setBaseURI(baseURI);

```

##  11. 查询账户下所有会员卡的ID

查询账户下所有会员卡的ID使用` IISOTOP.tokensOfOwner(address)`方法

```js

await IISOTOP.tokensOfOwner(address);

```

##  12 查询账户下ID从A-B中包含的会员卡

查询账户下ID从A-B中包含的会员卡使用` IISOTOP.tokensOfOwnerIn(address,start,stop)`方法

```js

await IISOTOP.tokensOfOwnerIn(address,start,stop);

```

其中start表示开始的ID，类型为uint256，stop表示结束的ID，类型为uint256，address表示需要查询的地址

##  13. 查询会员卡的租借者user

查询会员卡的使用者user`IISOTOP.userOf(tokenID)`方法

```js

await IISOTOP.userOf(tokenID);

```

##  14. 设置会员卡的租借者user

设置会员卡的使用者user使用` IISOTOP.setUser(tokenID,address,time)`方法

```js

let waiter = await IISOTOP.setUser(tokenID,address,time);

await waiter.wait();

```

其中time为uint64类型

##  15. 检查会员卡的租借时间

检查会员卡的租借时间使用`IISOTOP.userExpires(tokenID)`方法

```js

await IISOTOP.userExpires(tokenID);

```

##  16. 燃烧会员卡

燃烧会员卡使用`IISOTOP.burn(tokenID)`方法

```js

await IISOTOP.burn(tokenId)；

```

## 17. 查询已经燃烧的会员卡

查询已经燃烧的会员卡使用`IISOTOP.burned`方法

```js

let burned = await IISOTOP.burned()；

```

## 18. 查询会员卡是否存在

查询会员卡是否存在使用`IISOTOP.exists(tokenID)`方法

```js

let isExist = await IISOTOP.exists(tokenID)；

```

## 19. 查询会员卡详情

查询会员卡详情使用`IISOTOP.Details()`方法

```js

let details = await IISOTOP.Details()；

```

## 20. 设置DetailsURI

设置DetailsURI使用`IISOTOP.setDetailsURI(uri)`方法

```js

await IISOTOP.setDetailsURI(uri)；

```

## 21. 查询会员卡元数据

查询会员卡元数据使用`IISOTOP.tokenURI()`方法

```js

let tokenURI = await IISOTOP.tokenURI()；

```

## 22. 查询第index的会员卡的tokenID

查询会员卡元数据使用`IISOTOP.tokenByIndex(index)`方法

```js

let tokenID = await IISOTOP.tokenByIndex(index)；

```

## 23. 查询owner第index的会员卡的tokenID

查询owner第index的会员卡的tokenID使用`IISOTOP.tokenOfOwnerByIndex(owner,index)`方法

```js

let tokenID = await IISOTOP.tokenOfOwnerByIndex(owner,index)；

```

## 24. 查询会员卡的总发行量

查询会员卡的总发行量使用`IISOTOP.totalSupply()`方法

```js

let totalSupply = await IISOTOP.totalSupply()；

```

## 25. 会员卡安全转账

会员卡安全转账使用`IISOTOP.safeTransferFrom(from,to，tokenID)`方法，此方法不会将会员卡转入到无法转出的合约中

```js

await IISOTOP.safeTransferFrom(from,to，tokenID)；

```

其中from是会员卡源地址，to是目标地址

## 26. 会员卡带数据安全转账

会员卡安全转账使用`IISOTOP.safeTransferFrom(from,to，tokenID，_data)`方法，此方法不会将会员卡转入到无法转出的合约中

```js

await IISOTOP.safeTransferFrom(from,to，tokenID,_data)；

```

其中from是会员卡源地址，to是目标地址，_data是附加数据

## 27. 授权所有操作权限

授权所有操作权限使用`IISOTOP.setApprovalForAll(operator,approved)`方法

```js

await IISOTOP.setApprovalForAll(operator,approved)；

```

其中operator是授权操作者地址，approved是bool值

## 28. 查询目标地址是否有所有操作权限

查询目标地址是否有所有操作权限使用`IISOTOP.isApprovedForAll(owner,operator)`方法

```js

let isApprovedForAll = await IISOTOP.isApprovedForAll(owner,operator)；

```

其中owner是源地址，operator是授权操作者地址

## 29. 查询是否支持Interface

查询是否支持Interface使用`IISOTOP.supportsInterface(interfaceID)`方法

```js

let isSupportsInterface = await IISOTOP.supportsInterface(interfaceID)；

```

##  30. 转移所有权transferOwnership

转移所有权使用`IISOTOP.transferOwnership(newOwner)`方法

```js

await IISOTOP.transferOwnership(newOwner)；

```

##  31. 安全铸造会员卡

安全铸造会员卡使用`IISOTOP.safeMint(to,quantity)`方法，此方法不会将会员卡铸造至无法转出的合约地址中

```js

await IISOTOP.safeMint(to,quantity)；

```

其中to是铸造目标地址，quantity是铸造数量

## 32. 设置TGas

设置TGas使用`IISOTOP.setTGas(address)`方法

```js

await IISOTOP.setTGas(address)；

```

## 33. 查询TGas

查询TGas使用`IISOTOP.getTGas()`方法

```js

let address = await IISOTOP.getTGas()；

```

## 34. 会员卡数据初始化

会员卡数据初始化使用`IISOTOP.init(name,symbol,baseURI,details)`方法

```js

await IISOTOP.init(name,symbol,baseURI,details)；

```

其中name是会员卡合集名字，symbol是会员卡合集符号，baseURI是会员卡初始元数据，details是会员卡初始详情信息

##  35. 查询会员卡合集名字

查询会员卡合集名字使用`IISOTOP.name()`方法

```js

let name = await IISOTOP.name()；

```

##  36. 查询会员卡合集符号

查询会员卡合集符号使用`IISOTOP.symbol()`方法

```js

let symbol = await IISOTOP.symbol()；

```

## 37. 查询合约名

查询合约名使用`IISOTOP.contractName( )`方法

```js

let contractName = await IISOTOP.contractName( )；

```
## 38. 设置BaseURI

设置BaseURI使用`IISOTOP.setBaseURI(string memory base_)`方法

```js

     await  IISOTOP.setBaseURI(base_)；

  ```


## 39. 设置DetailsURI
设置DetailsURI使用`IISOTOP.setDetailsURI(string memory uri_)`方法

```js

     await  IISOTOP.setDetailsURI(uri_)；
   
  ```

## 40. 铸造会员卡带初始积分
铸造会员卡带初始积分使用`IISOTOP.mint(address to_,uint256 tokenId_,uint256 value_)`方法
 ```js
 
     await IISOTOP.mint(address,5，100)；  //给address地址mint100积分的tokenID为5的会员卡
     
  ```


## 41. 为会员卡充值积分
为会员卡充值积分使用`IISOTOP.fill(uint256 tokenId, uint256 _value)`方法
 ```js
 
     await IISOTOP.fill(5，100);  //给tokenID为5的会员卡充值100积分
  
  ```
  
## 42. 消费会员卡积分
为会员卡充值积分使用`IISOTOP.consume(uint256 tokenId, uint256 _value)`方法
 ```js
 
     await IISOTOP.consume(5，100)；  //tokenID为5的会员卡消费100积分
  
  ```


##  43. 转移积分给新用户并指定新用户的会员卡id为newId
转移积分给新用户并指定新用户的id为newId使用`IISOTOP.transferFrom(uint256 fromTokenId_,address to_,uint256 value_,uint256 newId) `方法
 ```js
 
     await IISOTOP.transferFrom(5,address,100,8)；  //tokenID为5的会员卡转移100积分到address地址的tokenID为8的会员卡中
    
  ```

## 44. 返回tokenId的可视化内容

返回tokenId的可视化内容使用`IISOTOP.tokenURI(uint256 tokenId)`方法

```js

let contractName = await IISOTOP.tokenURI(tokenId)；

```

## 45. 返回积分的可视化内容

返回积分的可视化内容使用`IISOTOP.slotURI( )`方法

```js

let slotURI = await IISOTOP.slotURI( )；

```



