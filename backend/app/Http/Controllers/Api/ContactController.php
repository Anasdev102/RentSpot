<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessageMail;
use App\Models\Contact;
use App\Services\AdminNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

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

        try {
            Mail::to(config('mail.contact_to'))->send(new ContactMessageMail($contact));
        } catch (Throwable $exception) {
            Log::warning('Contact email delivery failed.', [
                'contact_id' => $contact->id,
                'error' => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Contact message sent successfully.',
            'contact' => $contact,
        ], 201);
    }
}
