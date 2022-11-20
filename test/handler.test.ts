const mockGetOutages = jest.fn();
const mockGetSiteInfo = jest.fn();
const mockSendData = jest.fn();

import { SiteInfo } from "../src/models";

jest.mock("../src/api", () => {
  return {
    ...jest.requireActual("../src/api"),
    getOutages: mockGetOutages,
    getSiteInfo: mockGetSiteInfo,
    sendData: mockSendData,
  };
});

const mockSiteInfo: SiteInfo = {
  id: "test1",
  name: "testName",
  devices: [
    { id: "test1", name: "name1" },
    { id: "test3", name: "name3" },
    { id: "test4", name: "name4" },
  ],
};

const mockOutages = [
  { id: "test1", begin: "2022-11-20T12:30:39.460Z", end: "end1" },
  { id: "test2", begin: "2022-11-20T12:30:39.460Z", end: "end2" },
  { id: "test4", begin: "2020-10-01T10:20:00.000Z", end: "end3" },
];

describe("Test handler", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Posts correct data to the endpoint", async () => {
    const { handler } = require("../src/handler");
    mockGetOutages.mockImplementation(() => mockOutages);
    mockGetSiteInfo.mockImplementation(() => mockSiteInfo);
    await handler("norwich-pear-tree", 3);
    expect(mockSendData).toHaveBeenCalledWith("norwich-pear-tree", [
      {
        id: "test1",
        name: "name1",
        begin: "2022-11-20T12:30:39.460Z",
        end: "end1",
      },
    ]);
  });
});
