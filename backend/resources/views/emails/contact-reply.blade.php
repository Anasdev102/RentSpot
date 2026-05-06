<p>Hello {{ $contact->name }},</p>

<p>Thank you for contacting RENTSPOT. Our admin team replied to your message:</p>

<div style="padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f8fafc;">
    {!! nl2br(e($reply->reply_message)) !!}
</div>

<p style="margin-top: 24px;">Your original message:</p>

<blockquote style="color: #475569;">
    {!! nl2br(e($contact->message)) !!}
</blockquote>

<p>RENTSPOT Team</p>
