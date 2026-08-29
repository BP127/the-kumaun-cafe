# 📊 How to Save Orders to Google Sheets

Follow these steps carefully. It takes about 5–7 minutes.

---

## Step 1: Create a Google Sheet

1. Go to [https://sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Rename it to **The Kumaun Cafe – Orders**
4. In the first row (Row 1), type these exact column headers:

| A          | B          | C     | D             | E     | F     | G     | H      |
|------------|------------|-------|---------------|-------|-------|-------|--------|
| Order ID   | Timestamp  | Table | Customer Name | Items | Total | Notes | Status |

5. Make the header row **bold**.

---

## Step 2: Create the Apps Script

1. In the same Google Sheet, click **Extensions → Apps Script**
2. Delete any code that is already there
3. Paste the **entire code** below:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.orderId,
      data.timestamp,
      data.table,
      data.customerName,
      data.items,
      data.total,
      data.notes,
      data.status
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("The Kumaun Cafe Order Receiver is working!")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Click the **Save** icon (💾) and give the project a name: `KumaunCafeOrders`

---

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to “Select type” → choose **Web app**
3. Fill in:
   - **Description**: Order receiver
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Google will ask for authorization:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to KumaunCafeOrders (unsafe)**
   - Click **Allow**
6. After deployment you will see a **Web App URL** that looks like:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
   ```
7. **Copy this full URL**

---

## Step 4: Paste the URL into the menu code

1. Open the file `js/app.js`
2. Find this line near the top:

```js
const GOOGLE_SCRIPT_URL = ""; // ← PASTE your Google Script URL here
```

3. Paste your URL between the quotes:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec";
```

4. Save the file and upload the updated `app.js` to GitHub (or re-upload the whole project).

---

## Step 5: Test it

1. Open your live menu website
2. Add any item → Place Order → enter a table number
3. Go back to your Google Sheet
4. Within a few seconds a new row should appear with the order details

✅ Done! Every future order will automatically be saved in the sheet.

---

## Important Notes

- The sheet must stay in your Google account (do not delete it).
- If you ever change the script, you must create a **New deployment** again and update the URL.
- Orders still also go to WhatsApp (both systems work together).
- You can share the Google Sheet with your staff so they can see all orders live.

---

## Optional: Make a nice view for staff

In the Google Sheet you can:
- Freeze the header row
- Add filters (Data → Create a filter)
- Sort by Timestamp descending
- Share the sheet link with kitchen staff (View only or Edit)
