<?php

namespace App\View\Components;

use App\Facades\LocaleFacade;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FaqComponent extends Component
{
    public $count;
    /**
     * Create a new component instance.
     */
    public function __construct(int $count)
    {
        $this->count = $count;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.admin.faq-component', [
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
            'count' => $this->count
        ]);
    }
}
