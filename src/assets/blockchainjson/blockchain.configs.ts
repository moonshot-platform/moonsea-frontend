export const CHAIN_CONFIGS: any = {
  // "1": {
  //   "name": "Ethereum Mainnet",
  //   "explorerLink": "https://bscscan.com/address/",
  //   "icon": "assets/media/images/blockchain/eth.webp",
  //   "bg": "black",
  // },
  "1285": {
    "name": "Moonriver Mainnet",
    "explorerLink": "https://moonriver.moonscan.io/address/",
    "icon": "assets/media/images/blockchain/MOVR.svg",
    "bg": "black",
    "symbol": 'MOVR',
    "config": {
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x505',
        chainName: 'Moonriver',
        nativeCurrency: {
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
        blockExplorerUrls: ['https://moonriver.moonscan.io']
      }],
    }
  },
  "97": {
    "name": "BSC Testnet",
    "explorerLink": "https://testnet.bscscan.com/address/",
    "icon": "assets/media/images/blockchain/BSC.svg",
    "bg": "black",
    "symbol": 'BNB',
    "config": {
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x61',
        chainName: 'BSC Testnet',
        nativeCurrency: {
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        blockExplorerUrls: ['https://explorer.binance.org/smart-testnet']
      }],
    }
  },
  "56": {
    "name": "BSC Mainnet",
    "explorerLink": "https://bscscan.com/address/",
    "icon": "assets/media/images/blockchain/BSC.svg",
    "bg": "black",
    "symbol": 'BNB',
    "config": {
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x38',
        chainName: 'BSC',
        nativeCurrency: {
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com']
      }],
    }
  },
  "137": {
    "name": "Polygon Mainnet",
    "explorerLink": "https://polygonscan.com/address/",
    "icon": "assets/media/images/blockchain/Polygon_Primary_Token.svg",
    "bg": "#7b3fe4",
    "symbol": 'MATIC',
    "config": {
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mainnet.matic.network'],
        blockExplorerUrls: ['https://polygonscan.com/']
      }],
    }
  },
  "1287": {
    "name": "Moonbase Alpha",
    "icon": "assets/media/images/blockchain/MOVR.svg",
    "explorerLink": "https://moonbase.moonscan.io/address/",
    "bg": "black",
    "symbol": 'DEV',
    "config": {
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x507',
        chainName: 'Moonbase Alpha',
        nativeCurrency: {
          symbol: 'DEV',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
        blockExplorerUrls: ['https://moonbase.moonscan.io/']
      }],
    }
  },
  "80001": {
    "name": "Mumbai Testnet",
    "icon": "assets/media/images/blockchain/Polygon_Primary_Token.svg",
    "explorerLink": "https://mumbai.polygonscan.com/address/",
    "bg": "#7b3fe4",
    "symbol": 'MATIC',
    "config": {
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x13881',
        chainName: 'Mumbai Testnet',
        nativeCurrency: {
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
        blockExplorerUrls: ['https://polygonscan.com/']
      }],
    }
  } ,
  "4": {
    "name": "rinkeby Test Network",
    "icon": "assets/media/images/blockchain/eth-diamond-purple.png",
    "explorerLink": "https://rinkeby.etherscan.io/address/",
    "bg": "white",
    "symbol": 'ETH',
    "config": {
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: '0x4'
      }],
    }
  },
  "1": {
    "name": "Ethereum Mainnet",
    "icon": "assets/media/images/blockchain/eth.webp",
    "explorerLink": "https://etherscan.io/address/",
    "bg": "white",
    "symbol": 'ETH',
    "config": {
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: '0x1'
      }],
    }
  },
  "568": {
    "name": "Dogechain Testnet",
    "icon": "assets/media/dogecoin-doge-icon.png",
    "explorerLink": "https://explorer-testnet.dogechain.dog/",
    "bg": "white",
    "symbol": 'dog',
    "config": {
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: '0x238'
      }],
    }
  },
  "2000": {
    "name": "Dogechain Mainnet",
    "icon": "assets/media/dogecoin-doge-icon.png",
    "explorerLink": "https://explorer.dogechain.dog/",
    "bg": "white",
    "symbol": 'DOGE',
    "config": {
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: '0x7D0'
      }],
    }
  },
}
