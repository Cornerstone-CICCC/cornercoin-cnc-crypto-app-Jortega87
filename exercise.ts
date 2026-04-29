abstract class Transaction {
  protected account: Account;
  protected amount: number;

  constructor(account: Account, amount: number) {
    this.account = account;
    this.amount = amount;
  }

  abstract get value(): number;

  commit(): boolean {
    if (!this.isAllowed()) {
      console.log("❌ Transaction rejected: insufficient funds");
      return false;
    }

    this.account.addTransaction(this);
    return true;
  }

  isAllowed(): boolean {
    return true;
  }
}

class Deposit extends Transaction {
  constructor(account: Account, amount: number) {
    super(account, amount);
  }

  get value(): number {
    return this.amount;
  }

  isAllowed(): boolean {
    return true;
  }
}

class Withdrawal extends Transaction {
  constructor(account: Account, amount: number) {
    super(account, amount);
  }

  get value(): number {
    return -this.amount;
  }

  isAllowed(): boolean {
    return this.account.getBalance() >= this.amount;
  }
}

class Account {
  public username: string;
  private transactions: Transaction[] = [];

  constructor(username: string) {
    this.username = username;
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  getBalance(): number {
    return this.transactions.reduce((total, t) => total + t.value, 0);
  }

  getTransactionHistory(): Transaction[] {
    return this.transactions;
  }
}

const myAccount = new Account("snow-patrol");

const t1 = new Deposit(myAccount, 500);
t1.commit();

const t2 = new Withdrawal(myAccount, 50.25);
t2.commit();

const t3 = new Deposit(myAccount, 120);
t3.commit();

const t4 = new Withdrawal(myAccount, 999); // should fail

console.log("Transaction 1:", t1);
console.log("Transaction 2:", t2);
console.log("Transaction 3:", t3);
console.log("Transaction 4:", t4);

console.log("Balance:", myAccount.getBalance());

console.log(
  "History:",
  myAccount.getTransactionHistory().map((t) => ({
    type: t.constructor.name,
    amount: t["amount"],
    value: t.value,
  }))
);


// TEST CASES


console.log("\n===== CREATING ACCOUNT =====");


console.log("\n===== INITIAL BALANCE =====");
console.log("Balance:", myAccount.getBalance()); // expected: 0

console.log("\n===== DEPOSIT 500 =====");
const d1 = new Deposit(myAccount, 500);
d1.commit();
console.log("Balance:", myAccount.getBalance()); // expected: 500

console.log("\n===== WITHDRAW 50.25 =====");
const w1 = new Withdrawal(myAccount, 50.25);
w1.commit();
console.log("Balance:", myAccount.getBalance()); // expected: 449.75

console.log("\n===== DEPOSIT 120 =====");
const d2 = new Deposit(myAccount, 120);
d2.commit();
console.log("Balance:", myAccount.getBalance()); // expected: 569.75

console.log("\n===== INVALID WITHDRAWAL (999) =====");
const w2 = new Withdrawal(myAccount, 999);
const result = w2.commit();
console.log("Transaction success:", result); // expected: false
console.log("Balance (should NOT change):", myAccount.getBalance()); // expected: 569.75

console.log("\n===== TRANSACTION HISTORY =====");
myAccount.getTransactionHistory().forEach((t, i) => {
  console.log(`${i + 1}. ${t.constructor.name} | amount: ${t["amount"]} | value: ${t.value}`);
});