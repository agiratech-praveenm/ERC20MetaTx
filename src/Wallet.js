import {React, useState, useEffect} from 'react';
import {ethers} from 'ethers';
// import Web3 from 'web3'; 
import styles from './Wallet.module.css';
import simple_token_abi from './Contracts/simple_token_abi.json';
import Interactions from './Interactions';

const Wallet =()=>{
    
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; //Mumbai Berry token
    console.log("contractAddress: ",contractAddress);

    const [tokenName, setTokenName] = useState("Token");
    const [connButtonText, setconnButtonText] = useState("Click Here to Connect Wallet");
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [balance,setBalance] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer,setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    
    const connectWalletHandler = () => {
        
        if(window.ethereum && window.ethereum.isMetaMask){
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result =>{
                accountChangedHandler(result[0]);
                setconnButtonText('Wallet Connected');
            })
            .catch(error => {
                setErrorMessage(error.message)
            })
        } else{
            alert("Need to install Metamask")
        }
    }

    const accountChangedHandler = (newAddress) =>{
      setDefaultAccount(newAddress);
      updateEthers();
    }

    const updateEthers=()=>{
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        let tempSigner = tempProvider.getSigner();
        let tempContract = new ethers.Contract(contractAddress, simple_token_abi, tempSigner);
        
        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
    }

    useEffect( ()=>{
       if(contract != null){
        updateBalance();
        updateTokenName();  
       }
    },[contract])

    const updateBalance = async()=>{
        let balanceBigN = await contract.balanceOf(defaultAccount);
        console.log("BalanceBigN:",balanceBigN)
        let balanceNumber = balanceBigN.toString();
        let decimals = await contract.decimals();
        let tokenBalance = balanceNumber/Math.pow(10,decimals);
        console.log("Berry: ",tokenBalance)
        setBalance(tokenBalance);
    }

    const updateTokenName = async()=>{
        setTokenName(await contract.name());
    }

   return (
     <div>
        <h1> {tokenName + "ERC20 Wallet"}</h1>
        <button className={styles.button6} onClick = {connectWalletHandler}>{connButtonText}</button>
        <div className= {styles.walletCard}>
            <div>
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div>
                <h3>{tokenName} Balance: {balance}</h3>
            </div>
            {errorMessage}
        </div>
        <Interactions contract={contract}/>
     </div>
   );
}

export default Wallet;