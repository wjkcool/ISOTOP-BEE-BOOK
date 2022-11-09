

以下问题基于工厂合约地址（0x002eab063747F1c5a7106E4E4d353491c20BbbEe）创建生成NFT1013合约进行测试。
# 1、tokenByIndex
## 测试步骤：
1.	向用户账户发行 n个 token
2.	使用tokenByIndex查询第1个tokenId

## 测试结果：
出现错误：Error: call revert exception [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (method="tokenByIndex(uint256)", data="0x", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.7.0)

## 复现参考：
NFT1013合约地址：0xb9f1AC33D6d8bCEc43510BF09b4a43EE12137A97
调用函数参数tokenByIndex ( 1 )

# 2、tokenOfOwnerByIndex
## 测试步骤：
1.	创建一个新的NFT1013合约（非必须）
2.	向用户账户A发行 n个 token
3.	使用tokenOfOwnerByIndex查询账户第n个的tokenId
## 测试结果：
出现错误：Error: call revert exception [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (method="tokenOfOwnerByIndex(address,uint256)", data="0x", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.7.0)
## 复现参考：
NFT1013合约地址：0xb9f1AC33D6d8bCEc43510BF09b4a43EE12137A97
调用函数参数: 
tokenOfOwnerByIndex ( “0xbb44a15462C5c5042A74b4Adc770793A7E57210a”, 1 )

# 3、burned
## 测试步骤：
1.	创建一个新的NFT1013合约（非必须）
2.	向用户账户A发行 n个 token
3.	使用burn销毁其中1个token
4.	使用burned查看销毁个数，报错
## 测试结果：
出现错误：Error: call revert exception [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (method="burned()", data="0x", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.7.0)
## 复现参考：
NFT1013合约地址：0xb9f1AC33D6d8bCEc43510BF09b4a43EE12137A97
调用函数: burned()

# 4、transferOwnership
## 测试步骤：
1.	创建一个新的NFT1013合约（非必须）
2.	向用户合约Owner账户A发行 2个 token
3.	使用transferOwnership批量转移token给账户B， 账户A持有token数量应为0， 账户B持有数量应 + 2
## 测试结果：
实际结果账户A与账户B持有token数量没变
出现错误：expected 2 to equal +0' to be empty
## 复现参考：
NFT1013合约地址：0xaF12c451d2f9AA64F9eEaF1e8b41CF1ddfE2E6Da
调用函数: transferOwnership (“0x2BC344895094575cb363DdBCa7FDC8DE66Ad2dD7“)

# 5、Mint
## 测试步骤：
1．	向用户账户A发行 超过1万的 token
2．	通过ownerOf查询本次发行的token所有者
## 测试结果：
发行超过 11103 时，从11103开始查询报错，以下是测试的发行数量及查询当次发行结果汇总表：

发行数量	发行后总数量	查询所有者报错范围	当次发行报错起始位置

15000	15000	11103-14999	11103

15000	30000	26103-29999	11103

19000	49000	41103-48999	11103

12000	61000	60103-60999	11103

11100	72100	都可查询 	

11104	83204	83203	11103


## 复现参考：
NFT1013合约地址：0x728776eaa800031fEdC68738029EC878aA174A29
账户地址：0xbb44a15462C5c5042A74b4Adc770793A7E57210a

ISOTOP1013当前存在的问题：
1、	tokenByIndex报错
2、	tokenOfOwnerByIndex报错
3、	burned报错
4、	transferOwnership 报错
5、	mint 20000时，时而大于12000左右，使用ownerOf查询报错

