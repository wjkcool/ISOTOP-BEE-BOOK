from conflux import *

#  创建测试链的web3对象。 如果是正式链，参数为main
#  其中ADMIN_PRIVATE_KEY环境变量存储管理员的私钥， CONSUMER_PRIVATE_KEY环境变量存储使用者的私钥。 web3会自动加载并存储这两个账户
web3 = ConfluxWeb3('test')

# 查看一下工厂合约里面注册了哪些合约模板
web3.showFactory()

# 设置默认的账户
web3.setDefaultAccount(web3.consumer)

# 通过工厂合约创建一个ISOTOP1013合约
i3 = web3.loadContract('ISOTOP1013', web3.deployFromFactory('ISOTOP1013'))
print(f'ISOTOP1013 contract created at {i3.address}')

# 初始化1013合约。 base为NFT的存储链接、 details为操作页面链接
i3.functions.init("徽章", "BADGE", "base/", "details/").transact().executed()

# 铸造5000个NFT给地址admin
i3.functions.mint(web3.admin.address, 5000).transact().executed()

# 查看铸造数量：5000个
total = i3.functions.totalSupply().call()
print(f"Total {total} NFT minted")
