import fetchExplorer from "@/utils/fetchExplorer";

export const getCurrentBlockHeight = async () => {
  const response = await fetchExplorer("/v2/info");
  return parseInt((await response.json())["stacks_tip_height"]);
};
