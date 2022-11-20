import { z } from "zod";

export const outagesSchema = z.array(
  z.object({
    id: z.string(),
    begin: z.string(),
    end: z.string(),
  })
);

export const siteInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  devices: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export interface EnhancedSiteInfo {
    id: string;
    name: string;
    begin: string;
    end: string;
}

export type Outages = z.infer<typeof outagesSchema>;
export type SiteInfo = z.infer<typeof siteInfoSchema>;
