# תשובות למבדק בית

## שאלה 1  
📄 קובץ: [Question_1.jsx](https://github.com/Michal-Feder/HarelTask/blob/main/Question_1.jsx)  
🔗 דוגמה חיה: [StackBlitz - שאלה 1](https://stackblitz.com/edit/vitejs-vite-tb96ewer)

---

## שאלה 2  
📄 קובץ: [Question_2.jsx](https://github.com/Michal-Feder/HarelTask/blob/main/Question_2.jsx)  
🔗 דוגמה חיה: [StackBlitz - שאלה 2](https://stackblitz.com/edit/vitejs-vite-tb96ewer)

---

## שאלה 3 – שיפור ביצועים  
השתמשתי בגישות מומלצות לשיפור ביצועים:

- **וירטואליזציה (`react-window`)**: מרנדרת רק את הפריטים הנראים, מפחיתה עומס DOM.  
- **`React.memo`**: מונע רינדור חוזר של רכיבי ListItem אם ה-props שלהם לא השתנו.  
- **`useCallback`**: ממזכר פונקציות כמו handleSelect ו-handleEditStart, ומונע רינדור מיותר של רכיבי ילד.  
- **`useMemo`**: ממזכר ערכים כמו filteredItems ו-itemData, ומונע חישובים יקרים שוב ושוב.  
- **Debouncing (עבור חיפוש)**: מבצע פילטור רק לאחר השהיה בהקלדה, משפר את חווית המשתמש ומונע רינדורים תכופים.  

📄 קובץ: [Question_3.jsx](https://github.com/Michal-Feder/HarelTask/blob/main/Question_3.jsx)  
🔗 דוגמה חיה: [StackBlitz - שאלה 3](https://stackblitz.com/edit/vitejs-vite-tb96ewer)

---

## שאלה 4  
📄 קובץ: [Question_4.js](https://github.com/Michal-Feder/HarelTask/blob/main/%E2%80%8F%E2%80%8FQuestion_4.js)  
🔗 דוגמה חיה: [StackBlitz - שאלה 4](https://stackblitz.com/edit/stackblitz-starters-fsattnsn)

---

## שאלה 5  
📄 קובץ: [Question_5.js](https://github.com/Michal-Feder/HarelTask/blob/main/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8FQuestion_5.js)  
🔗 דוגמה חיה: [StackBlitz - שאלה 5](https://stackblitz.com/edit/stackblitz-starters-fsattnsn)

---

## שאלה 6  
📄 קובץ: [Question_6.js](https://github.com/Michal-Feder/HarelTask/blob/main/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8FQuestion_6.js)  
🔗 דוגמה חיה: [StackBlitz - שאלה 6](https://stackblitz.com/edit/stackblitz-starters-fsattnsn)

---

## שאלה 7  

אשתמש ב־Load Balancer / Auto Scaling לניהול עומסים, וב־CDN ו־Caching (כגון Redis) לשיפור מהירות.  
ב־DB אשתמש באינדקסים מתאימים, Pagination, ו־Connection Pooling. אבטח עם Rate Limiting וניטור שוטף.  
עבור פעולות כבדות – אעביר ל־Processing Async בתורי הודעות. אם המערכת מורכבת – אפרק ל־Microservices לצורך תחזוקה וסקייל נפרד לכל חלק.

### ארחיב את הנקודות שציינתי:

#### 1. סקיילביליות וניהול עומסים  
- Load Balancer – הפניית בקשות בין שרתים במקביל.  
- Auto Scaling – התאמה אוטומטית של כמות המיקרו-שירותים/שרתים לפי עומס.  
- CDN – להגשת תכנים סטטיים ולהפחתת עומס על ה־API.  

#### 2. שיפור ביצועים  
- Caching (למשל Redis/Memcached) – אחסון תוצאות זמניות של קריאות נפוצות.  
- Database Indexing – אינדקסים לשליפות מהירות, עם איזון נכון מול עלויות עדכון.  
- Connection Pooling – הפחתת overhead של פתיחת חיבורים ל-DB.  
- Pagination & Filtering – הגבלת כמות הנתונים שמוחזרת בכל בקשה.  
- בחירת סוג בסיס הנתונים – התאמת SQL/NoSQL לפי סוג הנתונים ואופי הבקשות.  

#### 3. אבטחה ועמידות  
- Rate Limiting / Throttling – מניעת עומס יתר והגנה מפני התקפות.  
- Logging & Monitoring – למעקב בזמן אמת וניתוח בעיות.  

#### 4. תכנון ארכיטקטורה  
- Microservices – חלוקת השירות לפי תחומים עצמאיים לניהול טוב יותר של סקייל.  
- Asynchronous Processing – שימוש ב־Message Queues (Kafka, SQS, RabbitMQ) למשימות רקע.  

---

## שאלה 8  

- AMAZON S3 לאחסון הקבצים עצמם.  
- AWS IAM לניהול הרשאות גישה מאובטחת  
- וכדאי גם להשתמש ב־Amazon CloudFront שזה גישה בצורה מאובטחת באמצעות CDN.

### השלבים הם:
1. יצירת Bucket ב-S3  
2. הגדרת מדיניות Bucket (Bucket Policy) או IAM Role – כדי לשלוט מי יכול לגשת ל-Bucket ולבצע פעולות עליו  
3. העלאת קבצים ל-S3 – באמצעות Presigned URL או דרך השרת, לאחר שהמשתמש העלה את הקובץ  
4. גישה לקבצים מ-S3 – ניתן לגשת לקבצים באמצעות כתובת URL ישירה, או באמצעות CloudFront להגשה מהירה  

📄 קובץ לדוגמה: [Question_8.js](https://github.com/Michal-Feder/HarelTask/blob/main/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8FQuestion_8.js)
