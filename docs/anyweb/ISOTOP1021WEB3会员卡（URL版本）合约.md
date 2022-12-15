# IISOTOP1021合约极简教程

如果你要使用anyweb上的ISOTOP合约，首先需要在 https://open.anyweb.cc/register 注册一个anyweb钱包并获得appID。

![anyweb](https://upload.cc/i1/2022/12/11/TQdy4U.png)

另外写Dapp的前端，使用ISOTOP1021合约时，需要用到` js-conflux-sdk`，`Buffer`和anyweb的`Provider`。


## 1. js-conflux-sdk和Buffer简述

1. js-conflux-sdk软件开发工具包是一个完整的库，用于在 Node.js 和浏览器环境中与 Conflux 区块链进行交互。

    文档地址：https://docs.confluxnetwork.org/js-conflux-sdk

    安装方式：
```
   $ npm install js-conflux-sdk
```
使用方法：
``` js
    import { Conflux，format } from 'js-conflux-sdk';
```
2. 在编程中会遇到诸如**处理文件类型数据**的需求，操作这种类型的数据就需要使用到二进制，而操作二进制就需要通过Buffer模块。
    
    安装方式：
```
   $ npm install buffer
```
使用方法：
``` js
    import { Buffer } from  "buffer";
```
3. anyweb的Provider负责前端界面和anyweb的交互。

    安装方式：
```
   $ npm install --save @idealight-labs/anyweb-js-sdk
```

使用方法：

``` js
    import {Provider} from '@idealight-labs/anyweb-js-sdk';
```

## 2 . 获得工厂合约对象


1. 要使用ISOTOP1021合约，首先需要通过DDS系统获得**工厂合约地址**`FactoryContractAddr`
```js
    const conflux = new  Conflux({url:  'https://main.confluxrpc.com',networkId:  1029 });
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

```js
    const  provider = await  new  Provider({logger:  console, appId:  'YOUR_APP_ID',});
    let  result = await  provider.request({method:  'cfx_accounts',params: [{availableNetwork[1, 1029],scopes: ['baseInfo', 'identity'],}]});
    const { address, code, scopes } = result;
    console.log("用户地址", address[0], "OAuth Code", code, "Scope", scopes);    //通过anyweb获得用户地址

    abi = [" function deployContract(string) external returns (address)",
            // ......此处省略
           " function getContractsDeployed() external view returns (address[])"
           ];
    const PRIVATE_KEY = 'YOUR_PRIVATE_KEY' ; // sender private key
    const account = conflux.wallet.addPrivateKey(PRIVATE_KEY);
    const Factory = conflux.Contract({ abi, address:  FactoryContractAddr });   
    let  data = Factory.deployContract('ISOTOP1021').data;
    let  receipt = await  provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  FactoryContractAddr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                           });
 ``` 
 其中`FactoryContractAddr`是工厂合约地址，`Factory`是生成的工厂合约对象
 
## 3.  查询子合约地址并获得`IISOTOP`对象
  然后查询子合约地址，使用`IISOTOP1021.getContractsDeployed()`方法获得`IISOTOP1021Addr`

  ```js
      let IISOTOP1021AddrArray = new Array();
      IISOTOP1021AddrArray = await  Factory.getContractsDeployed('ISOTOP1021');
      const IISOTOP1021Addr = format.address((IISOTOP1021AddrArray[IISOTOP1021AddrArray.length-1]）,1029);  //这里需要将hex40地址格式转换成conflux的cip37地址格式
  ```
之后根据`IISOTOP1021Addr`，`IISOTOP1021ABI`获得**子合约对象**`IISOTOP`，就可以调用它的各种方法了
```js
    abi = ["function mint(address, uint256) external",
            //......此处省略
           "function balanceOf(address) external view returns (uint256)"
          ];
    const IISOTOP = new conflux.Contract({ abi, address:  IISOTOP1021Addr });
```
## 4.  铸造会员卡

获得子合约地址之后，就可以调用IISOTOP1021合约下面的各种方法了，比如
mint`IISOTOP.mint(address, uint) `会员卡，tokenId建议是用户身份证数字，不能为0,初始积分的数量为0
  ```js
      data = IISOTOP.mint(address,5).data;
      recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```

## 5.  查询某地址拥有的会员卡数量
查询address地址拥有的会员卡数量使用` IISOTOP.balanceOf(address)`方法
  ```js
      const  balance = await  IISOTOP.balanceOf(address);
  ```
## 6. 转移会员卡
转移会员卡需要用到`IISOTOP.transferFrom(from,to,tokenID)`方法
  ```js
     data = IISOTOP.transferFrom(from,to,tokenID).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```
  其中from，to是地址，tokenID是会员卡编号
## 7. 查询某会员卡 ID对应的所有人
查询某会员卡对应所有人使用` IISOTOP.ownerOf(tokenID)`方法
  ```js
     owneraddr = await  IISOTOP.ownerOf(tokenID);
  ```
## 8. 查询会员卡 ID对应的授权地址
查询会员卡 ID对应的授权地址` IISOTOP.getApproved(tokenID)`方法
  ```js
     approvedaddr = await  IISOTOP.getApproved(tokenID);
  ```
  ## 9. 授权会员卡给对应的地址
授权会员卡给对应的地址使用` IISOTOP.approved(address,tokenID)`方法
  ```js
     data = IISOTOP.approve(address,tokenID).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```
## 10. 设置会员卡元数据
设置会员卡元数据使用` IISOTOP.setBaseURI(baseURI)`方法
  ```js
     data =  IISOTOP.setBaseURI(baseURI).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
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
     data =  IISOTOP.setUser(tokenID,address,time).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
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
     data = IISOTOP.burn(tokenID).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
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
     data =  IISOTOP.setDetailsURI(uri).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
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
     data =  IISOTOP.safeTransferFrom(from,to，tokenID).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```

其中from是会员卡源地址，to是目标地址

## 26. 会员卡带数据安全转账

会员卡安全转账使用`IISOTOP.safeTransferFrom(from,to，tokenID，_data)`方法，此方法不会将会员卡转入到无法转出的合约中

```js
     data =  IISOTOP.safeTransferFrom(from,to，tokenID，_data).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```

其中from是会员卡源地址，to是目标地址，_data是附加数据

## 27. 授权所有操作权限

授权所有操作权限使用`IISOTOP.setApprovalForAll(operator,approved)`方法

```js
     data =  IISOTOP.setApprovalForAll(operator,approved).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
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
     data =  IISOTOP.transferOwnership(newOwner).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```
##  31. 安全铸造会员卡

安全铸造会员卡使用`IISOTOP.safeMint(to,quantity)`方法，此方法不会将会员卡铸造至无法转出的合约地址中

```js
     data =  IISOTOP.safeMint(to,quantity).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```

其中to是铸造目标地址，quantity是铸造数量

## 32. 设置TGas

设置TGas使用`IISOTOP.setTGas(address)`方法

```js
     data =  IIISOTOP.setTGas(address).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```

## 33. 查询TGas

查询TGas使用`IISOTOP.getTGas()`方法

```js

let address = await IISOTOP.getTGas()；

```

## 34. 会员卡数据初始化

会员卡数据初始化使用`IISOTOP.init(name,symbol,baseURI,details,_totalPoints)`方法

```js
     data =  IISOTOP.init(name,symbol,baseURI,details,_totalPoints).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
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
     data =  IISOTOP.setBaseURI(base_).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```


## 39. 设置DetailsURI
设置DetailsURI使用`IISOTOP.setDetailsURI(string memory uri_)`方法

```js
     data =  IISOTOP.setDetailsURI(uri_) .data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```

## 40. 铸造会员卡带初始积分
铸造会员卡带初始积分使用`IISOTOP.mint(address to_,uint256 tokenId_,uint256 value_)`方法
 ```js
      data = IISOTOP.mint(address,5，100).data;  //给address地址mint100积分的tokenID为5的会员卡
      recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```


## 41. 为会员卡充值积分
为会员卡充值积分使用`IISOTOP.fill(uint256 tokenId, uint256 _value)`方法
 ```js
      data = IISOTOP.fill(5，100).data;  //给tokenID为5的会员卡充值100积分
      recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```
  
## 42. 消费会员卡积分
为会员卡充值积分使用`IISOTOP.consume(uint256 tokenId, uint256 _value)`方法
 ```js
      data = IISOTOP.consume(5，100).data;  //tokenID为5的会员卡消费100积分
      recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```


##  43. 转移积分给新用户并指定新用户的会员卡id为newId
转移积分给新用户并指定新用户的id为newId使用`IISOTOP.transferFrom(uint256 fromTokenId_,address to_,uint256 value_,uint256 newId) `方法
 ```js
      data = IISOTOP.transferFrom(5,address,100,8).data;  //tokenID为5的会员卡转移100积分到address地址的tokenID为8的会员卡中
      recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1021Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
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



