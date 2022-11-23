import { useState, useRef } from "react";
import { ethers, BigNumber } from "ethers";
import { Flex, Box, Text, Input, Button, Textarea } from '@chakra-ui/react';
import ABI from "./ABI.json";
import { keccak256 } from "ethers/lib/utils";



const NftAddress = "0x77C469eC60fCCdbBDe9FC6Fd05B6E3D70ee8D245";


const Register = ({ accounts, setAccounts }) => {
    const [address, setAddress] = useState(0);
    const [hex, setHex] = useState(0);
    const isConnected = Boolean(accounts[0]);
    const phoneref = useRef(null);
    const bytescoderef = useRef(null);
    const numberref = useRef(null);
    var contract;







    async function clickregister() {


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // 读取钱包地址
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0];
        console.log(`钱包地址: ${account}`);
        const resumeNFTaddr = '0x280224bc0cCBDbB8780C65B360fc455EcFeAd620';
        const signer = provider.getSigner();
        const MyAddr1 = '0xA6BDB0051505042D4428b4B6C7cA5E7dac29553a';
        const MyAddr2 = '0xc99d7c0D4B8D1e8A1dbCB608D4254cb466720F3f';
        const ddsAddr = '0x8C0813590b65952197F5654ec953Ccc601725bEe';
        const ddsABI = [
            "function get(string calldata _domain, string calldata _key) external view returns (bytes memory)",
            "function toAddress(bytes memory b) external pure returns (address addr)"
        ]
        const dds = new ethers.Contract(ddsAddr, ddsABI, signer);
        const DDS = await dds.get('ISOTOP', 'BEE_FACTORY_ADDRESS');
        const factorycontractaddr = await dds.toAddress(DDS);

        console.log("factory contract addr  is :  ",factorycontractaddr);

        //  dds over.

        const factoryABI = [
            " function deployContract(string) external returns (address)",
            " function getContractsDeployed() external view returns (address[])"
        ];
        const Factory = new ethers.Contract(factorycontractaddr, factoryABI, signer);
        const IISOTOPABI = [
            "function mint(address, uint256) external",
            "function balanceOf(address) external view returns (uint256)",
            "function totalSupply() external view returns (uint256)",
           
            "function transferFrom(address from,address to,uint256 tokenId,uint256 chainId) external",
            "function ownerOf(uint256 ) external view returns (address)",
            "function setBaseURI(string ) external",
            "event transferFrom( address , address , uint256)",
            "event baseURIChanged(string uri)",
            "event tokenAcrossChainTransfered(uint256,address,uint256,address,uint256)",
            "event transferTokenAcrossChain(address from,uint256 chainId,address to,uint256 tokenId,uint256 totalSupply,string baseURI)",
             "function transferAcrossChain(uint256 chainId,address from,address to,uint256 tokenId,uint256 totalSupply) external"
        ];
        console.log("开始部署子合约");
        const IISTOP = await Factory.deployContract('ISOTOP1013');      //部署NFT子合约
        await IISTOP.wait();
        console.log("子合约部署成功");

        let IISOTOPAddrArray = new Array();
        IISOTOPAddrArray = await Factory.getContractsDeployed();
        const IISOTOPAddr = IISOTOPAddrArray[IISOTOPAddrArray.length - 1];  //获取子合约地址

        console.log("1. 查询子合约地址");

        console.log("the last IISOTOPAddr contract is ", IISOTOPAddr);
        let log = "IISOTOP1014Addr is :" + IISOTOPAddr + "\n";
        setHex(log);

        const IISOTOP = new ethers.Contract(IISOTOPAddr, IISOTOPABI, signer);


        console.log("\n1. 读取NFT数量");
        let balanceNFT = await IISOTOP.balanceOf(account);
        console.log("Mint前NFT数量", balanceNFT);
        log = log + "1. befor mint : " + balanceNFT + "\n";
        setHex(log);

        log = log + "2. start mint,please wait ....." + "\n";
        setHex(log);

        console.log("\n2. mint");
        let waiter = await IISOTOP.mint(account, 10);
        await waiter.wait();



        console.log("\n3. mint后读取NFT数量");
        balanceNFT = await IISOTOP.balanceOf(account);
        console.log("Mint后NFT数量", balanceNFT);

        log = log + "3. after mint : " + balanceNFT + "\n";
        setHex(log);

        






    }





    return (
        <Flex justify="center" align="center" hight="100vh" paddingBottom="150px">
            <Box width="800px" >

                <Text fontSize="48px" textShadow="0 5px #000000" >IISOTOP TESTER</Text>
                <Text fontSize="30px" letterSpacing="-5.5%" fontFamily="VT323" textShadow="0 2px #000000">Test IISOTOP Contract . </Text>
                {isConnected ? (
                    <div>


                        <Flex justify='space-between' align="center">


                            <Textarea
                                readOnly
                                fontFamily="inherit"
                                width="800px"
                                height="450px"
                                marginTop="10px"
                                padding="15px"
                                marginLeft="30px"
                                type="text"
                                value={hex}

                                placeholder=" "
                                _placeholder={{ color: 'inherit' }}
                            />

                        </Flex>





                        <Flex align="center" justify="center">

                            <Button
                                backgroundColor="#D6517D"
                                borderRadius="5px"
                                boxShadow="0px 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="inherit"
                                padding="15px"
                                marginTop="30px" onClick={clickregister}>Start Test</Button>
                        </Flex>
                    </div>


                ) : (
                    <p>You must be connect to calculate.</p>
                )}
            </Box>


        </Flex>

    )
};

export default Register;