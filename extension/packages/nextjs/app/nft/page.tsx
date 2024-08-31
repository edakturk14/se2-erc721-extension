"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldWriteContract, useTransactor } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { data: nftContractData } = useDeployedContractInfo("NFTContract");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { writeContractAsync: writeNFTContractAsync, isPending } = useScaffoldWriteContract("NFTContract");
  const writeTx = useTransactor();

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
      </div>
    </div>
  );
};

export default Home;
