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
}
