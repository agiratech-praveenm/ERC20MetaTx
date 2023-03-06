import { ethers } from 'ethers';


const QUICKNODE_ENDPOINT = process.env.REACT_APP_QUICKNODE_URL;

function createProvider() {  
  return new ethers.providers.JsonRpcProvider(QUICKNODE_ENDPOINT, 80001);
}

export default createProvider;