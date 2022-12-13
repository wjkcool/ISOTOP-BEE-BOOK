# IISOTOP1015合约极简教程

如果你要使用anyweb上的ISOTOP合约，首先需要在 https://open.anyweb.cc/register 注册一个anyweb钱包并获得appID。

![anyweb](https://upload.cc/i1/2022/12/11/TQdy4U.png)

另外写Dapp的前端，使用ISOTOP1015合约时，需要用到` js-conflux-sdk`，`Buffer`和anyweb的`Provider`。


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


1. 要使用ISOTOP1015合约，首先需要通过DDS系统获得**工厂合约地址**`FactoryContractAddr`
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
    let  data = Factory.deployContract('ISOTOP1015').data;
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
  然后查询子合约地址，使用`IISOTOP1015.getContractsDeployed()`方法获得`IISOTOP1015Addr`

  ```js
      let IISOTOP1015AddrArray = new Array();
      IISOTOP1015AddrArray = await  Factory.getContractsDeployed('ISOTOP1015');
      const IISOTOP1015Addr = format.address((IISOTOP1015AddrArray[IISOTOP1015AddrArray.length-1]）,1029);  //这里需要将hex40地址格式转换成conflux的cip37地址格式
  ```
之后根据`IISOTOP1015Addr`，`IISOTOP1015ABI`获得**子合约对象**`IISOTOP`，就可以调用它的各种方法了
```js
    abi = ["function mint(address, uint256) external",
            //......此处省略
           "function balanceOf(address) external view returns (uint256)"
          ];
    const IISOTOP = new conflux.Contract({ abi, address:  IISOTOP1015Addr });
```
## 4.  铸造NFT

获得子合约地址之后，就可以调用IISOTOP1015合约下面的各种方法了，比如mint`IISOTOP.mint(address, uint) `
  ```js
      data = IISOTOP.mint(address,5).data;
      recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1015Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```

## 5.  查询某地址拥有的NFT数量
查询address地址拥有的NFT数量使用` IISOTOP.balanceOf(address)`方法
  ```js
      const  balance = await  IISOTOP.balanceOf(address);
  ```
## 6. 转移NFT
转移NFT需要用到`IISOTOP.transferFrom(from,to,tokenID)`方法
  ```js
     data = IISOTOP.transferFrom(from,to,tokenID).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1015Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
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
     data = IISOTOP.approve(address,tokenID).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1015Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```
## 10. 设置NFT元数据
设置NFT元数据使用` IISOTOP.setBaseURI(baseURI)`方法
  ```js
     data =  IISOTOP.setBaseURI(baseURI).data;
     recepient = provider.request({
                   method: 'cfx_sendTransaction', params: [{
                                                  from:  address[0], //发送方地址
                                                  to:  IISOTOP1015Addr, //调用的合约地址
                                                  data:  data,
                                                  }]
                                   });
  ```

##  11. 查询账户下所有NFT的ID

查询账户下所有NFT的ID使用` IISOTOP.tokensOfOwner(address)`方法

```js

await IISOTOP.tokensOfOwner(address);

```