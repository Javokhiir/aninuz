# Product datasheets

Drop PDF files here. They are served statically at `/datasheets/<file>.pdf`.

Which file a product hands out is decided in
`app/[locale]/products/[companyId]/[product]/components/datasheet.tsx`:

- `DATASHEETS` maps a product slug to its own PDF.
- `GENERIC_DATASHEET` is used for every product that is not in that map.

A visitor has to leave an email before the download starts; the address is
recorded via `POST /api/datasheet-lead` and listed in the admin panel under
**Datasheet leads**.
