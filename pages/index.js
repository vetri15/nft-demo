import { useState } from 'react'
import {NFTCard} from "./components/nftCard"
import Pagination from './pagination'
import ALCHEMY_API_KEY from '../apiconfig';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection]=useState(false);
  let [currentPageStart, setCurrentPageStart]=useState(0);
  let [totalNFTs , setTotalNFTs] = useState(0);

  const fetchNFTs = async() => {
    let nfts;
    console.log("fetching nfts");
    const api_key = ALCHEMY_API_KEY;
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;

    if (!collection.length) {
      let requestOptions = {
        method: 'GET'
      };
     
      const fetchURL = `${baseURL}?owner=${wallet}`;
  
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollectionTotal = async () => {
    if (collection.length) {
      let requestOptions = {
        method: 'GET'
      };
      const api_key = ALCHEMY_API_KEY;
      const fetchURL = `https://eth-mainnet.g.alchemy.com/nft/v3/${api_key}/getContractMetadata?contractAddress=${collection}`;
      console.log(fetchURL);
      const nftMetadata = await fetch(fetchURL, requestOptions).then(data => data.json())
      console.log(nftMetadata.totalSupply," is the total supply");
      return nftMetadata.totalSupply;
    }
  }


  const fetchNFTsForCollection = async (startToken) => {
    if (collection.length) {
      let requestOptions = {
        method: 'GET'
      };
      console.log("fetching with ",startToken);
      const api_key = ALCHEMY_API_KEY;
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForContract/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&limit=10&startToken=${(startToken*10)+1}`;
      console.log(fetchURL);
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
      setTotalNFTs(await fetchNFTsForCollectionTotal());
      setCurrentPageStart(startToken);
    }
  }

  const handleSelectedPage = async (startPage) => {
    if(startPage < 0 || startPage > (totalNFTs/10)){
      return;
    }
    setCurrentPageStart(startPage);
    fetchNFTsForCollection(startPage);
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection}  className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection(0)
            }else fetchNFTs()
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard key={nft.id.tokenId} nft={nft}></NFTCard>
            )
          })
        }
      </div>
      {NFTs.length > 0 && (
      <Pagination selectAPage={handleSelectedPage} currentPageStart={currentPageStart} totalNFTs={totalNFTs} />
      )}
      
    </div>
  )
}

export default Home