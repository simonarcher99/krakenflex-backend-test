import { getOutages, getSiteInfo, retry, sendData } from "./api";
import { FILTERING_DATE_TIME } from "./config";
import { enhanceOutageData } from "./enhanceData";

export const handler = async (siteId: string, apiRetries: number): Promise<void> => {
  const outages = await retry(getOutages, [], apiRetries);
  const siteInfo = await retry(getSiteInfo, [siteId], apiRetries);
  const enhancedSiteOutages = enhanceOutageData(
    FILTERING_DATE_TIME,
    outages,
    siteInfo
  );
  console.log(`Posting ${enhancedSiteOutages.length} outages to server...`)
  await retry(sendData, [siteId, enhancedSiteOutages], apiRetries);
};