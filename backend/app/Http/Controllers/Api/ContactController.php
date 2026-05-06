<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Services\AdminNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:3000'],
        ]);

        $user = Auth::guard('sanctum')->user();

        $contact = Contact::create(array_merge($data, [
            'user_id' => $user?->id,
            'status' => Contact::STATUS_UNREAD,
        ]));

        AdminNotificationService::send(
            'contact_created',
            'New contact message',
            "{$contact->name} sent a contact message",
            "/admin/contact-messages?highlight={$contact->id}"
        );

        return response()->json([
            'message' => 'Contact message sent successfully.',
            'contact' => $contact,
        ], 201);
    }
}
