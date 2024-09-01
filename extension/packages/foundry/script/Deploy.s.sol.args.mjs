export const deploymentsScriptsImports = `import "../contracts/NFTContract.sol";`;
export const deploymentsLogic = `

    vm.startBroadcast(deployerPrivateKey);

    NFTContarct nftContract = new NFTContract();
    console.logString(string.concat("NFTContract deployed at: ", vm.toString(address(nftContract))));

    vm.stopBroadcast();

`;
