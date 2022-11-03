// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

/**
 * @dev Interface of ISOTOP1010： ERC721低GAS的兼容版

测试用的baseURI json 文件：
https://bafybeigtb3tt4a2eyurd4vk7jrjuiwnetufyfy7evmf4e2nwljatrcsdhq.ipfs.nftstorage.link/

主要测试功能：
*） 给NFT加持内容：setBaseURI
*） 铸造NFT：mint
*） 安全铸造NFT（检查是否可以被合约地址拥有）：safeMint
*） 可查询接口：tokenByIndex, tokenOfOwnerByIndex
*） 转移：transferFrom

测试要点：
1)  很多联盟链需要给用户地址充值才能调用上链操作。如果没有GAS费用就无法使用。而给链账户充值又很难逐个进行，所以ISOTOP1010特地设置了管理员(owner)代替用户mint，transfer，租用的能力。无需用户账户有余额也可以通过管理员铸造，管理（比如租借），转移NFT
2)  普通的ERC721合约一次只能铸造一个NFT，如果批量铸造1万个，GAS费用太高，ISOTOP1010设定了批量功能，GAS费用大大节省。
3） ISOTOP1010和ERC721完全兼容，但是批量铸造的GAS费用有差异（测试需要出GAS费用的对比价格）

 */
interface IISOTOP1010 {
    event baseURIChanged(string uri);
    event detailsURIChanged(string uri);
    event gasLoaded(address gasManager);

    /// @dev 标准接口

    function init(
        string memory name_,
        string memory symbol_,
        string memory base_,
        string memory details_
    ) external;

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function contractName() external returns (string memory);

    function setBaseURI(string memory base_) external;

    function setDetailsURI(string memory uri_) external;

    function setTGas(address _tgas) external;

    function getTGas() external view returns (address);

    function transferOwnership(address newOwner) external;

    function mint(address _to, uint256 quantity) external;

    function safeMint(address _to, uint256 quantity) external;

    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId) external view returns (address);

    function setApprovalForAll(address operator, bool approved) external;

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) external;

    function totalSupply() external view returns (uint256);

    function tokenByIndex(uint256 index) external view returns (uint256);

    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256 tokenId);

    function ownerOf(uint256 tokenId) external view returns (address);

    function balanceOf(address owner) external view returns (uint256);

    function Details() external view returns (string memory);

    function tokenURI(uint256 tokenId) external view returns (string memory);
}
