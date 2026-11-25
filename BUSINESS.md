# Business configuration

Edit `src/config/business.ts` with verified information before launch.

| Field | Value to provide |
| --- | --- |
| name, logo | Actual shop name and local logo asset URL |
| phone, whatsapp | Verified shop numbers. WhatsApp accepts an Indian 10-digit mobile number or a +91-prefixed number |
| address, hours | Verified address and public business hours |
| email, maps, socials | Real business email, Google Maps URL and social links |
| pickupRepair | Enable only when repair pickup is offered |
| delivery, deliveryPaise | Whether delivery is offered and flat fee in integer paise. Leave the fee null if confirmed individually |
| siteUrl | Public HTTPS origin for metadata and sitemap |

Replace the samples in `src/data/repairs.ts` with verified model, issue and part prices. Replace catalogue prices, images, variants, specifications and limits in `src/data/products.ts`. Supply verified warranties only. Configure the live availability workflow before advertising stock. Update visible demo labels when the relevant data is verified.

Run `npm run sitemap -- https://your-verified-domain` to generate absolute sitemap URLs. Add the sitemap URL to `public/robots.txt` before building for production.

Test booking, product enquiries and checkout on a device with WhatsApp after setting the number. Prepare an enquiry and verify that the correct recipient and unsent message appear in WhatsApp. Confirm delivery options and repair policies with the shop.
