import type { CampaignTemplate, GeneratedHotel } from "@/types/hotel";

// ─── Campaign Templates ────────────────────────────────────────────────────────

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: "campaign-8",
    name: "$8 Campaign",
    price: "$8",
    videoCount: 1,
    hasPaymentDate: false,
    hasCreatorName: false,
    rawText: `Hi,
Thank you for your interest.
Below is the link to the pre-edited video we prepared for you. Please publish the video using the corresponding caption, hashtag, and location tag exactly as provided.
Important:
The video must remain posted for at least 3 months and should not be deleted during that time.
Video details:
Video link: [Video Link]
Caption / Description: [Caption / Description]
Hashtag: [Hashtag]
Location tag: [Location Tag]
After you finish posting, please reply to this email with:
1. The video link
2. Your payment information — you may choose either option below:

Option A: PayPal
- PayPal email: 

Option B: Direct Deposit
- Name: 
- Bank name: 
- Routing number: 
- Account number: 
Once we receive your submission, we will review it and process the payment within 3 business days.
If you complete this successfully, we would also be happy to invite you to participate in our future activities and additional opportunities.
Best,
Joanna`,
  },
  {
    id: "campaign-15",
    name: "$15 Campaign",
    price: "$15",
    videoCount: 4,
    hasPaymentDate: true,
    hasCreatorName: false,
    rawText: `Hi,
Thank you for completing the previous post and for sending over the video link.
We will process your payment within 3 business days next week.
In addition, we currently have 4 more ready-to-post videos available for you to publish. Please note that for the same location, you may post no more than 1 video per day.
Video 1
Video Link: [Video Link1]
Caption / Description: [Caption / Description1]
Hashtag: [Hashtag1]
Location Tag: [Location Tag1]
Video 2
Video Link: [Video Link2]
Caption / Description: [Caption / Description2]
Hashtag: [Hashtag2]
Location Tag: [Location Tag2]
Video 3
Video Link: [Video Link3]
Caption / Description: [Caption / Description3]
Hashtag: [Hashtag3]
Location Tag: [Location Tag3]
Video 4
Video Link: [Video Link4]
Caption / Description: [Caption / Description4]
Hashtag: [Hashtag4]
Location Tag: [Location Tag4]
After you finish posting these, please send me the video links as well. We will review them as soon as possible.
Once the posts are approved, we will process the payment on [Payment Date], and you will receive a total reward of $15.
Best,
Joanna`,
  },
  {
    id: "campaign-30",
    name: "$30 Campaign",
    price: "$30",
    videoCount: 10,
    hasPaymentDate: true,
    hasCreatorName: true,
    rawText: `Hi [Creator Name],
Thank you for confirming.
Below are the 10 ready-to-post RTP videos prepared for you. Please publish each video using the corresponding caption, hashtag, and location tag exactly as provided.
Important posting rules
For the same location, you may post no more than 1 video per day
Each video must remain posted for at least 3 months and should not be deleted during that time
Video Details
Video 1
Video Link: [Video Link1]
Caption / Description: [Caption / Description1]
Hashtag: [Hashtag1]
Location Tag: [Location Tag1]
Video 2
Video Link: [Video Link2]
Caption / Description: [Caption / Description2]
Hashtag: [Hashtag2]
Location Tag: [Location Tag2]
Video 3
Video Link: [Video Link3]
Caption / Description: [Caption / Description3]
Hashtag: [Hashtag3]
Location Tag: [Location Tag3]
Video 4
Video Link: [Video Link4]
Caption / Description: [Caption / Description4]
Hashtag: [Hashtag4]
Location Tag: [Location Tag4]
Video 5
Video Link: [Video Link5]
Caption / Description: [Caption / Description5]
Hashtag: [Hashtag5]
Location Tag: [Location Tag5]
Video 6
Video Link: [Video Link6]
Caption / Description: [Caption / Description6]
Hashtag: [Hashtag6]
Location Tag: [Location Tag6]
Video 7
Video Link: [Video Link7]
Caption / Description: [Caption / Description7]
Hashtag: [Hashtag7]
Location Tag: [Location Tag7]
Video 8
Video Link: [Video Link8]
Caption / Description: [Caption / Description8]
Hashtag: [Hashtag8]
Location Tag: [Location Tag8]
Video 9
Video Link: [Video Link9]
Caption / Description: [Caption / Description9]
Hashtag: [Hashtag9]
Location Tag: [Location Tag9]
Video 10
Video Link: [Video Link10]
Caption / Description: [Caption / Description10]
Hashtag: [Hashtag10]
Location Tag: [Location Tag10]
Reward
If you complete all 10 posts by the end of this month, you will receive a $30 cash reward.
The payment will be settled on [Payment Date].
After you finish posting, please make sure to reply to this email with all posted video links so we can review them and include them in the settlement.
Best,
Joanna`,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Format a JS Date to "Month Day" e.g. "June 9" */
export function formatPaymentDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const VIDEO_LINK_MARKER = "%%VIDEOLINK_";

/**
 * Replace all text placeholders in the raw template, inserting %%VIDEOLINK_N%%
 * markers for video links (handled separately in HTML conversion).
 */
function replacePlaceholders(
  text: string,
  hotels: GeneratedHotel[],
  videoCount: number,
  paymentDate: string,
  creatorName: string
): string {
  let out = text;

  // Creator name & payment date
  out = out.replace(/\[Creator Name\]/g, creatorName || "[Creator Name]");
  out = out.replace(/\[Payment Date\]/g, paymentDate || "[Payment Date]");

  if (videoCount === 1) {
    // $8 campaign — no number suffix
    const h = hotels[0];
    if (h) {
      out = out.replace(/\[Video Link\]/g, `${VIDEO_LINK_MARKER}0%%`);
      out = out.replace(/\[Caption \/ Description\]/g, h.caption);
      out = out.replace(/\[Hashtag\]/g, h.hashtags);
      out = out.replace(/\[Location [Tt]ag\]/g, h.location);
    }
  } else {
    // $15 and $30 — numbered placeholders
    for (let i = 0; i < Math.min(hotels.length, videoCount); i++) {
      const n = i + 1;
      const h = hotels[i];
      out = out.replace(`[Video Link${n}]`, `${VIDEO_LINK_MARKER}${i}%%`);
      out = out.replace(`[Caption / Description${n}]`, h.caption);
      out = out.replace(`[Hashtag${n}]`, h.hashtags);
      out = out.replace(`[Location Tag${n}]`, h.location);
    }
  }

  return out;
}

/**
 * Render the campaign email as an HTML string.
 * Video links become <a> tags; everything else is HTML-escaped.
 */
export function renderCampaignEmailHtml(
  template: CampaignTemplate,
  hotels: GeneratedHotel[],
  paymentDate: string,
  creatorName: string
): string {
  const processed = replacePlaceholders(
    template.rawText,
    hotels,
    template.videoCount,
    paymentDate,
    creatorName
  );

  const lines = processed.split("\n");

  return lines
    .map((line) => {
      // HTML-escape everything first
      let htmlLine = escapeHtml(line);

      // Replace video link markers with actual <a> tags
      htmlLine = htmlLine.replace(
        new RegExp(`${VIDEO_LINK_MARKER}(\\d+)%%`, "g"),
        (_, idx) => {
          const hotel = hotels[parseInt(idx, 10)];
          if (hotel?.videoLink) {
            return `<a href="${escapeHtml(hotel.videoLink)}" target="_blank" rel="noreferrer">Video Link${parseInt(idx, 10) + 1 > 1 || template.videoCount > 1 ? parseInt(idx, 10) + 1 : ""}</a>`;
          }
          return `[Video Link${template.videoCount > 1 ? parseInt(idx, 10) + 1 : ""}]`;
        }
      );

      return `<p>${htmlLine || "&nbsp;"}</p>`;
    })
    .join("\n");
}

/**
 * Render the campaign email as plain text (for copy-as-text).
 */
export function renderCampaignEmailText(
  template: CampaignTemplate,
  hotels: GeneratedHotel[],
  paymentDate: string,
  creatorName: string
): string {
  let out = replacePlaceholders(
    template.rawText,
    hotels,
    template.videoCount,
    paymentDate,
    creatorName
  );

  // Replace video link markers with actual URLs or label
  out = out.replace(
    new RegExp(`${VIDEO_LINK_MARKER}(\\d+)%%`, "g"),
    (_, idx) => {
      const hotel = hotels[parseInt(idx, 10)];
      return hotel?.videoLink || `[Video Link${parseInt(idx, 10) + 1}]`;
    }
  );

  return out;
}
