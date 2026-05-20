<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(public Contact $contact)
    {
    }

    public function build()
    {
        return $this
            ->replyTo($this->contact->email, $this->contact->name)
            ->subject('New RENTSPOT contact message: ' . ($this->contact->subject ?: 'No subject'))
            ->view('emails.contact-message');
    }
}
