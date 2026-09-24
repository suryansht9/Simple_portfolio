#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define FILENAME "bankdata.dat"

typedef struct {
    int accountNo;
    char name[50];
    float balance;
} Account;

void createAccount() {
    Account acc;
    FILE *fp = fopen(FILENAME, "ab");

    printf("Enter account number: ");
    scanf("%d", &acc.accountNo);
    printf("Enter name: ");
    scanf(" %[^\n]", acc.name);
    printf("Enter initial deposit: ");
    scanf("%f", &acc.balance);

    fwrite(&acc, sizeof(Account), 1, fp);
    fclose(fp);
    printf("Account created successfully!\n\n");
}

void viewAccounts() {
    Account acc;
    FILE *fp = fopen(FILENAME, "rb");

    printf("\n--- Account List ---\n");
    while (fread(&acc, sizeof(Account), 1, fp)) {
        printf("Account No: %d | Name: %s | Balance: %.2f\n", acc.accountNo, acc.name, acc.balance);
    }
    fclose(fp);
    printf("---------------------\n\n");
}

void depositMoney() {
    int accNo;
    float amount;
    Account acc;
    int found = 0;

    FILE *fp = fopen(FILENAME, "rb+");

    printf("Enter account number: ");
    scanf("%d", &accNo);

    while (fread(&acc, sizeof(Account), 1, fp)) {
        if (acc.accountNo == accNo) {
            printf("Enter amount to deposit: ");
            scanf("%f", &amount);
            acc.balance += amount;
            fseek(fp, -sizeof(Account), SEEK_CUR);
            fwrite(&acc, sizeof(Account), 1, fp);
            printf("Deposit successful! New balance: %.2f\n\n", acc.balance);
            found = 1;
            break;
        }
    }

    if (!found) printf("Account not found.\n\n");
    fclose(fp);
}

void withdrawMoney() {
    int accNo;
    float amount;
    Account acc;
    int found = 0;

    FILE *fp = fopen(FILENAME, "rb+");

    printf("Enter account number: ");
    scanf("%d", &accNo);

    while (fread(&acc, sizeof(Account), 1, fp)) {
        if (acc.accountNo == accNo) {
            printf("Enter amount to withdraw: ");
            scanf("%f", &amount);
            if (amount > acc.balance) {
                printf("Insufficient balance!\n\n");
            } else {
                acc.balance -= amount;
                fseek(fp, -sizeof(Account), SEEK_CUR);
                fwrite(&acc, sizeof(Account), 1, fp);
                printf("Withdrawal successful! New balance: %.2f\n\n", acc.balance);
            }
            found = 1;
            break;
        }
    }

    if (!found) printf("Account not found.\n\n");
    fclose(fp);
}

void checkBalance() {
    int accNo;
    Account acc;
    int found = 0;

    FILE *fp = fopen(FILENAME, "rb");

    printf("Enter account number: ");
    scanf("%d", &accNo);

    while (fread(&acc, sizeof(Account), 1, fp)) {
        if (acc.accountNo == accNo) {
            printf("Account No: %d | Name: %s | Balance: %.2f\n\n", acc.accountNo, acc.name, acc.balance);
            found = 1;
            break;
        }
    }

    if (!found) printf("Account not found.\n\n");
    fclose(fp);
}

int main() {
    int choice;

    do {
        printf("\n--- Bank Management System ---\n");
        printf("1. Create Account\n");
        printf("2. View All Accounts\n");
        printf("3. Deposit Money\n");
        printf("4. Withdraw Money\n");
        printf("5. Check Balance\n");
        printf("6. Exit\n");
        printf("Choose an option: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: createAccount(); break;
            case 2: viewAccounts(); break;
            case 3: depositMoney(); break;
            case 4: withdrawMoney(); break;
            case 5: checkBalance(); break;
            case 6: printf("Thank you for using our system.\n"); break;
            default: printf("Invalid choice. Try again.\n");
        }
    } while (choice != 6);

    return 0;
}
