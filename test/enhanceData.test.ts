import { FILTERING_DATE_TIME } from "../src/config";
import { enhanceOutageData } from "../src/enhanceData";
import { Outages, SiteInfo } from "../src/models";

describe("Test enhanceOutageData", () => {
  test("No outages and no devices return empty array", () => {
    const outages: Outages = [];
    const sites: SiteInfo = { name: "testSite", id: "testId", devices: [] };
    const enhancedData = enhanceOutageData(FILTERING_DATE_TIME, outages, sites);
    expect(enhancedData).toEqual([]);
  });
  test("No outages but devices return empty array", () => {
    const outages: Outages = [];
    const sites: SiteInfo = {
      name: "testSite",
      id: "testId",
      devices: [
        { id: "testDevice1", name: "testDevice1Name" },
        { id: "testDevice2", name: "testDevice2Name" },
      ],
    };
    const enhancedData = enhanceOutageData(FILTERING_DATE_TIME, outages, sites);
    expect(enhancedData).toEqual([]);
  });
  test("Outages and devices but none have the same ID returns empty array", () => {
    const outages: Outages = [
      {
        id: "testOutage1",
        begin: new Date("2022-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
      {
        id: "testOutage2",
        begin: new Date("2022-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
    ];
    const sites: SiteInfo = {
      name: "testSite",
      id: "testId",
      devices: [
        { id: "testDevice1", name: "testDevice1Name" },
        { id: "testDevice2", name: "testDevice2Name" },
      ],
    };
    const enhancedData = enhanceOutageData(FILTERING_DATE_TIME, outages, sites);
    expect(enhancedData).toEqual([]);
  });
  test("Outages are enhanced with device name when their IDs match", () => {
    const outages: Outages = [
      {
        id: "test1",
        begin: new Date("2022-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
      {
        id: "test2",
        begin: new Date("2022-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
    ];
    const sites: SiteInfo = {
      name: "testSite",
      id: "testId",
      devices: [
        { id: "test1", name: "testDevice1Name" },
        { id: "test2", name: "testDevice2Name" },
      ],
    };
    const enhancedData = enhanceOutageData(FILTERING_DATE_TIME, outages, sites);
    expect(enhancedData).toEqual([
      {
        id: "test1",
        name: "testDevice1Name",
        begin: new Date("2022-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
      {
        id: "test2",
        name: "testDevice2Name",
        begin: new Date("2022-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
    ]);
  });
  test("Outages with begin dates prior to 2022-01-01 are filtered out", () => {
    const outages: Outages = [
      {
        id: "test1",
        begin: new Date("2019-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
      {
        id: "test2",
        begin: new Date("2022-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
    ];
    const sites: SiteInfo = {
      name: "testSite",
      id: "testId",
      devices: [
        { id: "test1", name: "testDevice1Name" },
        { id: "test2", name: "testDevice2Name" },
      ],
    };
    const enhancedData = enhanceOutageData(FILTERING_DATE_TIME, outages, sites);
    expect(enhancedData).toEqual([
      {
        id: "test2",
        name: "testDevice2Name",
        begin: new Date("2022-01-02").toISOString(),
        end: new Date("2022-01-03").toISOString(),
      },
    ]);
  });
});
