import { Injectable } from '@angular/core';
import { ethers, BigNumber } from 'ethers';
import { WindowRefService } from './window-ref.service';
import { Router } from '@angular/router';
import { GetDataService } from './get-data.service';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PricingApiService } from './pricing-api.service';
import { ToastrService } from 'ngx-toastr';
import {
  exchangeToken,
  removefromsale,
  SignBuyerOrder,
  SignSellOrder,
  SignSellOrder01,
} from '../model/signBuyerOrder';

const nft721Abi = require('./../../assets/abis/nft721.json');
const nft1155Abi = require('./../../assets/abis/nft1155.json');
const exchangeV1Abi = require('./../../assets/abis/ExchangeV1.json');
const erc20Abi = require('./../../assets/abis/erc20.json');
const config = require('./../../assets/configFiles/tokenAddress.json');

//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
  infuraId: 'b0287acccb124ceb8306f3192f9e9c04',
});

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private provider: any;
  private signer: any;
  userAddress: string = '';
  nft721Contract: any;
  nft1155Contract: any;
  exchangeAbiContract: any;
  private walletDetails$: BehaviorSubject<any> = new BehaviorSubject(null);

  nft721Address = '0x5490ba86C008E225a3C743DAe2f457D85f6Fa36d';
  nft1155Address = '0xCf63B0eEC837225741f7aa92746Fd28b29Aeec6D';
  exchangeV1Address = '0xF5cfd3d3Fa685b2b76C65cf62ccc0c34285a228e';
  transaferProxy = '0x7362143D37b0626B74F07c42fE58D02Fa1aE23ae';
  erc20TransferProxy = '0x690F7Fc4FE8a182D1C96a26Ef1151716a89ec5cA';

  // mew wallet
  //   mew = mewModule();
  //   onboard = Onboard({
  //   wallets: [this.mew],
  //   chains: []
  // });

  chainId: any;


  isAcountChangedSub = new Subject();
  isRegisterd = new Subject();

  constructor(
    private windowRef: WindowRefService,
    private router: Router,
    private getDataService: GetDataService,
    private pricingDetails: PricingApiService,
    private toastr: ToastrService
  ) {
    this.initializeAddress(1);
  }

  initializeAddress(chainId: any) {
    this.nft721Address = config[environment.configFile][chainId].nfterc721;
    this.nft1155Address = config[environment.configFile][chainId].nfterc1155;
    this.exchangeV1Address =
      config[environment.configFile][chainId].exchangeAddress;
    this.transaferProxy = config[environment.configFile][chainId].transferProxy;
    this.erc20TransferProxy =
      config[environment.configFile][chainId].erc20TransferProxy;
  }

  async connectwalletMew() {
    // const connectedWallets = await this.onboard.connectWallet()
  }

  getWalletObs(): Observable<any> {
    return this.walletDetails$.asObservable();
  }

  setWalletObs(profile: any) {
    this.walletDetails$.next(profile);
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  /** Wallet Types
   * 1 : metamask
   * 2 : binanacechain
   * 3 :
   */

  async connectAccountMetamask(originpage: number) {
    if (typeof this.windowRef.nativeWindow.ethereum !== undefined) {
      await this.windowRef.nativeWindow.ethereum.enable();
      let provider01 = this.windowRef.nativeWindow.ethereum;
      // edge case if MM and CBW are both installed
      if (this.windowRef.nativeWindow.ethereum.providers?.length) {
        this.windowRef.nativeWindow.ethereum.providers.forEach(async (p) => {

          if (p.isMetaMask) provider01 = p;
        });
      }
      this.provider = new ethers.providers.Web3Provider(provider01);

      var address = '';
      address = await this.getAccountAddress();
      localStorage.setItem('wallet', '1');
      // if(originpage==1)
      // {
      //   location.href="/";
      // }
      let that = this;
      this.windowRef.nativeWindow.ethereum.on(
        'accountsChanged',
        async function (accounts: any) {
          var address = await that.signer.getAddress();
          that.setAddress(address);
          that.isAcountChangedSub.next(1);
        }
      );

      this.windowRef.nativeWindow.ethereum.on(
        'networkChanged',
        async function (accounts: any) {
          that.connectAccountMetamask(originpage);
        }
      );

      return address;
    }
    return '';
  }

  async connectAccountWalletConnect(originpage: number) {
    await provider
      .enable()
      .then(() => console.log('first call resolved'))
      .catch(() => provider.disconnect());

    this.provider = new ethers.providers.Web3Provider(provider);
    var address = '';
    await this.getAccountAddress().then((result) => (address = result));
    localStorage.setItem('wallet', '2');

    provider.on('accountsChanged', async (accounts: string[]) => {
      var address = await this.signer.getAddress();
      this.setAddress(address);
    });

    // Subscribe to session disconnection
    provider.on('disconnect', (code: number, reason: string) => {
      location.reload();
    });

    // Subscribe to session disconnection
    provider.on('networkChanged', (code: number, reason: string) => {
      this.connectAccountWalletConnect(originpage);
    });

    return address;
  }

  switchNetwork(chainId: any) {
    let sed = new Promise((resolve, reject) => {
      this.windowRef.nativeWindow.ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: chainId, //"0x13881"// chainId in hexadecimal, decimal equivalent is 80001
            },
          ],
        })
        .then((success: any) => {
          resolve('doneeeeee');
        })
        .catch((err: any) => {
          reject('errrrrrrrrr');
        });
    });

    return sed;
  }

  async getAccountAddress() {
    this.signer = this.provider.getSigner();
    var address = await this.signer.getAddress();
    localStorage.setItem('address', address);
    this.setAddress(address);

    return address;
  }

  async getConnectedNetworkId() {
    let network: any;
    try {
      network = await this.provider.getNetwork();
    } catch (error) {
    }
    return network.chainId;
  }

  async createContract(chainIdVal: number) {
    let network;
    try {
      network = await this.provider.getNetwork();
    } catch {
      return false;
    }
    this.chainId = config[environment.configFile][chainIdVal].chainId;
    
    if (
      network &&
      network.chainId == config[environment.configFile][chainIdVal].chainId
    ) {
      this.nft721Contract = new ethers.Contract(
        config[environment.configFile][chainIdVal].nfterc721,
        nft721Abi,
        this.signer
      );
      this.nft1155Contract = new ethers.Contract(
        config[environment.configFile][chainIdVal].nfterc1155,
        nft1155Abi,
        this.signer
      );
      this.exchangeAbiContract = new ethers.Contract(
        config[environment.configFile][chainIdVal].exchangeAddress,
        exchangeV1Abi,
        this.signer
      );
      debugger
      this.initializeAddress(chainIdVal);
      return true;
    }
    // else if( network &&
    //   network.chainId != config[environment.configFile][chainIdVal].chainId){
    //     try{
    //     this.switchNetwork(config[environment.configFile][chainIdVal].chainId);
    //     }
    //     catch(e)
    //     {
    //       return false;
    //     }
    //     return true;
    // }
     else {
       
      return false;
    }
  }

  getAddressSingle(chainIdVal: number) {
    return config[environment.configFile][chainIdVal].nfterc721;
  }

  getAddressMultiple(chainIdVal: number) {
    return config[environment.configFile][chainIdVal].nfterc1155;
  }

  getAddressWeth(chainIdVal: number) {
    return config[environment.configFile][chainIdVal].WETH;
  }

  async setAddress(address: string) {
    this.userAddress = address;
    this.setWalletObs(this.userAddress);
  }

  async checkLoggedInUser() {
    if (
      localStorage.getItem('address') !== undefined &&
      localStorage.getItem('address') !== null &&
      localStorage.getItem('address')
    ) {
      this.setAddress(localStorage.getItem('address') ?? '');
      if (
        localStorage.getItem('wallet') !== undefined &&
        localStorage.getItem('wallet') !== null &&
        localStorage.getItem('wallet')
      ) {
        if (localStorage.getItem('wallet') == '1') {
          await this.connectAccountMetamask(0);
        } else if (localStorage.getItem('wallet') == '2') {
          await this.connectAccountWalletConnect(0);
        }
      }
    }
  }

  async getBalance() {
    if (this.provider !== undefined) {
      var a = await this.provider.getBalance(this.userAddress);
      return a;
    } else {
      return 0;
    }
  }

  checkValidAddress(address: any) {
    return ethers.utils.isAddress(address);
  }

  async signMsgForRegister(address: any) {
    var message = `Welcome to NFT!\n\n Click \"Sign\" to sign in. No password needed!\n\n I accept the NFT Terms of Service: https://moonsea.io//tos\n\n Wallet address:\n ${address}`;
    var signature = '';
    try {
      signature = await this.signer.signMessage(message);
      return signature;
    } catch (e) {
      return false;
    }
  }

  async signMsgForUpdateProfile(formData: any) {
    var message = `I would like to update preferences. Username is ${formData.name}, picture is ${formData.imagePath}, short url is ${formData.customUrl}, cover is null, bio is '${formData.customUrl}', website is ${formData.portfolioWebsite}, email id is ${formData.emailId}`;
    var signature = '';
    try {
      signature = await this.signer.signMessage(message);
      return signature;
    } catch (e) {
      return false;
    }
  }

  
  

  mintTokenErc721(nftId: number,nftAddress:any) {
    var promise = new Promise((resolve, reject) => {

      this.nft721Contract = new ethers.Contract(
        nftAddress,
        nft721Abi,
        this.signer
      );


      this.nft721Contract
        .mint(nftId.toString(), environment.tockenUri+nftId.toString())
        .then(function (hash: any) {
          resolve({ hash: hash.hash, status: true });
        })
        .catch(function (e: any) {
          reject(e);
        });
    });
    return promise;
  }

  mintTokenErc1155(
    nftId: number,
    noOfCopies: number,
    nftAddress:any
  ) {
    var promise = new Promise((resolve, reject) => {
      this.nft1155Contract = new ethers.Contract(
        nftAddress,
        nft1155Abi,
        this.signer
      );
      this.nft1155Contract
        .mint(nftId,  noOfCopies, environment.tockenUri)
        .then(function (hash: any) {
          resolve({ hash: hash.hash, status: true });
        })
        .catch(function (e: any) {
          console.log(e);

          reject({ hash: '', status: false });
        });
    });
    return promise;
  }

  setApprovalForAll(type: boolean, blockchainId: any) {

    debugger

    var contractObj: any;
    if (type) {
      contractObj = new ethers.Contract(config[environment.configFile][blockchainId].nfterc1155, nft1155Abi, this.signer);
    }
    else {
      contractObj = new ethers.Contract(config[environment.configFile][blockchainId].nfterc721, nft721Abi, this.signer);

    }

    var promise = new Promise((resolve, reject) => {
      try {
        contractObj
          .setApprovalForAll(this.transaferProxy, true)
          .then(function (hash: any) {
            resolve({ hash: hash, status: true });
          });
      } catch (e) {
        reject({ hash: '', status: false });
      }
    });
    return promise;
  }


  async isApprovedForAll(type: boolean, blockchainId: any) {
    debugger
    var contractObj: any;
    if (type) {
      contractObj = new ethers.Contract(config[environment.configFile][blockchainId].nfterc1155, nft1155Abi, this.signer);
    }
    else {
      contractObj = new ethers.Contract(config[environment.configFile][blockchainId].nfterc721, nft721Abi, this.signer);

    }

    try {
      var promise = await contractObj.isApprovedForAll(
        this.userAddress,
        this.transaferProxy
      );
      return { hash: promise, status: promise };
    } catch (e) {
      console.log('ee=>', e);

      return { hash: '', status: false };
    }
  }

  async signMsgForLiked(formData: any) {
    var message = "You are liking to '" + formData + "'";
    var signature = '';
    try {
      signature = await this.signer.signMessage(message.toString());
      return { status: true, signature };
    } catch (e) {
      return { status: false, signature };
    }
  }


  async signMsgForCreateCollection(){
    let message = "You are creating collection";
    var signature = '';
    try {
      signature = await this.signer.signMessage(message.toString());
      return { status: true, signature };
    } catch (e) {
      return { status: false, signature };
    }
  }

  async signMsgForUpdateCollection(){
    let message = "You are updating collection";
    var signature = '';
    try {
      signature = await this.signer.signMessage(message.toString());
      return { status: true, signature };
    } catch (e) {
      return { status: false, signature };
    }
  }

  async createSignature(message:any){
    var signature = '';
    try {
      signature = await this.signer.signMessage(message.toString());
      return { status: true, signature };
    } catch (e) {
      return { status: false, signature };
    }
  }



  async signMsgForRemoveFromSale(formData: any) {
    var message = `You are remove from sale to ${formData}`;
    var signature = '';
    try {
      signature = await this.signer.signMessage(message);
      return { status: true, signature };
    } catch (e) {
      return { status: true, signature };
    }
  }

  async signMsgForListingForSale(formData: any) {
    var message = `You are add for sale to ${formData}`;
    var signature = '';
    try {
      signature = await this.signer.signMessage(message);
      return { status: true, signature };
    } catch (e) {
      return { status: true, signature };
    }
  }

  async signMsgForUnLiked(formData: any) {
    var message = `You are unliking to '${formData}'`;

    var signature = '';
    try {
      signature = await this.signer.signMessage(message);
      return { status: true, signature };
    } catch (e) {
      return { status: true, signature };
    }
  }

  async signMsgForFollow(formData: any) {
    var message = `You are following to ${formData.following}`;
    var signature = '';
    try {
      signature = await this.signer.signMessage(message);
      return { status: true, signature };
    } catch (e) {
      return { status: false, signature };
    }
  }

  async signMsgForUnFollow(formData: any) {
    var message = `You are Unfollowing to ${formData.follower}`;
    var signature = '';
    try {
      signature = await this.signer.signMessage(message);
      return { status: true, signature };
    } catch (e) {
      return { status: false, signature };
    }
  }

  async signMessage(message: any) {
    var signature = '';
    try {
      signature = await this.signer.signMessage(message);
      return { status: true, signature };
    } catch (e) {
      return { status: false, signature };
    }
  }

  async signBidOrder(
    nftId: number,
    price: number,
    supply: number,
    nftAddress: string,
    isMultiple: boolean
  ) {


    debugger
    try {
      const params2 = ethers.utils.parseEther(price.toString());
      var abiCoder = new ethers.utils.AbiCoder();
      var a2 = abiCoder.encode(
        [
          'address',
          'address',
          'uint256',
          'uint256',
          'address',
          'uint256',
          'uint256',
          'uint256',
        ],
        [
          this.userAddress,
          nftAddress,
          nftId.toString(),
          isMultiple ? 2 : 3,
          '0x0000000000000000000000000000000000000000',
          supply,
          params2,
          this.pricingDetails.serviceFees * 100,
        ]
      );

      var a = ethers.utils.keccak256(a2).substring(2);

      var signature = await this.signer.signMessage(a);

      return { status: true, signature, address: this.nft721Address };
    } catch (e) {
      console.error(e);
      return { status: false, signature, address: this.nft721Address };
    }
  }

  // nftId: number,
  // price: number,
  // supply: number,
  // nftAddress: string,
  // isMultiple: boolean,
  // salt: any,
  // referralAddress: any,
  // royalties: any = 0,
  // royaltiesOwner: any = '0x0000000000000000000000000000000000000000',
  // tokenAddress: any = '0x0000000000000000000000000000000000000000',
  // blockchainId:any
  async signSellOrder(data:SignSellOrder01 ) {
    debugger
    try {
      const params2 = ethers.utils.parseEther(data.price.toString());
      var abiCoder = new ethers.utils.AbiCoder();

      var a2 = abiCoder.encode(
        [
          'tuple(address,uint256,tuple(address,uint256,uint256),tuple(address,uint256,uint256),tuple(address,uint256),address,uint256)',
          'uint256',
          'uint256',
          'uint256',
        ],
        [
          [
            this.userAddress,
            data.salt,
            [data.nftAddress, data.nftId.toString(), data.isMultiple ? 2 : 3],
            [
              data.tokenAddress,
              '0',
              data.tokenAddress == '0x0000000000000000000000000000000000000000'
                ? 0
                : 1,
            ],
            [data.royaltiesOwner, data.royalties * 100],
            data.referralAddress,
            data.blockchainId
          ],
          data.supply,
          params2,
          this.pricingDetails.serviceFees * 100,
        ]
      );


      var a = ethers.utils.keccak256(a2).substring(2);

      var signature = await this.signer.signMessage(a);

      return { status: true, signature, address: this.nft721Address };
    } catch (e) {
      return { status: false, signature, address: this.nft721Address };
    }
  }

  /**
   *
   * @param nftId
   * @param price
   * @param supply
   * @param nftAddress
   * @param isMultiple
   * @param salt
   * @param royalties
   * @param royaltiesOwner
   * @param tokenAddress
   * @returns
   *
   * The method is used for accept bid and continues for further now and above method signSellOrder() not
   */

  async signSellOrder01(signSellOrder: SignSellOrder) {

    debugger;
    try {


      const params2 = ethers.utils.parseEther(signSellOrder.price.toString());
      var abiCoder = new ethers.utils.AbiCoder();

      var a2 = abiCoder.encode(
        [
          'tuple(address,uint256,tuple(address,uint256,uint256),tuple(address,uint256,uint256),tuple(address,uint256),address,uint256)',
          'uint256',
          'uint256',
          'uint256',
        ],
        [
          [
            this.userAddress,
            signSellOrder.salt,
            [
              signSellOrder.nftAddress,
              signSellOrder.nftId.toString(),
              signSellOrder.isMultiple ? 2 : 3,
            ],
            [
              signSellOrder.contractAddress,
              '0',
              signSellOrder.contractAddress ==
                '0x0000000000000000000000000000000000000000'
                ? 0
                : 1,
            ],
            [signSellOrder.royaltiesOwner, signSellOrder.royalties * 100],
            signSellOrder.referralAddress,
            signSellOrder.blockchainId
          ],
          signSellOrder.quantity,
          params2,
          this.pricingDetails.serviceFees * 100,
        ]
      );

      var a = ethers.utils.keccak256(a2).substring(2);

      var signature = await this.signer.signMessage(a);

      return { status: true, signature, address: this.nft721Address };
    } catch (e) {
      return { status: false, signature, address: this.nft721Address };
    }
  }

  async exchangeToken(
    nftId: Number,
    supply: number,
    nftAddress: string,
    signature: string,
    ownerAddress: string,
    isMultiple: string,
    signaturePrice: any,
    quantity: any,
    tokenAddress: any = '0x0000000000000000000000000000000000000000',
    buyer: any = this.userAddress
  ) {
    /**********
     * 
     *  enum AssetType {ETH, ERC20, ERC1155, ERC721, ERC721Deprecated}
  
      struct Asset {
          address token;
          uint tokenId;
          AssetType assetType;
      }
  
      struct OrderKey {
          address owner;
          uint salt;
  
          Asset sellAsset;
  
          Asset buyAsset;
      }
  
      struct Order {
          OrderKey key;
  
          uint selling;
          uint buying;
  
          uint sellerFee;
      }
  
      struct Sig {
          uint8 v;
          bytes32 r;
          bytes32 s;
      }
     */

    const params2 = ethers.utils.parseEther(signaturePrice.toString());
    const priceB = BigNumber.from(params2).mul(quantity).div(supply);
    var spliSign = ethers.utils.splitSignature(signature);

    try {
      var promise = await this.exchangeAbiContract.exchange(
        [
          [
            ownerAddress, //owner
            supply, //salt
            [
              nftAddress, //sellAsset.token
              nftId.toString(), //sellAsset.tokenId
              isMultiple ? 2 : 3, //sellAsset.assetType
            ],
            [
              tokenAddress, //buyAsset.token
              '0', //buyAsset.tokenId
              tokenAddress == '0x0000000000000000000000000000000000000000'
                ? 0
                : 1, //buyAsset.assetType
            ],
          ],
          supply, //selling
          params2, //buying
          this.pricingDetails.serviceFees, //sellerFee
        ],
        [spliSign.v, spliSign.r, spliSign.s],
        0, //buyerFee
        quantity, //amount
        buyer, //buyer
        {
          value:
            tokenAddress == '0x0000000000000000000000000000000000000000'
              ? priceB
              : 0,
        }
      );
      return { hash: promise, status: true };
    } catch (e) {
      console.log(e);
      return { hash: '', status: false };
    }
    return promise;
  }

  /**
   *
   * @param nftId
   * @param supply
   * @param nftAddress
   * @param signature
   * @param ownerAddress
   * @param isMultiple
   * @param total
   * @param signaturePrice
   * @param quantity
   * @param tokenAddress
   * @param royalities
   * @param royaltiesOwner
   * @param buyerSignature
   * @param salt
   * @param buyer
   * @returns
   */


  async exchangeToken01(exchangeToken: exchangeToken, blockchainId: any) {

    debugger;

    const params2 = ethers.utils.parseEther((exchangeToken.signaturePrice).toString());
    const priceB = BigNumber.from(params2).mul(exchangeToken.quantity).div(exchangeToken.supply);
    var spliSign = ethers.utils.splitSignature(exchangeToken.signature);
    if (exchangeToken.buyerSignature == '-1') {
      exchangeToken.buyerSignature = exchangeToken.signature;
    }
    var spliSignBuyer = ethers.utils.splitSignature(
      exchangeToken.buyerSignature
    );

    let SellOrder = [
      [
        exchangeToken.ownerAddress, //owner
        exchangeToken.salt, //salt
        [
          exchangeToken.nftAddress, //sellAsset.token
          exchangeToken.nftTokenID.toString(), //sellAsset.tokenId
          exchangeToken.isMultiple ? 2 : 3, //sellAsset.assetType
        ],
        [
          exchangeToken.tokenAddress, //buyAsset.token
          '0', //buyAsset.tokenId
          exchangeToken.tokenAddress ==
            '0x0000000000000000000000000000000000000000'
            ? 0
            : 1, //buyAsset.assetType
        ],
        [exchangeToken.royaltiesOwner, exchangeToken.royalties * 100],
        exchangeToken.referalAddress,
        blockchainId
      ],
      exchangeToken.supply, //selling
      params2, //buying
      this.pricingDetails.serviceFees * 100, //sellerFee
    ];
    debugger
    let BuyOrder = [
      [
        exchangeToken.isMakeOffer ? "0x0000000000000000000000000000000000000000" : exchangeToken.ownerAddress,//owner
        exchangeToken.salt,//salt
        [
          exchangeToken.nftAddress, //sellAsset.token
          exchangeToken.nftTokenID.toString(), //sellAsset.tokenId
          exchangeToken.isMultiple ? 2 : 3, //sellAsset.assetType
        ],
        [
          exchangeToken.tokenAddress, //buyAsset.token
          '0', //buyAsset.tokenId
          exchangeToken.tokenAddress ==
            '0x0000000000000000000000000000000000000000'
            ? 0
            : 1, //buyAsset.assetType
        ],
        [exchangeToken.royaltiesOwner, exchangeToken.royalties * 100],
        exchangeToken.isMakeOffer
          ? '0x0000000000000000000000000000000000000000'
          : exchangeToken.referalAddress,
          blockchainId
      ],
      1,//exchangeToken.supply, //selling
      params2, //buying
      this.pricingDetails.serviceFees * 100, //sellerFee
    ];
    try {
      var promise = await this.exchangeAbiContract.exchange(
        SellOrder,
        [spliSign.v, spliSign.r, spliSign.s],
        [BuyOrder, priceB, exchangeToken.quantity], //Buy Order
        [spliSignBuyer.v, spliSignBuyer.r, spliSignBuyer.s],
        exchangeToken.buyer ?? this.userAddress, //buyer
        {
          value:
            exchangeToken.tokenAddress ==
              '0x0000000000000000000000000000000000000000'
              ? priceB
              : 0,
        }
      );

      return { hash: promise, status: true };
    } catch (e: any) {
      console.log(e);
      this.toastr.error(e.message);
      return { hash: '', status: false };
    }
    return promise;
  }

  async signBuyOrder(model: SignBuyerOrder) {
    try {
      const params2 = ethers.utils.parseEther(model.amount.toString());
      var abiCoder = new ethers.utils.AbiCoder();
      var a2 = abiCoder.encode(
        [
          'tuple(tuple(address,uint256,tuple(address,uint256,uint256),tuple(address,uint256,uint256),tuple(address,uint256),address,uint256),uint256,uint256,uint256)',
          'uint256',
          'uint256',
        ],
        [
          [
            [
              model.ownerAddress,
              model.salt,
              [
                model.nftAddress,
                model.nftTokenID.toString(),
                model.isMultiple ? 2 : 3,
              ],
              [
                model.contractAddress,
                '0',
                model.contractAddress ==
                  '0x0000000000000000000000000000000000000000'
                  ? 0
                  : 1,
              ],
              [model.royaltiesOwner, model.royalties * 100],
              ethers.utils.isAddress(model.referalAddress)
                ? model.referalAddress
                : '0x0000000000000000000000000000000000000000',
                model.blockchainId
            ],
            model.supply,
            params2,
            this.pricingDetails.serviceFees * 100,
          ],
          params2,
          model.supply,
        ]
      );
      ;
      debugger
      var a = ethers.utils.keccak256(a2).substring(2);
        
      var signature = await this.signer.signMessage(a);
      return { status: true, signature, address: this.nft721Address };
    } catch (e) {
      ;
      return { status: false, signature, address: this.nft721Address };
    }
  }

  async cancelOrder(signature: any) {
    debugger
    return await this.exchangeAbiContract.cancel(signature);
  }


  // nftId: number,
  // price: number,
  // supply: number,
  // nftAddress: string,
  // isMultiple: boolean,
  // tokenAddress: any,
  // royaltiesOwner: string,
  // royalties: any,
  // referralAddress:any,
  // blockchainId:any
  async getOrderData(
    data:removefromsale
  ) {
    try {
      var a2 = [
        this.userAddress,
        data.supply,
        [data.nftAddress, data.nftId.toString(), data.isMultiple ? 2 : 3],
        [
          data.tokenAddress,
          '0',
          data.tokenAddress == '0x0000000000000000000000000000000000000000' ? 0 : 1,
        ],
        [data.royaltiesOwner, data.royalties * 100],
        data.referralAddress,
        data.blockchainId
      ];
      return { status: true, orderkey: a2, address: this.nft721Address };
    } catch (e) {
      return { status: false, orderkey: '', address: this.nft721Address };
    }
  }

  async takeSignature(abi: any, values: any) {
    try {
      var abiCoder = new ethers.utils.AbiCoder();
      var a2 = abiCoder.encode(abi, values);

      var a = ethers.utils.keccak256(a2).substring(2);

      var signature = await this.signer.signMessage(a);

      return { status: true, signature, address: this.nft721Address };
    } catch (e) {
      return { status: false, signature, address: this.nft721Address };
    }
  }

  async transferTokenSingle(toAddress: any, nftId: any, nftAddress: any) {
    try {
      let tempNft721Contract = new ethers.Contract(
        nftAddress,
        nft721Abi,
        this.signer
      );

      var promise = await tempNft721Contract.transferFrom(
        this.userAddress,
        toAddress,
        nftId
      );
      return { hash: promise, status: true };
    } catch (e) {
      return { hash: promise, status: false };
    }
  }

  async transferTokenMultiple(
    toAddress: any,
    nftId: any,
    supply: any,
    nftAddress: any
  ) {
    var promise = new Promise((resolve, reject) => {
      try {
        let tempNft1155Contract = new ethers.Contract(
          nftAddress,
          nft1155Abi,
          this.signer
        );

        tempNft1155Contract
          .safeTransferFrom(this.userAddress, toAddress, nftId, supply, '0x00')
          .then(function (hash: any) {
            resolve({ hash: hash.hash, status: true });
          });
      } catch (e) {
        reject({ hash: '', status: false });
      }
    });
    return promise;
  }

  async burnSignle(nftId: any) {
    try {
      var promise = await this.nft721Contract.burn(nftId);
      return { hash: promise, status: true };
    } catch (e) {
      return { hash: '', status: false };
    }
  }

  async burnMultiple(nftId: any, supply: any) {
    try {
      var promise = await this.nft1155Contract.burn(
        this.userAddress,
        nftId,
        supply
      );
      return { hash: promise.hash, status: true };
    } catch (e) {
      return { hash: '', status: false };
    }
  }

  async getBalanceOfUser(userAddress: any, tokenAddress: any) {
    let tokenContract = new ethers.Contract(
      tokenAddress,
      erc20Abi,
      this.signer
    );
    var promise = new Promise((resolve, reject) => {
      tokenContract.balanceOf(userAddress).then(function (params: any) {
        resolve(params);
      });
    });
    return promise;
  }

  async getTokenBalance(tokenAddress: any) {
    let tokenContract = new ethers.Contract(
      tokenAddress,
      erc20Abi,
      this.signer
    );
    let decimals = await tokenContract.decimals();
    try {
      var promise = await tokenContract.balanceOf(this.userAddress);
      return { balance: promise, status: true, decimals: decimals };
    } catch (e) {
      console.log(e);
      return { balance: 0, status: false, decimals: 0 };
    }
  }

  //token payment
  async checkAllowance(tokenAddress: any, amount: any) {
    let tokenContract = new ethers.Contract(
      tokenAddress,
      erc20Abi,
      this.signer
    );
    let decimals = await tokenContract.decimals();
    var promise = new Promise((resolve, reject) => {
      try {
        const params2 = 10 ** decimals * amount;

        tokenContract
          .allowance(this.userAddress, this.erc20TransferProxy)
          .then(async function (allowanceAmount: any) {
            if (allowanceAmount >= params2) {
              resolve({ hash: '', status: true, allowance: true });
            } else {
              resolve({ hash: '', status: true, allowance: false });
            }
          });
      } catch (e) {
        reject({ hash: e, status: false });
      }
    });
    return promise;
  }

  async approveToken(amount: any, tokenAddress: any) {
    let tokenContract = new ethers.Contract(
      tokenAddress,
      erc20Abi,
      this.signer
    );
    let decimals = await tokenContract.decimals();
    const params2 = 10 ** decimals * amount;

    var promise = new Promise(async (resolve, reject) => {
      try {
        let tx = await tokenContract.approve(
          this.erc20TransferProxy,
          params2.toString()
        );
        resolve({ hash: tx, status: true, allowance: false });
      } catch (e) {
        reject({ hash: e, status: false });
      }
    });
    return promise;
  }

  randomNo() {
    return Math.floor(1000000000000 + Math.random() * 9000000000000);
  }
}
