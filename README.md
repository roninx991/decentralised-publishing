# decentralised-publishing (original project named as SARA)
A Decentralised Solution to publish research papers by organizations.

In recent times, many organizations have started to take up the task of publishing scientific material and make it available to new budding researchers. However, this has also paved the way for many organizations to this work for only monetary gain rather than publishing standard material. Blockchain is considered as the second biggest invention after the internet. It is a technology that can disrupt any current process. Blockchain in reviewing is a new concept which might help in solving the current paper reviewing system by decentralizing the process and making it open to the public. Also the participants of the system can get monetary benefit fairly. This project is a POC of how the system will work.

Frontend for this application [decentralised-publishing-frontend](https://github.com/Sangatdas/decentralised-publishing-frontend)


### Please find the attached drive link for whitepaper:
https://drive.google.com/open?id=1-LnCRTdZU4SVKqHxqUnLBY4iudbLr5R2

### Please find the attached drive link for video implementation:
https://drive.google.com/file/d/1sWrqPv3-q9Ej510LrAs3AkCGvJYDRvaV/view?usp=sharing

## Prerequisites
Before using the application you need to have certain tools and packages installed on your local machine.
1. Install go-ethereum on your machine or Geth. You can refer [this link](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum) for instructions.
2. Install NodeJS on your local machine. You can refer [this link](https://nodejs.org/en/) for further instructions.
3. Install go-ipfs on your local machine. You can refer [this link](https://docs.ipfs.io/guides/guides/install/) for futher instructions.
4. Install Truffle on your local machine by running ```npm install -g truffle```. You can also refer [this](https://www.trufflesuite.com/truffle)
5. Install MongoDB server on your local machine. You can refer [this link](https://docs.mongodb.com/manual/installation/) for further instructions.

## Tools Versions (at time of creation)
1. go-ethereum - 1.9.9-stable-01744997
2. go-ipfs - 0.4.21-8ca278f45
3. MongoDB - v3.6.3
4. NodeJS - v10.16.2
5. NPM - 6.14.5
6. Truffle - v5.1.27

## Setting Project Environment Variables
1. Create a .env file in project root directory
2. Set following environment variables and their corresponding values
  1. MONGODB_URI (URI Path to your mongo instance)
  2. WEB3_PROVIDER (Web3 Provider URI)
  3. COINBASE (Coinbase account of your geth instance)
  4. COINBASE_PWD (Password of coinbase account)
  5. IPFS_HOST (Hostname of IPFS node API Server)
  6. IPFS_PORT (Port of IPFS Node API Server)
  
## Creating a Private Single Geth Node (for dev environment only)
1. Create folder for storing chain data:

   ```mkdir datadir```
2. Initialize Blockchain network and create genesis block using config file:

   ```geth --datadir ./datadir init init.json```
3. Start blockchain network and expose useful RPC APIs:

   ```geth --datadir ./datadir --networkid 2020 --rpc --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*" --rpcapi "eth,net,web3,personal,miner,admin" --allow-insecure-unlock```

## Attaching to Geth IPC
```geth attach ./datadir/geth.ipc```

## Creating Private Network Cluster using Geth (Optional)
Run the following commands on Geth console-

1. Get enode information of nodes by running following command:

   ```admin.nodeInfo.enode```

2. Add peer by running following command (you will get below information as an output from previous command):

   ```admin.addPeer(<enode id of the current Node and IP of the Node to connect>)```

3. Check if peers are added by following command:

   ```admin.peers```

## Starting MongoDB server (Might vary according to OS. Below Tested on Ubuntu 18.04 LTS)
You might use following commands to start MongoDB server on your local machine:
1. Start

```sudo mongod``` or ```sudo systemctl start mongodb```

2. Stop
```sudo systemctl stop mongodb```

## Starting IPFS Daemon server
Run following commands on your terminal:

1. Initialize IPFS on your machine
```ipfs init```

2. Configure IPFS to allow CORS (You can also directly edit /home//snap/ipfs/1170/.ipfs)
```ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'```
```ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"GET\", \"POST\"]'```

3. Start IPFS Daemon
```ipfs daemon```

## Deploy Smart Contracts on to Blockchain (Uses configuration from truffle.js file in project directory)
Run the following commands on the terminal in project root directory:

1. Compile Smart Contracts
```truffle compile```

2. Migrate Smart Contracts to the Geth Node
```truffle migrate```

## Starting Node Application
Run ```nodemon start``` on your terminal. The application should start on port 3001. View the application in your favourite browser using url: http://localhost:5000.
