<?php

namespace App\Imports;

use App\Facades\LocaleFacade;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;

/**
 * Imports products from a JSON catalogue dump.
 *
 * Each entry may carry:
 *   code, brand, category, subcategory, status, quantity,
 *   description, specs [[label, value], ...], features [], applications []
 *
 * Products are matched on `code` (stored as articul) so re-running the import
 * refreshes the existing rows rather than duplicating them. Images are left
 * alone — they are added by hand in the admin panel.
 */
class ProductJsonImport
{
    public int $created = 0;
    public int $updated = 0;
    public int $skipped = 0;
    /** @var string[] */
    public array $errors = [];

    public function import(array $entries): self
    {
        $locales = LocaleFacade::all();
        $fallback = $locales[0] ?? 'en';

        foreach ($entries as $entry) {
            $code = trim((string) ($entry['code'] ?? $entry['articul'] ?? ''));
            if ($code === '') {
                $this->skipped++;
                continue;
            }

            $attributes = [
                'status' => $this->status($entry),
                'quantity' => (int) ($entry['quantity'] ?? 0),
                'brand' => $this->brandSlug($entry['brand'] ?? null),
            ];

            $content = $this->contentHtml($entry);
            $specs = $this->specsHtml($entry['specs'] ?? []);
            $extra = $this->listsHtml($entry);

            foreach ($locales as $locale) {
                $attributes[$locale] = [
                    'title' => $code,
                    'content' => $content,
                    'table_content' => $specs,
                    'table_content_second' => $extra,
                ];
            }

            $product = Product::where('articul', $code)->first();
            if ($product) {
                $product->update($attributes);
                $this->updated++;
            } else {
                $attributes['articul'] = $code;
                $attributes['slug'] = $this->uniqueSlug($code);
                $product = Product::create($attributes);
                $this->created++;
            }

            // The subcategory hangs off the category so the storefront keeps its
            // catalogue tree; the product is attached to both levels.
            $parentId = $this->categoryId((string) ($entry['category'] ?? ''));
            $childId = $this->categoryId((string) ($entry['subcategory'] ?? ''), $parentId);
            $product->categories()->syncWithoutDetaching(array_filter([$parentId, $childId]));
        }

        return $this;
    }

    private function contentHtml(array $entry): string
    {
        $description = trim((string) ($entry['description'] ?? ''));

        return $description === '' ? '' : '<p>' . e($description) . '</p>';
    }

    private function specsHtml(array $specs): string
    {
        if (!$specs) {
            return '';
        }

        $rows = '';
        foreach ($specs as $pair) {
            $label = trim((string) ($pair[0] ?? ''));
            $value = trim((string) ($pair[1] ?? ''));
            if ($label === '' && $value === '') {
                continue;
            }
            $rows .= '<tr><td>' . e($label) . '</td><td>' . e($value) . '</td></tr>';
        }

        return $rows === '' ? '' : "<figure class=\"table\"><table><tbody>$rows</tbody></table></figure>";
    }

    private function listsHtml(array $entry): string
    {
        $html = '';
        foreach (['features' => 'Key Features', 'applications' => 'Applications'] as $key => $heading) {
            $items = array_filter(array_map('trim', $entry[$key] ?? []));
            if (!$items) {
                continue;
            }
            $html .= '<h4>' . e($heading) . '</h4><ul>';
            foreach ($items as $item) {
                $html .= '<li>' . e($item) . '</li>';
            }
            $html .= '</ul>';
        }

        return $html;
    }

    private function status(array $entry): string
    {
        $status = strtoupper(trim((string) ($entry['status'] ?? '')));

        return in_array($status, Product::STATUSES, true) ? $status : Product::STATUS_ACTIVE;
    }

    private function brandSlug(?string $brand): ?string
    {
        $brand = trim((string) $brand);
        if ($brand === '') {
            return null;
        }

        $slug = Str::slug($brand);
        Brand::firstOrCreate(['slug' => $slug], ['is_active' => true, 'en' => ['title' => $brand]]);

        return $slug;
    }

    private function categoryId(string $name, ?int $parentId = null): ?int
    {
        $name = trim($name);
        if ($name === '') {
            return null;
        }

        $category = Category::firstOrCreate(
            ['slug' => Str::slug($name)],
            ['is_visible' => true, 'parent_id' => $parentId, 'en' => ['title' => $name]]
        );

        if ($parentId && $category->parent_id !== $parentId) {
            $category->update(['parent_id' => $parentId]);
        }

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
