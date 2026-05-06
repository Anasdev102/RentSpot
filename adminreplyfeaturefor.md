Add an admin reply feature for contact messages.

Requirements:

* In the Contact Message details page/modal, add a “Reply” button.
* When admin clicks Reply, show a textarea for the response.
* Create API endpoint:
  POST /api/admin/contact-messages/{id}/reply

Behavior:

* Only admin can reply.
* Validate reply message as required.
* Send the reply to the sender email.
* Save the reply in database.
* Update contact message status to `replied`.
* Store:

  * contact_id
  * admin_id
  * reply_message
  * sent_at
  * timestamps

Create a `contact_replies` table linked to `contacts` and `users`.

Admin UI:

* Show previous replies under the message details.
* Show status badge as “replied” after sending.
* Display success/error states.
* Keep design clean and professional.

