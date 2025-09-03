# inventa

# 🖥️ Desktop App User Flow Design

## 1. **Authentication & Setup**

1. User installs and opens the app.
2. **Login / Register screen**

   - New user → enters business name, email, password.
   - Existing user → logs in.

3. Setup wizard (first-time use):

   - Add business details (shop name, logo, currency, tax rate if any).
   - Create initial inventory list (optional CSV import).
   - Add cashier accounts (if multiple users).

---

## 2. **Dashboard (Home Screen)**

Once logged in, user lands on **Dashboard** showing:

- 🔹 Total stock items
- 🔹 Low-stock alerts
- 🔹 Total sales today (cash + credit)
- 🔹 Outstanding credits (customers owing)
- 🔹 Profit summary (gross & net)

Navigation sidebar: **Inventory | Sales | Customers | Reports | Settings**

---

## 3. **Inventory Management**

**Flow to add stock:**

1. User clicks **Inventory → Add Item**.
2. Fill form: Item Name, Category, Purchase Price, Selling Price, Quantity, Supplier.
3. Stock is updated in real time.
4. If quantity falls below set threshold → **low-stock alert appears**.

**Flow to update stock:**

- When new purchase is made → “Restock” button → add new quantity + cost price.
- When return happens → stock increases automatically.

---

## 4. **Sales Module**

**Flow for cashier making a sale:**

1. Go to **Sales → New Sale**.
2. Search or scan item → add to cart.
3. Choose sale type:

   - 🔹 **Cash sale** (customer pays immediately).
   - 🔹 **Credit sale** (customer pays later).

4. For **bulk sales**: enter quantity (e.g., 50 units) → system deducts automatically.
5. Receipt is generated.
6. Inventory updates:

   - Sold items → deducted from stock.
   - Returned items → added back to stock.

---

## 5. **Customer & Credit Management**

**Flow when customer buys on credit:**

1. On **Sales → Credit Sale**, select or create new customer profile.
2. Enter due date for repayment.
3. System records the balance owed.

**Flow for repayment:**

- Go to **Customers → Select Customer → Record Repayment**.
- Outstanding balance reduces.
- If overdue → system shows red alert.

---

## 6. **Profit & Reports**

**Flow to check reports:**

1. Go to **Reports**.
2. Choose time filter: Daily, Weekly, Monthly, Custom.
3. View:

   - Sales summary
   - Profit (Gross = Sales – Cost; Net = Gross – Expenses)
   - Credit outstanding
   - Stock movement (purchases, sales, returns)

4. Export → **PDF, Excel, or CSV**.

---

## 7. **Settings & Users**

- Manage cashiers (permissions: cashier can sell but not delete records).
- Backup & restore database.
- Customize currency, tax, reports format.

---

# ⚡ Example User Scenario

1. **Morning** → Cashier logs in → Dashboard shows yesterday’s sales + current stock.
2. **Customer buys 10 units** → Cashier records sale → stock auto reduces.
3. **Customer returns 2 units** → Cashier processes return → stock increases.
4. **Another customer buys on credit** → Cashier records sale under credit → due date in 7 days.
5. **End of day** → Manager checks report → sees total cash sales, credit sales, and profit.
