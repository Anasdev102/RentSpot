# RENTSPOT — Database Structure

هاد الملف فيه شرح مفصل للجداول ديال مشروع **RENTSPOT**، مع fields ديال كل table، النوع ديالهم، واش ضروريين ولا اختياريين، والدور ديال كل field.

---

## 1. Table: `users`

هاد table كتخزن جميع المستخدمين ديال التطبيق، سواء كانوا **user** أو **admin**.

| Field | Type | Required | Role / Description |
|---|---|---|---|
| `id` | BIGINT / ID | Yes | المفتاح الأساسي ديال user. Laravel كيعطيه auto increment. |
| `name` | VARCHAR | Yes | الاسم الكامل ديال المستخدم. |
| `email` | VARCHAR / UNIQUE | Yes | يستعمل فـ login، reset password، والتواصل. خاص يكون unique. |
| `password` | VARCHAR | Yes | كلمة السر مشفرة بـ Hash. |
| `phone` | VARCHAR | No | رقم الهاتف. اختياري، يمكن استعماله للتواصل مع المستخدم. |
| `role` | ENUM(`user`, `admin`) | Yes | كيميز بين المستخدم العادي و admin. default = `user`. |
| `created_at` | TIMESTAMP | Yes | تاريخ إنشاء الحساب. |
| `updated_at` | TIMESTAMP | Yes | تاريخ آخر تعديل. |

### Roles:

- `admin`: كيدير إدارة الملاعب، الحجوزات، المستخدمين، والإحصائيات.
- `user`: كيشوف الملاعب، يدير réservation، ويقدر يدير review.

---

## 2. Table: `sports`

هاد table فيها أنواع الرياضات المتاحة فالتطبيق.

| Field | Type | Required | Role / Description |
|---|---|---|---|
| `id` | BIGINT / ID | Yes | المفتاح الأساسي ديال sport. |
| `name` | VARCHAR / UNIQUE | Yes | اسم الرياضة، مثال: Football, Tennis, Padel. |
| `icon` | VARCHAR | No | icon أو image name ديال الرياضة، يستعمل فـ frontend. |
| `created_at` | TIMESTAMP | Yes | تاريخ إضافة الرياضة. |
| `updated_at` | TIMESTAMP | Yes | تاريخ آخر تعديل. |

### Relation:

- Sport واحد يقدر يكون عندو بزاف ديال stadiums.

---

## 3. Table: `stadiums`

هاد table هي قلب المشروع، فيها معلومات الملاعب / terrains لي كيتحجزو.

| Field | Type | Required | Role / Description |
|---|---|---|---|
| `id` | BIGINT / ID | Yes | المفتاح الأساسي ديال stadium. |
| `sport_id` | FOREIGN ID | Yes | كيربط stadium مع sport معين من table `sports`. |
| `name` | VARCHAR | Yes | اسم الملعب، مثال: Terrain Al Amal. |
| `description` | TEXT | No | وصف الملعب، نوع الأرضية، الإضاءة، الخدمات... |
| `city` | VARCHAR | Yes | المدينة لي كاين فيها الملعب. مهمة للبحث و filter. |
| `address` | VARCHAR | No | العنوان الكامل أو التقريبي ديال الملعب. |
| `price_per_hour` | DECIMAL(8,2) | Yes | الثمن بالساعة. كيتستعمل لحساب total price ديال réservation. |
| `capacity` | INTEGER | No | عدد اللاعبين أو الطاقة الاستيعابية. |
| `is_active` | BOOLEAN | Yes | واش الملعب ظاهر ومتاح للحجز. default = true. |
| `created_at` | TIMESTAMP | Yes | تاريخ إضافة الملعب. |
| `updated_at` | TIMESTAMP | Yes | تاريخ آخر تعديل. |

### Relations:

- Stadium belongs to Sport.
- Stadium has many Images.
- Stadium has many Reservations.
- Stadium has many Reviews.

---

## 4. Table: `stadium_images`

هاد table كتخزن الصور ديال كل ملعب.

| Field | Type | Required | Role / Description |
|---|---|---|---|
| `id` | BIGINT / ID | Yes | المفتاح الأساسي ديال image. |
| `stadium_id` | FOREIGN ID | Yes | كيربط الصورة مع stadium معين. |
| `image_path` | VARCHAR | Yes | path ديال الصورة فـ storage، مثال: `stadiums/image1.jpg`. |
| `is_main` | BOOLEAN | No | كتحدد واش الصورة هي الرئيسية. ممكن تستعملها أو تكتفي بأول صورة. |
| `created_at` | TIMESTAMP | Yes | تاريخ إضافة الصورة. |
| `updated_at` | TIMESTAMP | Yes | تاريخ آخر تعديل. |

### Notes:

- إذا بغيتي simple، يمكن تجيب أول صورة فقط بلا ما تعتمد على `is_main`.
- إذا بغيتي professional، خلي `is_main` باش admin يختار الصورة الرئيسية.

---

## 5. Table: `reservations`

هاد table كتخزن الحجوزات ديال المستخدمين.

| Field | Type | Required | Role / Description |
|---|---|---|---|
| `id` | BIGINT / ID | Yes | المفتاح الأساسي ديال reservation. |
| `user_id` | FOREIGN ID | Yes | المستخدم لي دار الحجز. |
| `stadium_id` | FOREIGN ID | Yes | الملعب لي تحجز. |
| `date` | DATE | Yes | نهار الحجز. |
| `start_time` | TIME | Yes | وقت بداية الحجز. |
| `end_time` | TIME | Yes | وقت نهاية الحجز. |
| `total_price` | DECIMAL(8,2) | Yes | الثمن النهائي، يتحسب فـ backend حسب عدد الساعات × price_per_hour. |
| `status` | ENUM(`pending`, `confirmed`, `cancelled`, `completed`) | Yes | حالة الحجز. default = `pending`. |
| `created_at` | TIMESTAMP | Yes | تاريخ إنشاء الحجز. |
| `updated_at` | TIMESTAMP | Yes | تاريخ آخر تعديل. |

### Status roles:

- `pending`: الحجز تسجل ولكن باقي ما تأكدش.
- `confirmed`: الحجز تأكد من طرف admin أو بعد payment.
- `cancelled`: الحجز تلغى.
- `completed`: الحجز تسالا.

### Important logic:

- خاص تمنع double booking:
  - نفس `stadium_id`
  - نفس `date`
  - نفس الوقت أو وقت متداخل

---

## 6. Table: `payments`

هاد table كتخزن معلومات الأداء ديال reservation.

| Field | Type | Required | Role / Description |
|---|---|---|---|
| `id` | BIGINT / ID | Yes | المفتاح الأساسي ديال payment. |
| `reservation_id` | FOREIGN ID | Yes | كيربط payment مع reservation. |
| `amount` | DECIMAL(8,2) | Yes | المبلغ لي خاص يتخلص. غالباً نفس `total_price`. |
| `status` | ENUM(`unpaid`, `paid`, `failed`, `refunded`) | Yes | حالة الأداء. default = `unpaid`. |
| `transaction_id` | VARCHAR | No | ID ديال العملية من payment gateway مثل Stripe. يكون nullable. |
| `paid_at` | TIMESTAMP | No | وقتاش تخلص الحجز. يكون null قبل payment. |
| `created_at` | TIMESTAMP | Yes | تاريخ إنشاء payment. |
| `updated_at` | TIMESTAMP | Yes | تاريخ آخر تعديل. |

### Notes:

- حيدنا `method` حيث عندك غير online payment فقط.
- `transaction_id` مهم إلا استعملتي Stripe أو payment gateway.
- إذا المشروع غير simulation، يمكن تخليه nullable.

---

## 7. Table: `reviews`

هاد table كتخزن تقييمات المستخدمين للملاعب.

| Field | Type | Required | Role / Description |
|---|---|---|---|
| `id` | BIGINT / ID | Yes | المفتاح الأساسي ديال review. |
| `user_id` | FOREIGN ID | Yes | المستخدم لي كتب review. |
| `stadium_id` | FOREIGN ID | Yes | الملعب لي عليه review. |
| `rating` | INTEGER | Yes | تقييم من 1 حتى 5. |
| `comment` | TEXT | No | تعليق المستخدم. اختياري. |
| `created_at` | TIMESTAMP | Yes | تاريخ إنشاء review. |
| `updated_at` | TIMESTAMP | Yes | تاريخ آخر تعديل. |

### Important logic:

- user ما خاصوش يدير أكثر من review لنفس stadium.
- يمكن تحسب average rating لكل stadium باستعمال reviews.

---

# Summary of Relations

```txt
User hasMany Reservations
User hasMany Reviews

Sport hasMany Stadiums

Stadium belongsTo Sport
Stadium hasMany StadiumImages
Stadium hasMany Reservations
Stadium hasMany Reviews

Reservation belongsTo User
Reservation belongsTo Stadium
Reservation hasOne Payment

Payment belongsTo Reservation

Review belongsTo User
Review belongsTo Stadium
```

---

# Tables nécessaires للبداية

```txt
users
sports
stadiums
stadium_images
reservations
payments
reviews
```

هاد structure كافية باش تبدا backend ديال RENTSPOT بطريقة منظمة وقابلة للتطوير.

