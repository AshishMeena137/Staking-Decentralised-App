import {ethers,Contract} from "ethers";
import stakingAbi from "../ABI/stakingAbi.json"
import stakeTokenAbi from "../ABI/stakeTokenAbi.json";


export const connectWallet = async()=>{
    try{
       let [signer,provider,selectedAccount,stakingContract,stakeTokenContract,chainId]=[null,null,null,null,null];
       if(window.ethereum===null){
          throw new Error("Metamsk is not installed");
       }
       const accounts = await window.ethereum.request({
        method:'eth_requestAccounts'
       })

       let chainIdHex= await window.ethereum.request({
        method:'eth_chainId'
       })
       chainId= parseInt(chainIdHex,16)
       
       selectedAccount =accounts[0];
       if(!selectedAccount){
        throw new Error("No ethereum accounts available")
       } 

       provider = new ethers.BrowserProvider(window.ethereum);
       signer = await provider.getSigner();

       const stakingContractAddress="0x97ED08eae68D63FB711c53f2504164a40ce588C8"
       const stakeTokenContractAddress="0x4D20c7C9d2A7308F76964eB30A7a1bcfE2f51F89"

       stakingContract= new Contract(stakingContractAddress,stakingAbi,signer);
       stakeTokenContract=new Contract(stakeTokenContractAddress,stakeTokenAbi,signer);

       return {provider,selectedAccount,stakeTokenContract,stakingContract,chainId}

    }catch(error){
        console.error(error);
        throw error
    }
    
}