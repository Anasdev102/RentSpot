<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\ContactReply;
use App\Mail\ContactReplyMail;
use App\Services\UserNotificationService;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactMessageController extends Controller
{
    public function index(Request $request)
    {
        $query = Contact::with('user:id,name,email,phone')->latest()->latest('id');

        $query->when($request->query('status'), fn ($q, $status) => $q->where('status', $status));
        $query->when($request->query('search'), function ($q, $search) {
            $q->where(fn ($inner) => $inner
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('subject', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%"));
        });

        return $query->cursorPaginate(15);
    }

    public function show(Contact $contactMessage)
    {
        return $contactMessage->load(['user:id,name,email,phone', 'replies.admin:id,name,email']);
    }

    public function markAsRead(Contact $contactMessage)
    {
        $contactMessage->update(['status' => Contact::STATUS_READ]);

        return $contactMessage->load(['user:id,name,email,phone', 'replies.admin:id,name,email']);
    }

    public function markAsReplied(Contact $contactMessage)
    {
        $contactMessage->update(['status' => Contact::STATUS_REPLIED]);

        UserNotificationService::send(
            $contactMessage->user_id,
            'contact_reply',
            'Admin replied',
            'Admin replied to your contact message: ' . ($contactMessage->subject ?: 'No subject'),
            '/#contact'
        );

        return $contactMessage->load(['user:id,name,email,phone', 'replies.admin:id,name,email']);
    }

    public function reply(Request $request, Contact $contactMessage)
    {
        $data = $request->validate([
            'reply_message' => ['required', 'string', 'max:5000'],
        ]);

        $reply = ContactReply::create([
            'contact_id' => $contactMessage->id,
            'admin_id' => $request->user()->id,
            'reply_message' => $data['reply_message'],
            'sent_at' => now(),
        ]);

        try {
            Mail::to($contactMessage->email)->send(new ContactReplyMail($contactMessage, $reply));
        } catch (Throwable $exception) {
            $reply->delete();

            return response()->json([
                'message' => 'Reply could not be sent. Check mail configuration and try again.',
            ], 422);
        }

        $contactMessage->update(['status' => Contact::STATUS_REPLIED]);

        return $contactMessage->load(['user:id,name,email,phone', 'replies.admin:id,name,email']);
    }

    public function destroy(Contact $contactMessage)
    {
        try {
            $contactMessage->delete();
        } catch (QueryException $exception) {
            return response()->json(['message' => 'Unable to delete contact message.'], 422);
        }

        return response()->noContent();
    }
}
