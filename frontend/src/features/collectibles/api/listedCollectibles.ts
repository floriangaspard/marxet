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
  createAssetInfo,
  cvToValue,
  makeContractNonFungiblePostCondition,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  parseAssetInfoString,
  uintCV,
} from "@stacks/transactions";
import { ListedCollectible } from "../types/Collectible";
import { getFungibleAssetName } from "./collectibles";

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
  let paymentAssetPrincipal: AssetInfo | undefined = undefined;
  if (collectible.paymentAssetContract) {
    paymentAssetPrincipal = parseAssetInfoString(
      collectible.paymentAssetContract!
    );

    const assetName = await getFungibleAssetName(
      addressToString(paymentAssetPrincipal!.address),
      paymentAssetPrincipal!.contractName.content
    );
    paymentAssetPrincipal = createAssetInfo(
      addressToString(paymentAssetPrincipal!.address),
      paymentAssetPrincipal!.contractName.content,
      assetName
    );

    args.push(
      contractPrincipalCV(
        addressToString(paymentAssetPrincipal!.address),
        paymentAssetPrincipal!.contractName.content
      )
    );
  }

  await openContractCall({
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "marxet",
    functionName:
      paymentAssetPrincipal === undefined
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
      paymentAssetPrincipal !== undefined
        ? makeStandardFungiblePostCondition(
            userSession.loadUserData().profile.stxAddress.testnet,
            FungibleConditionCode.GreaterEqual,
            0n,
            paymentAssetPrincipal!
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
