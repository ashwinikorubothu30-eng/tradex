# Connect TradeX to a Real Database (MongoDB Atlas)

Every **registration**, **login**, **trade**, and **portfolio** row is saved in MongoDB. Demo accounts are optional — real users sign up at `/register`.

## Do not share passwords in chat

Put your database username and password only in `backend/.env` on your machine. Never commit `.env` to Git.

---

## Step 1: Create MongoDB Atlas cluster

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **free cluster** (M0).
3. **Database Access** → Add user → choose username + password (save them).
4. **Network Access** → Add IP → **Allow access from anywhere** (`0.0.0.0/0`) for development, or your home IP for production.

---

## Step 2: Get connection string

1. Click **Connect** on your cluster → **Drivers**.
2. Copy the connection string. It looks like:

```
mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

3. Replace `YOUR_USER` and `YOUR_PASSWORD` with your database user.
4. Add a database name before `?`:

```
mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tradex?retryWrites=true&w=majority
```

---

## Step 3: Configure backend

Edit `stock-trading-system/backend/.env`:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tradex?retryWrites=true&w=majority
JWT_SECRET=use_a_long_random_string_here
INITIAL_VIRTUAL_BALANCE=100000
```

Restart the backend after saving.

---

## Step 4: Seed stocks (once)

This adds the stock catalog only if the database has no stocks. It does **not** delete your registered users.

```bash
cd backend
npm run seed
```

Optional demo logins (only if you want them):

```env
SEED_DEMO_USERS=true
```

Then run `npm run seed` again.

---

## Step 5: How new users register

1. Open **http://localhost:3000/register**
2. Enter name, email, password (min 6 characters)
3. Account is created in MongoDB with **$100,000** virtual balance
4. User can log in, trade, and all data persists in Atlas

To make someone an admin, change their `role` to `ADMIN` in MongoDB Atlas → Browse Collections → `users` → edit document.

---

## Optional: Live stock prices

1. Register at [https://finnhub.io/register](https://finnhub.io/register) (free).
2. Add to `backend/.env`:

```env
FINNHUB_API_KEY=your_key_here
```

3. Restart backend. Prices update from the market every 30 seconds.

Without this key, prices are simulated but **user data is still real** in MongoDB.

---

## Verify data in Atlas

Atlas → **Database** → **Browse Collections** → database `tradex`:

| Collection     | What it stores        |
|----------------|------------------------|
| `users`        | Registered accounts    |
| `stocks`       | Stock catalog          |
| `portfolios`   | Holdings per user      |
| `transactions` | Buy/sell history       |
