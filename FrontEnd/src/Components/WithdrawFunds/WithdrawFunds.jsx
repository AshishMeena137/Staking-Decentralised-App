import { useContext } from "react";
import Web3Context from "../../context/Web3Context";
import StakingContext from "../../context/StakingContext";
import Button from "../../Components/Button/Button";
import { toast } from "react-hot-toast";
import "../Withdraw/Withdraw.css"

const WithdrawFunds = () => {
  const { stakingContract } = useContext(Web3Context);
  const { isReload, setIsReload } = useContext(StakingContext);


  const WithdrawFundsBalance = async (e) => {
    e.preventDefault();
    try {
      const transaction = await stakingContract.withdrawEthers()
      await toast.promise(transaction.wait(),
        {
          loading: "Transaction is pending...",
          success: 'Transaction successful 👌',
          error: 'Transaction failed 🤯'
        });
      setIsReload(!isReload);
      
    } catch (error) {
      toast.error("Withdraw Failed");
      console.error(error.message);
    }
  };
  return (
    <form className="withdraw-form" onSubmit={WithdrawFundsBalance}>
      <label>Withdraw Balance:</label>
      <Button
        onClick={WithdrawFundsBalance}
        type="submit"
        label="Withdraw Balance"
      />
    </form>
  )
}
export default WithdrawFunds;