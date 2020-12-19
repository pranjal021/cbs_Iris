from flask import Flask, request, jsonify
from judge import runProcess
from flask_cors import CORS
import zulip

app = Flask('dexter')
CORS(app)

@app.route('/compile', methods=['POST'])
def compile():
    content = r'' + request.form['content']
    
    with open('intermediate.py', 'w') as f:
        
        for i in content:
            f.write(i)
       

    outBuf, errBuf = runProcess(['python', 'intermediate.py'])
    return jsonify({'out': str(outBuf), 'err': str(errBuf)})


@app.route('/js', methods=['POST'])
def interpret():
    content = r'' + request.form['content']
   
    with open('intermediate.js', 'w') as f:
        
        for i in content:
            f.write(i)

      

    outBuf, errBuf = runProcess(['node', 'intermediate.js'])
    return jsonify({'out': str(outBuf), 'err': str(errBuf)})


@app.route('/zulip', methods=['POST'])
def zulip():
  
    email = 'kuchtohtha@gmail.com'
    content = request.form['content']
    client.send_message({
        "type": "private",
        "to": email,
        "content": content,
    })
    return 'ok'



if __name__ == '__main__':
    app.run(debug=True)
