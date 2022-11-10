// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

/**
 * @dev Interface of ISOTOP1010： ERC721低GAS的兼容版

主要功能：
*） 给NFT加持内容：setBaseURI
*） 铸造NFT：mint
*） 安全铸造NFT（检查是否可以被合约地址拥有）：safeMint
*） 可查询接口：tokenByIndex, tokenOfOwnerByIndex
*） 转移：transferFrom

设计要点：
1)  普通的ERC721合约一次只能铸造一个NFT，如果批量铸造1万个，GAS费用太高，ISOTOP1010设定了批量功能，GAS费用大大节省。
2)  联盟链需要给用户地址充值才能调用上链操作。如果没有GAS费用就无法使用。而给链账户充值又很难逐个进行，所以ISOTOP1010特地设置了管理员(owner)代替用户mint，transfer，租用的能力。无需用户账户有余额也可以通过管理员铸造，管理（比如租借），转移NFT
3） 其它功能完全兼容ERC721

 */

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IISOTOP1010 is
    IERC721,
    IERC721Receiver,
    IERC721Metadata,
    IERC721Enumerable
{
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

    function contractName() external pure returns (string memory);

    function setBaseURI(string memory base_) external;

    function setDetailsURI(string memory uri_) external;

    function setTGas(address _tgas) external;

    function getTGas() external view returns (address);

    function Details() external view returns (string memory);

    // @dev Ownerable 接口
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() external returns (address);

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() external;

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) external;
}
