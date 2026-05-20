<p>Hello,</p>

<p>A new contact message was submitted from RENTSPOT.</p>

<p><strong>Name:</strong> {{ $contact->name }}</p>
<p><strong>Email:</strong> {{ $contact->email }}</p>
@if ($contact->subject)
    <p><strong>Subject:</strong> {{ $contact->subject }}</p>
@endif

<p><strong>Message:</strong></p>
<div style="padding: 12px; background: #f5f7fb; border-radius: 8px;">
    {!! nl2br(e($contact->message)) !!}
</div>

<p>You can also manage this message from the RENTSPOT admin dashboard.</p>
