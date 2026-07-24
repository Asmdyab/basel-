# آخر تعديلات الواجهة

- حذف صفحة العروض والأسعار من المسارات والتنقل.
- حذف صفحة حجز الملعب وصفحة حجوزاتي من المسارات والتنقل.
- أصبح بدء تسجيل التدريب من صفحة الملاعب فقط.
- زر "تسجيل تمرين" في كارت الملعب ينقل إلى تفاصيل تدريب اللعبة على نفس الملعب.
- صفحة تفاصيل التدريب تعرض المواعيد فقط من غير اختيار موعد.
- الإدارة هي التي تحدد الموعد النهائي بعد مراجعة الطلب.
- اختيار الكابتن ما زال متاحًا، مع صفحة CV كاملة لكل كابتن.
- تمرير الملعب المختار إلى صفحة الكابتن ثم نموذج التسجيل.
- حفظ اسم ورقم الملعب داخل طلب التدريب وعرضه في صفحة المستخدم والإدارة.
- إضافة برامج ومدربين لكرة القدم والفولتا والباد بول لتغطية كل الملاعب الموجودة.

## Notification center update

- Added `/notifications` as a protected user page.
- Added a notification bell in the navbar with an unread badge.
- Training approval/rejection creates a user notification.
- Booking approval/rejection creates a user notification.
- Users can filter unread notifications, mark all as read, open, delete, or clear notifications.
- The current demo stores notifications in `localStorage`. Production use across devices requires a backend database and SignalR/Web Push.

## Coach selection removed
- Coach cards and CV pages are now view-only.
- Users can register without selecting a coach.
- The administration assigns the coach and final appointment after reviewing the request.
- Coach cards were made smaller and more compact.


## Court catalog update
- Removed Padel Court 2.
- Removed Football, Volta, and Bad Ball courts.
- Added a full Handball court entry linked to the Handball training flow.
- Remaining court catalog: Padel Court 1, Basketball, Handball, and Tennis.
