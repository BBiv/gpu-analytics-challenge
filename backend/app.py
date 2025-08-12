import csv
import datetime
from flask import Flask

app = Flask(__name__)

@app.route("/")
def default():
    return "<h1>Home page text</h1>"


@app.route("/api/arr-data")
def get_arr_data():
    return { "data": calculate_arr_data("data/gpu_daily_earnings_rows.csv") }


def calculate_arr_data(file_path):      # pseudocode in Index 1a
    monthly_revenues = {}
    try:
        with open(file_path, "r") as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header
            for row in reader:
                month, rev = row[1][0:4] + "-" + row[1][5:7], float(row[2])
                if monthly_revenues.get(month):
                    monthly_revenues[month] += rev
                else:
                    monthly_revenues.update({month: rev})
            return encapsulate(monthly_revenues)
    except FileNotFoundError:
        return "File not found"

def encapsulate(monthly_revenues):
    arr_data = []
    for month in sorted(monthly_revenues):
        arr_data.append({"month": month, "arr": calculate_arr(round(monthly_revenues[month], 2))})
    return arr_data
        
    return arr_data
def calculate_arr(monthly_revenue):
    return monthly_revenue * 12


@app.route("/api/gpu-performance")
def hello_world():
    return "<h1>Hello, World!</h1>"



@app.route("/api/servers")
def goodbye_world():
    return "<h1>Goodbye, World!</h1>"

