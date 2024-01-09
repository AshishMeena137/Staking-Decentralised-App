import { useContext,useRef } from "react";
import {ethers} from "ethers"
import Web3Context from "../../context/Web3Context";
import Button from "../Button/Button";
import { toast } from "react-hot-toast";

const BuyToken =()=>{
    const {stakingContract}=useContext(Web3Context);
    const buyTokenRef = useRef();
    const buyTokenPriceRef = useRef();
    console.log("Money",buyTokenPriceRef);
    console.log("approved: ",buyTokenRef);
    console.log("stakingContract: ",stakingContract);
    const buyToken = async(e)=>{
      e.preventDefault();
      const amount = buyTokenRef.current.value.trim();
      const money = buyTokenPriceRef.current.value.trim();
      console.log("amount: ",amount);
      if(isNaN(amount) || amount<=0){
       console.error("Please enter a valid positive number");
       return;
      }
      const amountToSend = ethers.parseUnits(amount,18).toString();
      const moneyinwei = ethers.parseEther(money,18).toString();
      console.log("amountTo send: ",amountToSend);
      try{
       const transaction = await stakingContract.buyToken(amount, {value: moneyinwei});
       await toast.promise(transaction.wait(),
       {
         loading: "Transaction is pending...",
         success: 'Transaction successful 👌',
         error: 'Transaction failed 🤯'
       });
       buyTokenRef.current.value = "";
       buyTokenPriceRef.current.value = "";
       // const receipt = await transaction.wait();
       // if (receipt.status === 1) {
       //     toast.success("Transaction is successful")
       //     buyTokenRef.current.value = "";
       //   } else {
       //       toast.error("Transaction failed. Please try again.")
       //   }
       } catch (error) {
         toast.error("Token Buy Failed");
         console.error(error.message)
       }
     };
    return (
     <div>
        <form onSubmit={buyToken} className="token-amount-form">
           <label className="token-input-label">Token Buy:</label>
           <input type="text" ref={buyTokenRef} />
           <label className="token-input-label">Token Money:</label>
           <input type="text" ref={buyTokenPriceRef} />
           <Button onClick={buyToken} type="submit" label="Token Buy" />
         </form>
    </div>
    )
   }
   export default BuyToken;