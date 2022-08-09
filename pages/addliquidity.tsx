import React from 'react';
// import Popup from '../components/popup';
import { ModuleType } from '../types/module.type';
import { useEffect, useState } from 'react';
import { Token } from '../types/token.type';
import {
  connectWallet,
  getBalance,
  getChainId,
  getEthereum,
  getProvider,
  getWalletAddress,
} from '../services/wallet-service';
import { toast } from 'react-toastify';
import { getNetworkCurrency, getNetworkName, getNetworkTokens } from '../constants/network-id';
import { ETH_TOKENS } from '../constants/tokens';
import Select from 'react-select';

export default function AddliquidityModule({
  setModule,
  account,
}: {
  setModule: (module: ModuleType) => void;
  account: string;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [tokenAllowances, setTokenAllowances] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [addliquidityLoading, setAddliquidityLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});

  const [token1, setToken1] = useState();
  const [token2, setToken2] = useState();
  const [amountToken1, setAmountToken1] = useState<number | null>(null);
  const [amountToken2, setAmountToken2] = useState<number | null>(null);

  const getSelectTokens1 = (e) => {
    if (e !== null) {
      if (e.address !== token2) {
        setToken1(e.address);
        console.log(e.address);
      }
    }
  };

  const getSelectTokens2 = (e) => {
    if (e !== null) {
      if (e.address !== token1) {
        setToken2(e.address);
        console.log(e.address);
      }
    }
  };

  const loadAccountData = async () => {
    const addr = getWalletAddress();
    setAddress(addr);
    const chainId = await getChainId();
    setNetwork(chainId);
  };

  const handleButton = () => {
    console.log(token1, token2, amountToken1, amountToken2);
  };

  useEffect(() => {
    loadAccountData();
    const handleAccountChange = (addresses: string[]) => {
      setAddress(addresses[0]);

      loadAccountData();
    };

    const handleNetworkChange = (networkId: string) => {
      setNetwork(networkId);

      loadAccountData();
    };

    getEthereum()?.on('accountsChanged', handleAccountChange);

    getEthereum()?.on('chainChanged', handleNetworkChange);
  }, []);

  // const [isShown, setIsShown] = useState(false);

  // const handleClick = (event: any) => {
  //   // 👇️ toggle shown state
  //   setIsShown((current) => !current);
  // };

  let option = [{ value: '', label: '', address: '' }];
  ETH_TOKENS.map((e) =>
    option.push({
      value: e.symbol,
      label: (
        <div>
          <img src={e.imageUrl} height="30px" width="30px" />
          {e.symbol}
        </div>
      ),
      address: e.address,
    }),
  );
  option.shift();

  const addTokenToWallet = async (token: Token) => {
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: token.address, // The address that the token is at.
            symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: token.decimals, // The number of decimals in the token
            image: token.imageUrl, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-bgtheme py-10 flex-column w-auto grid">
      <div className="justify-self-center bg-blueWidget rounded-3xl w-5/12">
        <div>{address}</div>
        <div className="rounded-lg  font-bold">
          <div>
            <div className="">
              <h1 className="px-5 text-textwhite h-12">Addquidity</h1>
            </div>

            <div className="flex-column w-auto grid">
              <div className="bg-textwhite rounded-lg w-10/12 justify-self-center">
                <div className="grid grid-cols-5 text-textblack ">
                  <input
                    className="col-span-4 h-20  rounded-lg "
                    value={amountToken1}
                    onChange={(e) => setAmountToken1(e.target.value)}
                  ></input>
                  <div className="grid grid-cols-6 col-span-1">
                    {/* {here} */}
                    <Select
                      defaultValue={token1}
                      onChange={(e) => {
                        getSelectTokens1(e);
                      }}
                      options={option}
                      autoFocus
                      placeholder="Select Token 1"
                      isClearable={true}
                      className="col-span-6 w-auto h-auto cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className=" flex-column w-auto grid text-textblack h-12">
                <button className="">+</button>
              </div>

              {/* <div className="">{tokenBalances[tokenPair.token2.symbol] || 0}</div> */}

              <div className="bg-textwhite rounded-lg w-10/12 justify-self-center">
                <div className="grid grid-cols-5 text-textblack ">
                  <input
                    className="col-span-4 h-20  rounded-lg "
                    value={amountToken2}
                    onChange={(e) => setAmountToken2(e.target.value)}
                  ></input>
                  <div className="grid grid-cols-6 col-span-1">
                    <Select
                      defaultValue={token2}
                      onChange={(e) => {
                        getSelectTokens2(e);
                      }}
                      options={option}
                      autoFocus
                      placeholder="Select Token 2"
                      isClearable={true}
                      className="col-span-6 w-auto h-auto cursor-pointer"
                    />

                    {/* <div className="col-span-2">˅</div> */}
                  </div>
                </div>
              </div>
              <div className="py-10 flex-column w-auto grid text-textblack ">
                <button
                  className="justify-self-center w-32 h-10 rounded-full bg-gradient-to-r
                  from-blueswapdark  to-blueswapbutton 
       text-textinvalid outline outline-offset-1 outline-textinvalid drop-shadow-xl"
                  onClick={handleButton}
                >
                  Invalid Pair
                </button>
              </div>
              <div className="py-2"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-10"></div>
      <div className="py-10"></div>
      <div className="py-10"></div>
      <div className="py-10"></div>
      {/* {isShown && <div></div>}
      {isShown && <Popup />} */}
    </div>
  );
}
