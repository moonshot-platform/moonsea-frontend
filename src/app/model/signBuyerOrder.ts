export class SignBuyerOrder {
  nftTokenID: any;
  amount: any;
  nftAddress: any;
  isMultiple: any;
  supply: any;
  ownerAddress: any;
  royalties: any;
  royaltiesOwner: any;
  salt: any;
  contractAddress: any;
  referalAddress: any;
  blockchainId:number;
}

export class exchangeToken {
  nftTokenID: any;
  amount: any;
  nftAddress: any;
  isMultiple: any;
  supply: any;
  ownerAddress: any;
  royalties: any;
  royaltiesOwner: any;
  salt: any;
  contractAddress: any;
  referalAddress: any;
  signature: any;
  signaturePrice: any;
  quantity: any;
  tokenAddress: any;
  buyerSignature: any;
  total: any;
  buyer :string;
  isMakeOffer : boolean = false;
}

export class SignSellOrder {
  nftId: any;
  price: any;
  quantity: any;
  nftAddress: any;
  isMultiple: any;
  salt: any;
  royalties: any;
  royaltiesOwner: any;
  contractAddress: any;
  referralAddress: any;
  blockchainId : number;
}

export class SignSellOrder01 {
  nftId: number;
  price: number;
  supply: number;
  nftAddress: string;
  isMultiple: boolean;
  salt: any;
  referralAddress: any;
  royalties: any = 0;
  royaltiesOwner: any = '0x0000000000000000000000000000000000000000';
  tokenAddress: any = '0x0000000000000000000000000000000000000000';
  blockchainId:any
}


export class removefromsale{
  nftId: any;
  price: any;
  supply: any;
  nftAddress: any;
  isMultiple: any;
  tokenAddress: any;
  royaltiesOwner: any;
  royalties: any;
  referralAddress:any;
  blockchainId:any
}