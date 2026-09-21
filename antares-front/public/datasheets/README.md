# Product datasheets

Datasheets are not stored here. Each product links straight to Inmarco's
published PDF on their CDN; the slug-to-file map lives in
`app/[locale]/products/[companyId]/[product]/components/datasheet.tsx`.

Products missing from that map (no datasheet on inmarco.ae) do not show the
download button. To add one, put the Inmarco file name next to the product slug.

A visitor has to leave an email before the download starts; the address is
recorded via `POST /api/datasheet-lead` and listed in the admin panel under
**Datasheet leads**.
