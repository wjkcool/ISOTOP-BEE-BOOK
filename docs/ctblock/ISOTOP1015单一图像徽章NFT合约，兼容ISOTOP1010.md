#  IISOTOP1015合约极简教程

如果你要使用草田链上的ISOTOP合约，需要配置metamask的自定义RPC网络，具体如下：

网络名称:   草田链

RPC URL:   https://ctblock.cn/blockChain

链ID:   27

货币符号:   CT

区块链浏览器:   https://ctblock.cn/


如下图所示：

![如图所示](https://upload.cc/i1/2022/11/10/2yaUFs.png)


另外写Dapp的前端，使用IISOTOP1015合约时，需要用到`ethers.js`。


## 1. ethers.js简述



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


1. 要使用IISOTOP1015合约，首先需要通过DDS系统获得**工厂合约地址**`FactoryContractAddr`
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
     let waiter = await Factory.deployContract('ISOTOP1015');
     waiter.wait();
 ```
 其中`FactoryContractAddr`是工厂合约地址，`Factory`是生成的工厂合约对象

##  3. 查询子合约地址并获得`IISOTOP`对象

然后查询子合约地址，使用`IISOTOP1015.getContractsDeployed()`方法获得`IISOTOP1015Addr`

```js

let IISOTOP1015AddrArray = new Array();

IISOTOP1015AddrArray = await Factory.getContractsDeployed();

IISOTOP1015Addr = IISOTOP1015AddrArray[IISOTOP1015AddrArray.length-1];

```

之后根据`IISOTOP1015Addr`获得对象`IISOTOP`，就可以调用它的各种方法了

```js

const IISOTOP = new ethers.Contract(IISOTOP1015Addr, IISOTOP1015ABI, Signer);

```

##  4. 铸造NFT

获得NFT子合约地址之后，就可以调用IISOTOP1015合约下面的各种方法了，比如mint`IISOTOP.mint(address, uint) `

```js

let waiter = await IISOTOP.mint(MyAddr1,5) ; //铸造5个nft

await waiter.wait()

```

这里加入`waiter.wait()`的目的是等待区块确认

##  5. 查询某地址拥有的NFT数量

查询address地址拥有的NFT数量使用` IISOTOP.balanceOf(address)`方法

```js

const balance = await IISOTOP.balanceOf(address);

```

##  6. 转移NFT

转移NFT需要用到`IISOTOP.transferFrom(from,to,tokenID)`方法

```js

let waiter = await IISOTOP.transferFrom(from,to,tokenID);

await waiter.wait();

```

其中from，to是地址，tokenID是NFT编号

##  7. 查询某NFT ID对应的所有人

查询某NFT对应所有人使用` IISOTOP.ownerOf(tokenID)`方法

```js

owneraddr = await IISOTOP.ownerOf(tokenID);

```

##  8. 查询NFT ID对应的授权地址

查询NFT ID对应的授权地址` IISOTOP.getApproved(tokenID)`方法

```js

approvedaddr = await IISOTOP.getApproved(tokenID);

```

## 9. 授权NFT给对应的地址

授权NFT给对应的地址使用` IISOTOP.approved(address,tokenID)`方法

```js

let waiter = await IISOTOP.approve(address,tokenID);

await waiter.wait();

```

##  10. 设置NFT元数据

设置NFT元数据使用` IISOTOP.setBaseURI(baseURI)`方法

```js

await IISOTOP.setBaseURI(baseURI);

```

##  11. 查询账户下所有NFT的ID

查询账户下所有NFT的ID使用` IISOTOP.tokensOfOwner(address)`方法

```js

await IISOTOP.tokensOfOwner(address);

```
