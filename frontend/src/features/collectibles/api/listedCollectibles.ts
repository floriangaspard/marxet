import { userSession } from "@/user-session";
import { openContractCall } from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";
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
import { ListedCollectible } from "../types/Collectible";

export const retrieveListingNonce = async () => {
  return parseInt(
    cvToValue(
      await callReadOnlyFunction({
        network: new StacksMocknet(),
        contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        contractName: "marxet",
        functionName: "get-listing-nonce",
        functionArgs: [],
        senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
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
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "marxet",
    functionName:
      paymentAssetInfo === undefined
        ? "fulfil-listing-stx"
        : "fulfil-listing-ft",
    functionArgs: args,

    anchorMode: AnchorMode.OnChainOnly,
    network: new StacksMocknet(),

    postConditions: [
      makeContractNonFungiblePostCondition(
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
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
      network: new StacksMocknet(),
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "marxet",
      functionName: "get-listing",
      functionArgs: [uintCV(listingId)],
      senderAddress: userSession.loadUserData().profile.stxAddress.testnet,
    })
  );
};
