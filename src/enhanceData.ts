import { EnhancedSiteInfo, Outages, SiteInfo } from "./models";

const arrayToObject = <T extends Record<K, any>, K extends keyof any>(
  array: T[] = [],
  getKey: (item: T) => K
) =>
  array.reduce((obj, cur) => {
    const key = getKey(cur);
    return { ...obj, [key]: cur };
  }, {} as Record<K, T>);

export const enhanceOutageData = (
  dateFrom: string,
  outages: Outages,
  siteInfo: SiteInfo
): EnhancedSiteInfo[] => {
  const idToDeviceMap = arrayToObject(siteInfo.devices, (site) => site.id);

  const recentOutages = outages.filter(
    (outage) => new Date(outage.begin) >= new Date(dateFrom)
  );

  const recentSiteOutages = recentOutages.filter(
    (recentOutages) => !!idToDeviceMap[recentOutages.id]
  );

  const recentSiteOutagesEnhanced = recentSiteOutages.map(recentSiteOutage => {
    return {
      ...recentSiteOutage,
      name: idToDeviceMap[recentSiteOutage.id].name
    }
  })

  return recentSiteOutagesEnhanced;
};
