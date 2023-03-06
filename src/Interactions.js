import {React, useContext, useState} from 'react'
import styles from './Wallet.module.css';
import Web3 from 'web3';
import createFowarder from './metatx/forwarder.js';
import { signMetaTxRequest } from './metatx/signer.js';
import { EthereumContext } from './metatx/context.js';
import createProvider from './metatx/provider.js';
import createInstance  from './metatx/cherry.js';
import { ethers } from 'ethers';

const Interactions =(props)=>{

    const provider = createProvider();
    const cherry = createInstance(provider);
    
    
    const [transferHash, setTransferHash] = useState(null);
    

    async function sendMetaTx(cherry, provider, signer, receiver, amount) {
        console.log(`Sending ${amount} cherry tokens to ${receiver}`);
        const url = process.env.REACT_APP_WEBHOOK_URL;
        if (!url) throw new Error(`Missing relayer url`);
      
        const forwarder = createFowarder(provider);
        const from = await signer.getAddress();
        const data = cherry.interface.encodeFunctionData('transfer', [receiver,amount]);
        const to = cherry.address;
        
        const request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });
      
        return fetch(url, {
          method: 'POST',
          body: JSON.stringify(request),
          headers: { 'Content-Type': 'application/json' },
        });
      }

      async function sendAmount(cherry, provider, receiver, amount) {  
        if (!receiver) throw new Error(`receiver cannot be empty`);
        if(!amount) throw new Error('amount cannot be empty')
        if (!window.ethereum) throw new Error(`User wallet not found`);
      
        await window.ethereum.enable();
        const userProvider = new ethers.providers.Web3Provider(window.ethereum);
        const userNetwork = await userProvider.getNetwork();
        if (userNetwork.chainId !== 80001) throw new Error(`Please switch to Mumbai for signing`);
      
        const signer = userProvider.getSigner();
        const from = await signer.getAddress();
        // const balance = await provider.getBalance(from);
        
        // const canSendTx = balance.gt(1e15);
        // if (canSendTx) return sendTx(registry.connect(signer), name);
        // else return sendMetaTx(registry, provider, signer, name);
      
        const canSendTx = 0;
        if (canSendTx == 0) return sendMetaTx(cherry, provider, signer, receiver, amount);
        
      }

    

    const transferHandler = async (e) =>{
        e.preventDefault();
        let transferAmount = e.target.sendAmount.value;
        let amountInWei = Web3.utils.toWei(transferAmount, 'ether');
        let receiverAddress = e.target.receiverAddress.value;

        let txt = await sendAmount(cherry, provider, receiverAddress, amountInWei);

        setTransferHash('Amount Sent!!');
    }
    return (
        <div className={styles.interactionsCard}>
            <form onSubmit={transferHandler}>
                <h1> Transfer Coins </h1>
                <h2>Receiver Address</h2>
                <input type='text' id='receiverAddress' className={styles.addressInput}/>
                <p> Send Amount </p>
                <input type='text' id='sendAmount' min='0' className={styles.amountInput}/>
                <button type='submit' className={styles.button6}>Send</button>
                <div>
                    <h2>Transaction Hash:</h2>
                    {transferHash}
                </div>
            </form>
        </div>
    )
}

export default Interactions;