"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useTransactor,
} from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { data: nftContractData } = useDeployedContractInfo("NFTContract");
  const { address: connectedAddress } = useAccount();
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nftTokens, setNftTokens] = useState<string[]>([]);

  const { writeContractAsync: writeNFTContractAsync, isPending } = useScaffoldWriteContract("NFTContract");

  // Fetching NFTs owned by the connected address using the tokensOfOwner function
  const { data: tokenIds } = useScaffoldReadContract({
    contractName: "NFTContract",
    functionName: "tokensOfOwner",
    args: [connectedAddress],
  });

  useEffect(() => {
    if (tokenIds && tokenIds.length > 0) {
      setNftTokens(tokenIds.map((id: bigint) => id.toString()));
    } else {
      setNftTokens([]); // Clear the tokens if no NFTs are found
    }
  }, [tokenIds]);

  const handleMintNFT = async () => {
    if (isPending) return; // Prevent double minting by checking the pending state

    try {
      setTransactionHash(null);
      setErrorMessage(null);

      const result = await writeNFTContractAsync({
        functionName: "mint",
        args: [recipientAddress],
      });

      if (!result) {
        throw new Error("Transaction failed or was rejected.");
      }

      setTransactionHash(result); // Only set transaction hash if successful
      console.log("Transaction successful:", result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      console.error("Error minting NFT:", e);
    }
  };

  const blockExplorerUrl = (txHash: string) => {
    return `/blockexplorer/transaction/${txHash}`;
  };

  return (
    <div className="flex flex-col items-center flex-grow pt-10">
      <div className="px-5">
        <h1 className="mb-8 text-center">
          <span className="block text-4xl font-bold">Mint NFT</span>
        </h1>
        <div className="flex flex-col items-center justify-center mt-8 space-x-2 sm:flex-row">
          <p className="my-2 font-medium">NFT Contract Address:</p>
          <Address address={nftContractData?.address} />
        </div>
        <div className="flex flex-col items-start justify-center gap-2 sm:flex-row sm:items-center sm:gap-5">
          <AddressInput placeholder="Recipient address" value={recipientAddress} onChange={setRecipientAddress} />
          <button className="btn btn-primary" onClick={handleMintNFT} disabled={isPending}>
            {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Mint NFT"}
          </button>
        </div>
        <div className="flex justify-center mt-4">
          {transactionHash && (
            <p className="text-green-500 italic">
              Transaction successful! Hash:{" "}
              <a
                href={blockExplorerUrl(transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {transactionHash}
              </a>
            </p>
          )}
          {errorMessage && <p className="text-red-500">Error: {errorMessage}</p>}
        </div>

        {/* Display NFTs */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nftTokens.map(tokenId => (
              <div key={tokenId} className="border rounded p-4 shadow">
                <p className="font-semibold">Token ID: {tokenId}</p>
                <NFTDisplay tokenId={tokenId} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

const NFTDisplay: React.FC<{ tokenId: string }> = ({ tokenId }) => {
  const { data: tokenURI } = useScaffoldReadContract({
    contractName: "NFTContract",
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });

  let svgContent: string | null = null;

  if (tokenURI) {
    try {
      // Parse the JSON string directly
      const jsonObject = JSON.parse(tokenURI);

      // Directly assign the SVG content since there's no prefix
      svgContent = jsonObject.image;
    } catch (error) {
      console.error("Failed to parse or extract SVG:", error);
    }
  }

  return svgContent ? <div dangerouslySetInnerHTML={{ __html: svgContent }} /> : <p>Loading...</p>;
};
