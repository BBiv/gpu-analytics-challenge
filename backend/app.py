import csv
from flask import Flask, jsonify
import logging
from datetime import datetime, timedelta

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route("/")
def default():
    return "<h1>Home page text</h1>"


@app.route("/api/arr-data")
def get_arr_data():
    """Returns the sum of all daily earnings of all GPUs for every month"""
    try:
        return calculate_arr_data("data/gpu_daily_earnings_rows.csv")
    except Exception as e:
        logging.error(f"Error in get_arr_data: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


def calculate_arr_data(file_path):
    """Calculate monthly revenues from GPU daily earnings data"""
    monthly_revenues = {}
    
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            next(reader)  # Skip the header
            for row in reader:
                month = row[1][0:4] + "-" + row[1][5:7]
                rev = float(row[2])
                if monthly_revenues.get(month):
                    monthly_revenues[month] += rev
                else:
                    monthly_revenues.update({month: rev})
            return format_output(monthly_revenues)
            
    except FileNotFoundError:
        logging.error(f"File not found: {file_path}")
        return jsonify({"error": "Data file not found"}), 404
    except PermissionError:
        logging.error(f"Permission denied accessing file: {file_path}")
        return jsonify({"error": "Permission denied accessing data file"}), 403
    except Exception as e:
        logging.error(f"Unexpected error reading file: {str(e)}")
        return jsonify({"error": "Error reading data file"}), 500


def format_output(monthly_revenues):
    """Tailors the output to look like desired output, and does the ARR Calculation"""
    arr_data = []
    
    for month in sorted(monthly_revenues.keys()):
        monthly_revenue = monthly_revenues[month]
        # Calculate ARR (Annual Recurring Revenue) from monthly revenue
        arr = calculate_arr(monthly_revenue)
        arr_data.append({
            "month": month, 
            "arr": round(arr, 2)
        })
    
    return {"data": arr_data}


def calculate_arr(monthly_revenue):
    """Calculate Annual Recurring Revenue from monthly revenue"""
    return monthly_revenue * 12


@app.route("/api/gpu-performance")
def get_gpu_performance():
    """Returns GPU performance data including count and revenue for last 7 and 30 days"""
    try:
        return get_gpu_performance_data()
    except Exception as e:
        logging.error(f"Error in get_gpu_performance: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


def get_gpu_performance_data():
    """Get GPU performance data from CSV files"""
    try:
        # Read GPUs data to get GPU types and their IDs
        gpu_types = {}  # gpu_id -> gpu_type mapping
        gpu_type_counts = {}  # gpu_type -> count mapping
        
        with open("data/gpus_rows.csv", "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            
            for row in reader:
                if len(row) >= 12:  # Ensure row has enough columns
                    gpu_id = row[0]
                    gpu_type = row[10]  # gpu_type column
                    
                    if gpu_type and gpu_type != "":  # Skip empty GPU types
                        # Hardcode GPU names for 4090 and 5090 to RTX_XXXX format
                        if gpu_type in ["4090", "5090"]:
                            gpu_type = f"RTX_{gpu_type}"
                        
                        gpu_types[gpu_id] = gpu_type
                        gpu_type_counts[gpu_type] = gpu_type_counts.get(gpu_type, 0) + 1
        
        # Calculate revenue for last 7 and 30 days as of 2025/08/05
        reference_date = datetime(2025, 8, 5)
        
        # Get revenue data for each GPU type
        gpu_type_revenue_7d = calculate_revenue_for_period(gpu_types, reference_date, 7)
        gpu_type_revenue_30d = calculate_revenue_for_period(gpu_types, reference_date, 30)
        
        # Build the result dictionary
        result = {}
        for gpu_type in gpu_type_counts.keys():
            result[gpu_type] = {
                "count": gpu_type_counts[gpu_type],
                "revenue_7d": round(gpu_type_revenue_7d[gpu_type], 2),
                "revenue_30d": round(gpu_type_revenue_30d[gpu_type], 2)
            }
        
        return { "data": result }
        
    except FileNotFoundError as e:
        logging.error(f"File not found: {str(e)}")
        return jsonify({"error": "Data file not found"}), 404
    except Exception as e:
        logging.error(f"Error processing GPU performance data: {str(e)}")
        return jsonify({"error": "Error processing GPU performance data"}), 500


def calculate_revenue_for_period(gpu_types, reference_date, days):
    """Calculate revenue for a specific period (7 or 30 days) for each GPU type"""
    period_start = reference_date - timedelta(days=days)
    
    # Initialize revenue tracking for each GPU type
    gpu_type_revenue = {gpu_type: 0.0 for gpu_type in set(gpu_types.values())}
    
    try:
        with open("data/gpu_daily_earnings_rows.csv", "r", encoding="utf-8") as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            
            for row in reader:
                if len(row) >= 3:  # Ensure row has enough columns
                    gpu_id = row[0]
                    earning_date_str = row[1]
                    gpu_amount = float(row[2])
                    
                    # Check if this GPU has a valid type
                    if gpu_id in gpu_types:
                        gpu_type = gpu_types[gpu_id]
                        
                        try:
                            earning_date = datetime.strptime(earning_date_str, "%Y-%m-%d")
                            
                            # Calculate revenue for the specified period
                            if earning_date >= period_start:
                                gpu_type_revenue[gpu_type] += gpu_amount
                                
                        except ValueError:
                            # Skip invalid date formats
                            continue
                            
    except Exception as e:
        logging.error(f"Error calculating revenue for {days} days: {str(e)}")
        # Return empty revenue dict on error
        return {gpu_type: 0.0 for gpu_type in set(gpu_types.values())}
    
    return gpu_type_revenue


@app.route("/api/servers")
def get_servers():
    return "<h1>Server Information</h1>"

