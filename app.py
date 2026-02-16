from flask import Flask, render_template
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    # Context variables for the template
    context = {
        'age': 24,
        'year': datetime.now().year,
        'name': 'Sayang', # Terms of endearment as requested
    }
    return render_template('index.html', **context)

if __name__ == '__main__':
    app.run(debug=True, port=5048)
