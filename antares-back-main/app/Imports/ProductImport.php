<?php

namespace App\Imports;

use App\Facades\LocaleFacade;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * Bulk product import.
 *
 * Expected heading row (extra columns are ignored, missing ones fall back):
 *   articul, brand, category, status, quantity,
 *   title_en, title_ru, title_uz, content_en, content_ru, content_uz
 *
 * Rows are matched on `articul` so re-importing the same sheet updates the
 * existing products instead of creating duplicates.
 */
class ProductImport implements ToCollection, WithHeadingRow
{
    public int $created = 0;
    public int $updated = 0;
    public int $skipped = 0;

    public function collection(Collection $rows): void
    {
        $locales = LocaleFacade::all();
        $fallback = $locales[0] ?? 'en';

        foreach ($rows as $row) {
            $articul = trim((string) $row->get('articul', ''));
            $titles = $this->titles($row, $locales, $fallback);

            // Without an article number or any title there is nothing to key on.
            if ($articul === '' && ($titles[$fallback] ?? '') === '') {
                $this->skipped++;
                continue;
            }

            $attributes = [
                'status' => $this->status($row),
                'quantity' => (int) $row->get('quantity', 0),
                'brand' => $this->brandSlug($row),
            ];

            foreach ($locales as $locale) {
                $attributes[$locale] = [
                    'title' => $titles[$locale] ?: ($titles[$fallback] ?? ''),
                    'content' => (string) $row->get("content_$locale", $row->get('content_' . $fallback, '')),
                ];
            }

            $product = $articul !== ''
                ? Product::where('articul', $articul)->first()
                : Product::whereHas('translations', fn ($q) => $q->where('title', $titles[$fallback]))->first();

            if ($product) {
                $product->update($attributes);
                $this->updated++;
            } else {
                $attributes['articul'] = $articul;
                $attributes['slug'] = $this->uniqueSlug($articul !== '' ? $articul : $titles[$fallback]);
                $product = Product::create($attributes);
                $this->created++;
            }

            if ($categoryId = $this->categoryId($row)) {
                $product->categories()->syncWithoutDetaching([$categoryId]);
            }
        }
    }

    /** @return array<string, string> */
    private function titles($row, array $locales, string $fallback): array
    {
        $titles = [];
        foreach ($locales as $locale) {
            $titles[$locale] = trim((string) $row->get("title_$locale", ''));
        }
        if (($titles[$fallback] ?? '') === '') {
            $titles[$fallback] = trim((string) $row->get('title', ''));
        }

        return $titles;
    }

    private function status($row): string
    {
        $status = strtoupper(trim((string) $row->get('status', '')));

        return in_array($status, Product::STATUSES, true) ? $status : Product::STATUS_ACTIVE;
    }

    private function brandSlug($row): ?string
    {
        $brand = trim((string) $row->get('brand', ''));
        if ($brand === '') {
            return null;
        }

        $slug = Str::slug($brand);
        Brand::firstOrCreate(['slug' => $slug], ['is_active' => true, 'en' => ['title' => $brand]]);

        return $slug;
    }

    private function categoryId($row): ?int
    {
        $name = trim((string) $row->get('category', ''));
        if ($name === '') {
            return null;
        }

        $category = Category::firstOrCreate(
            ['slug' => Str::slug($name)],
            ['is_visible' => true, 'en' => ['title' => $name]]
        );

        return $category->id;
    }

    private function uniqueSlug(string $source): string
    {
        $base = Str::slug($source) ?: 'product';
        $slug = $base;
        $suffix = 2;
        while (Product::where('slug', $slug)->exists()) {
            $slug = "$base-" . $suffix++;
        }

        return $slug;
    }
}
