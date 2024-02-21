import { userSession } from "@/user-session";
import { openContractCall } from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";
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
  const retrievedMessage = await fetch(
    "http://localhost:3999/extended/v1/tokens/nft/holdings?" +
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
  const response = await fetch(
    "http://localhost:3999/v2/contracts/interface/" +
      address +
      "/" +
      contractName
  );
  return (await response.json())["non_fungible_tokens"][0]["name"];
};

export const getFungibleAssetSymbol = async (
  contractAddress: string,
  contractName: string
) => {
  return cvToValue(
    await callReadOnlyFunction({
      network: new StacksMocknet(),
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
      network: new StacksMocknet(),
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
      network: new StacksMocknet(),
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
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
    network: new StacksMocknet(),
    anchorMode: AnchorMode.OnChainOnly,

    postConditions: [
      makeStandardNonFungiblePostCondition(
        userSession.loadUserData().profile.stxAddress.testnet,
        NonFungibleConditionCode.Sends,
        assetInfo,
        uintCV(tokenId)
      ),
    ],

    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
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
      network: new StacksMocknet(),
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
