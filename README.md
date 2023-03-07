MetaTransaction in ERC20 TokenTransfer using Openzeppelin Defender:
===================================================================

Contract end work:
====================
   1. In your smart contract import ERC2771Context and MinimalForwarder from openzeppelin node modules. Replace msg.sender with _msgSender in the functions where metatransactions needs to be implemented. In our case we deployed an ERC20 token contract where we used _msgSender() in transfer function. (Cherry token: https://mumbai.polygonscan.com/address/0x32767eafae266f65b3cafaea58a54a37c45595c6#code) 
    
   2. While deploying the contract make sure you pass the MinimalForwarder contract address in the constructor.
   3. Put your contract address in the .env's REACT_APP_CONTRACT_ADDRESS


Openzeppelin Defender end work:
===============================

  1. Go to Openzeppelin Defender website and create your account. Then go to relayer section and create a relay. We have created a Relayer on Polygon Mumbai testnet and sent some MATIC test tokens to this relayer address which will be used for gas fee.

  2. Create an autotask using the Autotask section in Openzeppelin Defender page. While creating Autotask make sure that you select "webhook" and select the correct relayer name so that this autotask will be connected to your relayer.

  3. While creating the Autotask it will show you a code section with a sample code. You can change this code right now or you can change it later by selecting the settings and clicking on edit code option in the Autotask dashboard.
    We have put a file named "Autotask code" in this repo. Copy and paste that code in the Autotask code section. If required replace the minimalforwarder abi and address. We have used Cherry token contract address in the code. If you wish to use your own contract you can replace this too.

  4. Once the autotask is created you will be able to copy the autotask webhook URL from the autotask dashboard. Paste this in the react app .env's REACT_APP_WEBHOOK_URL


  Integration with Frontend:
  ===========================

    1. Integration with frontend varies depending on the frontend you build. I have created an integration based on my requirement which is for tokentransfer.
    2. However you will almost need all the files in metatx folder especially signer.js which is where the core logic of metatransaction is present.



    Original Videos I used for reference:

    ERC20 react app UI: https://www.youtube.com/watch?v=ipKCKB3PCpk
    Openzeppelin Defender: https://www.youtube.com/watch?v=mhAUmULLV44

If you face any uncaught promise error while running the app, try changing the REACT_APP_QUICKNODE_URL and restart the app.
