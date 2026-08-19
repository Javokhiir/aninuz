<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DatasheetLead;
use Illuminate\Http\Request;

class DatasheetLeadController extends Controller
{
    public function index(Request $request)
    {
        $leads = DatasheetLead::with('product')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('email', 'like', "%{$search}%")
                    ->orWhere('product_slug', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return view('admin.pages.datasheet-leads', ['items' => $leads]);
    }

    public function destroy(DatasheetLead $datasheet_lead)
    {
        $datasheet_lead->delete();
        session()->flash('success', 'Lead was deleted');

        return redirect(dashboard_route('dashboard.datasheet-leads.index'));
    }
}
