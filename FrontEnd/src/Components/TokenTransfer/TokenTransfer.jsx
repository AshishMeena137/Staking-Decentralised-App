import { useContext,useRef } from "react";
import {ethers} from "ethers"
import Web3Context from "../../context/Web3Context";
import Button from "../Button/Button";
import { toast } from "react-hot-toast";

const TokenTransfer =()=>{
 const {stakeTokenContract,stakingContract}=useContext(Web3Context);
 const ReceiverAddressRef = useRef();
 const TokenTransferRef = useRef();

 console.log("approved: ",TokenTransferRef);
 console.log("StakeToken: ",stakeTokenContract,"stakingContract: ",stakingContract);

 const transferToken = async(e)=>{
   e.preventDefault();
   
   const amount = TokenTransferRef.current.value.trim();
   const to = ReceiverAddressRef.current.value.trim();
   console.log("amount: ",amount);
   console.log("to",to);

   if(isNaN(amount) || amount<=0 || isNaN(to)){
    console.error("Please enter a valid positive number and address");
    return;
   }

   const amountToSend = ethers.parseUnits(amount,18).toString();
   console.log("amountTo send: ",amountToSend);

   try{

    const transaction = await stakeTokenContract.transfer(to,amountToSend);

    await toast.promise(transaction.wait(),
    {
      loading: "Transaction is pending...",
      success: 'Transaction successful 👌',
      error: 'Transaction failed 🤯'
    });

    TokenTransferRef.current.value = "";
    ReceiverAddressRef.current.value = "";

    } catch (error) {

      toast.error("Token Transfer Failed");
      console.error(error.message);
      
    }
  };
 return (
  <div>
     <form onSubmit={transferToken} className="token-amount-form">

        <label className="token-input-label">Token Transfer:</label>
        <input type="text" ref={TokenTransferRef} required/>

        <label className="token-input-label">Receiver Address:</label>
        <input type="text" ref={ReceiverAddressRef} required/>

        <Button onClick={transferToken} type="submit" label="Token Transfer" />
      </form>
 </div>
 )
}
export default TokenTransfer;