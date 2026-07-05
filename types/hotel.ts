export interface Hotel {
  hotelName: string;   // Raw display text, e.g. "Ayres Suites Diamond Bar_1"
  videoLink: string;   // href from anchor tag, or "" if plain text paste
  locationTag: string; // hotelName with trailing _N removed
}

export interface GeneratedHotel {
  title: string;
  caption: string;
  hashtags: string;
  location: string;
  videoLink: string; // Preserved from parsed Hotel
}

export interface CampaignTemplate {
  id: string;
  name: string;
  price: string;
  videoCount: number;
  /** Plain text with [Placeholder] markers. Use [Payment Date] for the settling date. */
  rawText: string;
  /** Whether this campaign uses a payment date placeholder */
  hasPaymentDate: boolean;
  /** Whether this campaign uses a [Creator Name] placeholder */
  hasCreatorName: boolean;
}
