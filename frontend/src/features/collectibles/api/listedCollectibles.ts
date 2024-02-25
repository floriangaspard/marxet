import { userSession } from "@/user-session";
import { openContractCall } from "@stacks/connect";
import {
  AnchorMode,
  AssetInfo,
  ClarityValue,
  FungibleConditionCode,
  NonFungibleConditionCode,
  addressToString,
  callReadOnlyFunction,
  contractPrincipalCV,
  cvToValue,
  makeContractNonFungiblePostCondition,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  uintCV,
} from "@stacks/transactions";
import { ListedCollectible } from "../types/ListedCollectible";
import { CURRENT_NETWORK, DEPLOYER_ADDRESS } from "@/config";

export const retrieveListingNonce = async () => {
  return parseInt(
    cvToValue(
      await callReadOnlyFunction({
        network: CURRENT_NETWORK,
        contractAddress: DEPLOYER_ADDRESS,
        contractName: "marxet",
        functionName: "get-listing-nonce",
        functionArgs: [],
        senderAddress: DEPLOYER_ADDRESS,
      })
    )["value"]
  );
};

export const buyCollectible = async (
  collectible: ListedCollectible,
  assetInfo: AssetInfo,
  paymentAssetInfo: AssetInfo | undefined,
  onFinish: () => void,
  onCancel: () => void
) => {
  const args: (string | ClarityValue)[] = [
    uintCV(collectible.listingId),
    contractPrincipalCV(
      addressToString(assetInfo.address),
      assetInfo.contractName.content
    ),
  ];

  if (paymentAssetInfo !== undefined) {
    args.push(
      contractPrincipalCV(
        addressToString(paymentAssetInfo.address),
        paymentAssetInfo.contractName.content
      )
    );
  }

  await openContractCall({
    contractAddress: DEPLOYER_ADDRESS,
    contractName: "marxet",
    functionName:
      paymentAssetInfo === undefined
        ? "fulfil-listing-stx"
        : "fulfil-listing-ft",
    functionArgs: args,

    anchorMode: AnchorMode.OnChainOnly,
    network: CURRENT_NETWORK,

    postConditions: [
      makeContractNonFungiblePostCondition(
        DEPLOYER_ADDRESS,
        "marxet",
        NonFungibleConditionCode.Sends,
        assetInfo,
        uintCV(collectible.tokenId)
      ),
      paymentAssetInfo !== undefined
        ? makeStandardFungiblePostCondition(
            userSession.loadUserData().profile.stxAddress.testnet,
            FungibleConditionCode.Equal,
            collectible.price,
            paymentAssetInfo!
          )
        : makeStandardSTXPostCondition(
            userSession.loadUserData().profile.stxAddress.testnet,
            FungibleConditionCode.Equal,
            collectible.price
          ),
    ],

    onFinish: onFinish,
    onCancel: onCancel,
  });
};

export const retrieveListing = async (listingId: number) => {
  return cvToValue(
    await callReadOnlyFunction({
      network: CURRENT_NETWORK,
      contractAddress: DEPLOYER_ADDRESS,
      contractName: "marxet",
      functionName: "get-listing",
      functionArgs: [uintCV(listingId)],
      senderAddress: DEPLOYER_ADDRESS,
    })
  );
};
