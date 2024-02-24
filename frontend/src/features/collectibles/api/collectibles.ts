import { CURRENT_NETWORK, DEPLOYER_ADDRESS } from "@/config";
import { userSession } from "@/user-session";
import fetchExplorer from "@/utils/fetchExplorer";
import { openContractCall } from "@stacks/connect";
import {
  AnchorMode,
  AssetInfo,
  NonFungibleConditionCode,
  addressToString,
  callReadOnlyFunction,
  contractPrincipalCV,
  cvToValue,
  makeStandardNonFungiblePostCondition,
  noneCV,
  someCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";

export const getHoldings = async () => {
  const retrievedMessage = await fetchExplorer(
    "/extended/v1/tokens/nft/holdings?" +
      new URLSearchParams({
        principal: userSession.loadUserData().profile.stxAddress.testnet,
      })
  );

  return await retrievedMessage.json();
};

export const getNonFungibleAssetName = async (
  address: string,
  contractName: string
) => {
  const response = await fetchExplorer(
    "/v2/contracts/interface/" + address + "/" + contractName
  );
  return (await response.json())["non_fungible_tokens"][0]["name"];
};

export const getFungibleAssetSymbol = async (
  contractAddress: string,
  contractName: string
) => {
  return cvToValue(
    await callReadOnlyFunction({
      network: CURRENT_NETWORK,
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: "get-symbol",
      functionArgs: [],
      senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
    })
  )["value"];
};

export const getFungibleAssetName = async (
  contractAddress: string,
  contractName: string
) => {
  return cvToValue(
    await callReadOnlyFunction({
      network: CURRENT_NETWORK,
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: "get-name",
      functionArgs: [],
      senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
    })
  )["value"];
};

export const isWhitelisted = async (contract: string) => {
  return cvToValue(
    await callReadOnlyFunction({
      network: CURRENT_NETWORK,
      contractAddress: DEPLOYER_ADDRESS,
      contractName: "marxet",
      functionName: "is-whitelisted",
      functionArgs: [
        contractPrincipalCV(contract.split(".")[0], contract.split(".")[1]),
      ],
      senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
    })
  );
};

export const listCollectible = async (
  tokenId: number,
  assetInfo: AssetInfo,
  price: number,
  paymentAssetInfo: AssetInfo | undefined,
  onFinish: () => void,
  onCancel: () => void
) => {
  await openContractCall({
    network: CURRENT_NETWORK,
    anchorMode: AnchorMode.OnChainOnly,

    postConditions: [
      makeStandardNonFungiblePostCondition(
        userSession.loadUserData().profile.stxAddress.testnet,
        NonFungibleConditionCode.Sends,
        assetInfo,
        uintCV(tokenId)
      ),
    ],

    contractAddress: DEPLOYER_ADDRESS,
    contractName: "marxet",
    functionName: "list-asset",
    functionArgs: [
      contractPrincipalCV(
        addressToString(assetInfo.address),
        assetInfo.contractName.content
      ),
      tupleCV({
        taker: noneCV(),
        "token-id": uintCV(tokenId),
        expiry: uintCV(500),
        price: uintCV(price),
        "payment-asset-contract": paymentAssetInfo
          ? someCV(
              contractPrincipalCV(
                addressToString(paymentAssetInfo.address),
                paymentAssetInfo.contractName.content
              )
            )
          : noneCV(),
      }),
    ],

    onFinish: onFinish,
    onCancel: onCancel,
  });
};

export const getTokenUri = async (
  tokenId: number,
  contractAddress: string,
  contractName: string
) => {
  return cvToValue(
    await callReadOnlyFunction({
      network: CURRENT_NETWORK,
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: "get-token-uri",
      functionArgs: [uintCV(tokenId)],
      senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
    })
  )["value"]["value"];
};

export const getMetadata = async (
  tokenId: number,
  contractAddress: string,
  contractName: string
) => {
  const tokenUri = await getTokenUri(tokenId, contractAddress, contractName);
  const response = await fetch(tokenUri);
  const json = response
    .json()
    .then((data) => data)
    .catch(() => {
      console.log("No metadata found");
    });
  return json;
};
