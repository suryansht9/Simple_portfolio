```python
# Filename: unemployment_analysis.py
# 📊 Unemployment Analysis Project

# Step 1: Import Libraries
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

plt.style.use("seaborn")

# Step 2: Load Dataset
df = pd.read_csv("Unemployment in India.csv")
print(df.head())

# Step 3: Cleaning & Preparation
df.rename(columns={
    "Region": "State",
    "Frequency": "Frequency",
    "Date": "Date",
    "Estimated Unemployment Rate (%)": "UnemploymentRate",
    "Estimated Employed": "Employed",
    "Estimated Labour Participation Rate (%)": "LabourParticipation"
}, inplace=True)

df["Date"] = pd.to_datetime(df["Date"])
df["Year"] = df["Date"].dt.year
df["Month"] = df["Date"].dt.month

print(df.info())

# Step 4: Visualization

# 4.1 Unemployment over time
plt.figure(figsize=(12,6))
sns.lineplot(x="Date", y="UnemploymentRate", data=df)
plt.title("Unemployment Rate Over Time")
plt.show()

# 4.2 State-wise unemployment
plt.figure(figsize=(14,7))
state_avg = df.groupby("State")["UnemploymentRate"].mean().sort_values(ascending=False)
sns.barplot(x=state_avg.values, y=state_avg.index, palette="viridis")
plt.title("Average Unemployment Rate by State")
plt.show()

# 4.3 Covid-19 impact
pre_covid = df[df["Year"] < 2020]["UnemploymentRate"].mean()
post_covid = df[df["Year"] >= 2020]["UnemploymentRate"].mean()
print("Avg Unemployment before 2020:", round(pre_covid,2))
print("Avg Unemployment from 2020:", round(post_covid,2))

# 4.4 Monthly trend
plt.figure(figsize=(12,6))
sns.lineplot(x="Month", y="UnemploymentRate", data=df)
plt.title("Average Unemployment Rate by Month")
plt.show()

# Step 5: Save Cleaned Dataset
df.to_csv("Cleaned_Unemployment.csv", index=False)
```
