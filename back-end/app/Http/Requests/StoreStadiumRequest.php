<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStadiumRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'price_per_hour' => 'required|numeric|min:0',
        'location' => 'required|string|max:255',
        'images.*' => 'image|mimes:jpg,jpeg,png|max:2048'
    ];
    }
}
