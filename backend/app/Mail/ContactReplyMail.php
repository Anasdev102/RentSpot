<?php

namespace App\Mail;

use App\Models\Contact;
use App\Models\ContactReply;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactReplyMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public Contact $contact,
        public ContactReply $reply
    ) {
    }

    public function build()
    {
        return $this
            ->subject('RENTSPOT reply: ' . ($this->contact->subject ?: 'Contact message'))
            ->view('emails.contact-reply');
    }
}
