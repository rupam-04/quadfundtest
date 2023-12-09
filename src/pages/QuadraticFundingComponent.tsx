import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const QuadraticFundingComponent: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      // Connect to Ethereum provider
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(ethereum);
        setProvider(web3Provider);

        // Get selected account
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        // Connect to the QuadraticFunding contract
        const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Replace with your contract address
        const contractAbi = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "contributor",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "roundNum",
                        "type": "uint256"
                    }
                ],
                "name": "ContributionMade",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "projectName",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "roundNum",
                        "type": "uint256"
                    }
                ],
                "name": "ProjectCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "roundNum",
                        "type": "uint256"
                    }
                ],
                "name": "RoundFinalized",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "voter",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "projectNum",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "roundNum",
                        "type": "uint256"
                    }
                ],
                "name": "VoteCast",
                "type": "event"
            },
            {
                "inputs": [],
                "name": "admin",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "roundNum",
                        "type": "uint256"
                    }
                ],
                "name": "contribute",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "roundName",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "durationInMinutes",
                        "type": "uint256"
                    }
                ],
                "name": "createRound",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "currentRound",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "roundNum",
                        "type": "uint256"
                    }
                ],
                "name": "finalizeRound",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "projectName",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "roundNum",
                        "type": "uint256"
                    }
                ],
                "name": "nominateProject",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "rounds",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "roundName",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "projectCounter",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isFinalized",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "roundNum",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "projectNum",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "vote",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "receive"
            }
        ]; // Replace with your contract ABI
        const quadraticFundingContract = new ethers.Contract(contractAddress, contractAbi, web3Provider.getSigner());
        setContract(quadraticFundingContract);
      } else {
        console.error('Ethereum provider not found');
      }
    };

    initialize();
  }, []);

  const contribute = async (roundNum: number, amount: number) => {
    if (contract && account) {
      try {
        // Convert ETH amount to Wei (1 ETH = 10^18 Wei)
        const amountInWei = ethers.utils.parseEther(amount.toString());

        // Send contribution transaction
        const contributionTx = await contract.contribute(roundNum, { value: amountInWei });
        await contributionTx.wait();

        console.log('Contribution successful!');
      } catch (error: any) {
        console.error('Contribution failed:', error.message);
      }
    }
  };

  // Add more functions for other contract interactions (createRound, nominateProject, vote, finalizeRound, etc.)

  return (
    <div>
      <h1>Quadratic Funding Component</h1>
      {account && <p>Connected Account: {account}</p>}
      <button onClick={() => contribute(1, 0.1)}>Contribute to Round 1</button>
    </div>
  );
};

export default QuadraticFundingComponent;
