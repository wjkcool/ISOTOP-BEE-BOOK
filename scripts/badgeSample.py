from conflux import *

#  创建测试链的web3对象。 如果是正式链，参数为main
#  其中ADMIN_PRIVATE_KEY环境变量存储管理员的私钥， CONSUMER_PRIVATE_KEY环境变量存储使用者的私钥。 web3会自动加载并存储这两个账户
web3 = ConfluxWeb3('test')

# 查看一下工厂合约里面注册了哪些合约模板
web3.showFactory()
web3.setDefaultAccount(web3.consumer)

# 注册徽章svg图像
with open('xunzhang.svg') as f:
    # 此处waterBadge 和合约的名字保持一样
    web3.dds.functions.put('waterBadge', 'IMAGE', str_to_bytes(
        f.read())).transact().executed()

# 通过工厂合约创建一个ISOTOP1016合约
i6 = web3.loadContract('ISOTOP1016', web3.deployFromFactory('ISOTOP1016'))
print(f'ISOTOP1016 contract created at {i6.address}')

# 此处waterBadge为我们注册的名字， WB是symbol， description为介绍文字， detail可以为空
i6.functions.init("waterBadge", "WB", "介绍文字，这是我们的创世徽章",
                  "").transact().executed()


# 铸造1个NFT给地址admin
i6.functions.mint(web3.admin.address, 1).transact().executed()

# 查看铸造数量：1个
total = i6.functions.totalSupply().call()
print(f"Total {total} NFT minted")

# 现在可以在conflux 浏览器输入合约地址查看铸造的NFT了
# https://testnet.confluxscan.io
