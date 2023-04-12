/* eslint-disable */

import { useState, useEffect, React } from 'react';
import { useSelector } from 'react-redux';
import {
  FilterList,
  FilterListOff
} from '@mui/icons-material';
import { Box, Button, Chip, List, Tooltip } from '@mui/material';
import format from 'date-fns/format';
import Loader from '../components/Loader';
import MaterialTable from 'material-table';
import Web3 from "web3";
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import contractABI from '../contracts/abi.json';
import { apiGet } from "../utils/axios";
import axios from 'axios';

const ipfsClient = require('ipfs-http-client');

function ConnectionToMetamask() {
  const [blockChainData, setBlockChainData] = useState([]);
  const { user } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");

  const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
  const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET_KEY
  const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
  const IPFS_CID = 'QmZGnarPrWWZnFkLPnoyswW6nSfYpCqdnTmRNd2ZxJ54ek';
  const ipfs = ipfsClient.create({
    url: "https://ipfs.infura.io:3001/api/v0",
    headers: {
      authorization,
    },
  });
  console.log('ipfs',ipfs)
  const [data, setData] = useState(null);

  useEffect(() =>  {
    getblockchainData();
 }, [loading]);


 const getblockchainData = async () => {
   const res = await apiGet(`blockchain/getClientDetails?username=${user.username}`, user.token);
   setLoading(true);
   setBlockChainData(res.rows);

 }
 // console.log('blockChainData',blockChainData)
  
  useEffect(() => {
    async function fetchData() {
      try {
       
      const res = await axios.get(`https://ipfs.io/ipfs/${process.env.ipfhhash}`)
      console.log(res.data);

      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: projectId,
        }
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, // very important
      network: process.env.projectname,
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal)
  }, [])

  async function connectWallet() {
    const provider = await web3Modal.connect();
    setAddress(provider.selectedAddress);
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    // console.log('accounts',accounts);
    setWallet(provider.selectedAddress)
    await web3Modal.clearCachedProvider();
      // window.location.reload();
  }

  useEffect(() => {
    async function initContract() {
      const web3 = new Web3(window.ethereum);
      // console.log('web3',web3)
      let contract = new web3.eth.Contract(
        contractABI,
        process.env.REACT_APP_ContractAddress
      );
      setContract(contract);
      // console.log('contract', contract.methods)
      // // console.log('contract', contract.methods.setClient(walletAddress, ipfsHash).send(),process.env.REACT_APP_ContractAddress)
    }

    initContract();
  }, []);
  

  return (
    <>
  <div>
        <button onClick={connectWallet}>Connect Wallet</button>
        {address && <p>Selected Address: {address}</p>}
      </div>
    </>
  );
}

export default ConnectionToMetamask;
