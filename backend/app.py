from flask import Flask

app = Flask(__name__)

@app.route("/")
def default():
    return "<h1>Home page text</h1>"



@app.route("/api/arr-data")
def get_arr_data():




@app.route("/api/gpu-performance")
def hello_world():
    return "<h1>Hello, World!</h1>"





@app.route("/api/servers")
def goodbye_world():
    return "<h1>Goodbye, World!</h1>"

