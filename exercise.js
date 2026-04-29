"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transaction {
    account;
    amount;
    constructor(account, amount) {
        this.account = account;
        this.amount = amount;
    }
    commit() {
        if (!this.isAllowed()) {
            console.log("❌ Transaction rejected: insufficient funds");
            return false;
        }
        this.account.addTransaction(this);
        return true;
    }
    isAllowed() {
        return true;
    }
}
class Deposit extends Transaction {
    constructor(account, amount) {
        super(account, amount);
    }
    get value() {
        return this.amount;
    }
    isAllowed() {
        return true;
    }
}
class Withdrawal extends Transaction {
    constructor(account, amount) {
        super(account, amount);
    }
    get value() {
        return -this.amount;
    }
    isAllowed() {
        return this.account.getBalance() >= this.amount;
    }
}
class Account {
    username;
    transactions = [];
    constructor(username) {
        this.username = username;
    }
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }
    getBalance() {
        return this.transactions.reduce((total, t) => total + t.value, 0);
    }
    getTransactionHistory() {
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
console.log("History:", myAccount.getTransactionHistory().map((t) => ({
    type: t.constructor.name,
    amount: t["amount"],
    value: t.value,
})));
