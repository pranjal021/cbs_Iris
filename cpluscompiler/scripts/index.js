var Main, VariablePanel, getCookie, setCookie;

setCookie = function(cname, cvalue) {
  return document.cookie = encodeURIComponent(cname) + "=" + encodeURIComponent(cvalue) + "; ";
};

getCookie = function(cname) {
  var c, ca, j, len, name;
  name = encodeURIComponent(cname) + "=";
  ca = document.cookie.split(';');
  for (j = 0, len = ca.length; j < len; j++) {
    c = ca[j];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return decodeURIComponent(c.substring(name.length, c.length));
    }
  }
};

VariablePanel = React.createClass({
  displayName: "VariablePanel",
  render: function() {
    var i, j, last, lastVar, lastVars, lastVarsMap, len, mydebugger, ref, updated, v, vars;
    mydebugger = this.props["debugger"];
    ref = this.props, vars = ref.vars, lastVars = ref.lastVars;
    lastVarsMap = {};
    for (j = 0, len = lastVars.length; j < len; j++) {
      lastVar = lastVars[j];
      lastVarsMap[lastVar.name] = lastVar;
    }
    return React.createElement(Table, {
      "striped": true,
      "bordered": true,
      "hover": true
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Name"), React.createElement("th", null, "Value"), React.createElement("th", null, "Type"))), React.createElement("tbody", null, (function() {
      var k, len1, results;
      results = [];
      for (i = k = 0, len1 = vars.length; k < len1; i = ++k) {
        v = vars[i];
        last = lastVarsMap[v.name];
        updated = (last == null) || last.value !== v.value || last.type !== v.type;
        results.push(React.createElement("tr", {
          "key": v.name,
          "className": (updated ? "updated-variable-item" : void 0)
        }, React.createElement("td", null, v.name), React.createElement("td", null, v.value), React.createElement("td", null, v.type)));
      }
      return results;
    })()));
  }
});

Main = React.createClass({
  displayName: "Main",
  getInitialState: function() {
    return {
      code: this.defaultCode,
      output: "",
      input: "5 6",
      status: "editing",
      markers: [],
      vars: [],
      lastVars: []
    };
  },
  defaultCode: "#include <iostream>\nusing namespace std;\nint main() {\n    int x, y;\n    cin >> x >> y;\n    cout << x + y << endl;\n    return 0;\n}",
  componentDidMount: function() {
    jQuery.hotkeys.options.filterInputAcceptingElements = false;
    jQuery.hotkeys.options.filterContentEditable = false;
    $(document).bind("keydown", "ctrl+s", this.quickSave);
    return $(document).bind("keydown", "ctrl+o", this.quickLoad);
  },
  onChange: function(code) {
    return this.setState({
      code: code
    });
  },
  quickSave: function(e) {
    if (e != null) {
      e.preventDefault();
    }
    return setCookie("code", this.state.code);
  },
  quickLoad: function(e) {
    if (e != null) {
      e.preventDefault();
    }
    return this.setState({
      code: getCookie("code")
    });
  },
  handleError: function(e) {
    return this.setState({
      output: this.output + "\n" + e
    });
  },
  run: function(debug, e) {
    var code, config, exitCode, input;
    e.preventDefault();
    code = this.state.code;
    input = this.state.input;
    this.output = "";
    config = {
      stdio: {
        drain: function() {
          var x;
          x = input;
          input = null;
          return x;
        },
        write: (function(_this) {
          return function(s) {
            _this.output += s;
            _this.setState({
              output: _this.output
            });
          };
        })(this)
      },
      debug: debug
    };
    if (debug) {
      this.preDebug();
      try {
        this["debugger"] = JSCPP.run(code, input, config);
        return this.startDebug();
      } catch (error) {
        e = error;
        this.handleError(e);
        return this.debug_stop();
      }
    } else {
      this.preRun();
      try {
        exitCode = JSCPP.run(code, input, config);
        return this.postRun(exitCode);
      } catch (error) {
        e = error;
        this.handleError(e);
        return this.setState({
          status: "editing"
        });
      }
    }
  },
  preDebug: function() {
    this.codeBackup = this.state.code;
    return this.setState({
      output: "",
      status: "debugging"
    });
  },
  startDebug: function() {
    this.setState({
      code: this["debugger"].src,
      vars: [],
      lastVars: []
    });
    return this.debug_stepinto();
  },
  postDebug: function(exitCode) {
    var exitInfo;
    exitInfo = "\n C++ program exited with code " + exitCode + ".";
    return this.setState({
      output: this.output + exitInfo
    });
  },
  updateMarkers: function() {
    var lastVars, marker, s, vars;
    s = this["debugger"].nextNode();
    lastVars = this.state.vars;
    vars = this["debugger"].variable();
    marker = new Range(s.sLine - 1, s.sColumn - 1, s.sLine - 1, s.sColumn);
    return this.setState({
      markers: [marker],
      vars: vars,
      lastVars: lastVars
    });
  },
  debug_continue: function() {
    return this.debug_stepinto();
  },
  debug_stepinto: function() {
    var done, e;
    try {
      done = this["debugger"]["continue"]();
      if (done !== false) {
        this.debug_stop();
        return this.postDebug(done.v);
      } else {
        return this.updateMarkers();
      }
    } catch (error) {
      e = error;
      this.handleError(e);
      return this.debug_stop();
    }
  },
  debug_stepover: function() {
    return this.debug_stepinto();
  },
  debug_stepout: function() {
    return this.debug_stepinto();
  },
  debug_stop: function() {
    this["debugger"] = null;
    return this.setState({
      status: "editing",
      code: this.codeBackup,
      markers: []
    });
  },
  preRun: function() {
    this.setState({
      output: "",
      status: "running"
    });
    return this.timer = new Date().getTime();
  },
  postRun: function(exitCode) {
    var ellaps, exitInfo;
    if (this.timer) {
      ellaps = new Date().getTime() - this.timer;
      this.timer = null;
      exitInfo = "\nC++ program exited with code " + exitCode + " in " + ellaps + "ms.";
      return this.setState({
        output: this.output + exitInfo,
        status: "editing"
      });
    }
  },
  onChangeInput: function(e) {
    return this.setState({
      input: this.refs.input.getValue()
    });
  },
  onChangeOutput: function(e) {
    return this.setState({
      output: this.refs.output.getValue()
    });
  },
  download: function() {
    var event, pom;
    pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.code));
    pom.setAttribute('download', 'file.cpp');
    if (document.createEvent != null) {
      event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      return pom.dispatchEvent(event);
    } else {
      return pom.click();
    }
  },
  upload: function() {
    return this.refs.hiddenfile.getDOMNode().click();
  },
  handleFile: function(e) {
    var file, files, fr;
    files = e.target.files;
    if (files.length > 0) {
      file = files.item(0);
      fr = new FileReader();
      fr.onloadend = (function(_this) {
        return function() {
          return _this.setState({
            code: fr.result
          });
        };
      })(this);
      return fr.readAsText(file);
    }
  },
  filemenu: function(eventKey) {
    switch (eventKey) {
      case "quick-open":
        return this.quickLoad();
      case "quick-save":
        return this.quickSave();
      case "download":
        return this.download();
      case "upload":
        return this.upload();
    }
  },
  render: function() {
    var brand, code, debugging, editing, input, lastVars, markers, output, ref, running, status, vars;
    ref = this.state, code = ref.code, input = ref.input, output = ref.output, status = ref.status, markers = ref.markers, vars = ref.vars, lastVars = ref.lastVars;
    debugging = status === "debugging";
    editing = status === "editing";
    running = status === "running";
    brand = React.createElement("a", {
      "href": "../../index.html",
      "className": "logo"
    }, "IRIS");
    return React.createElement("div", null, React.createElement("input", {
      "type": "file",
      "ref": "hiddenfile",
      "style": {
        display: "none"
      },
      "onChange": this.handleFile
    }), React.createElement(Navbar, {
      "brand": brand
    }, React.createElement(Nav, null, React.createElement(DropdownButton, {
      "title": "File",
      "onSelect": this.filemenu
    }, React.createElement(MenuItem, {
      "eventKey": "quick-open"
    }, React.createElement(Glyphicon, {
      "glyph": "floppy-open"
    }), "New File (Ctrl + O)"), 
    
    React.createElement(MenuItem, {
      "eventKey": "upload"
    }, React.createElement(Glyphicon, {
      "glyph": "upload"
    }), "Open File"), React.createElement(MenuItem, {
      "eventKey": "download"
    }, React.createElement(Glyphicon, {
      "glyph": "save"
    }), "Save File")), React.createElement(NavItem, {
      "href": "#",
      "onClick": (editing ? this.run.bind(this, false) : void 0),
      "disabled": !editing
    }, React.createElement(Glyphicon, {
      "glyph": "play"
    }), "Run"), React.createElement(NavItem, {
      "href": "#",
      "onClick": (editing ? this.run.bind(this, true) : void 0),
      "disabled": !editing
    }, React.createElement(Glyphicon, {
      "glyph": "sunglasses"
    }), "Debug"))), React.createElement(Grid, null, (debugging ? React.createElement(Row, {
      "className": "debug-toolbar"
    }, React.createElement(Col, {
      "md": 12
    }, React.createElement(ButtonGroup, null, React.createElement(Button, {
      "disabled": true,
      "onClick": this.debug_continue
    }, "Continue"), React.createElement(Button, {
      "onClick": this.debug_stepinto
    }, "Step Into"), React.createElement(Button, {
      "disabled": true,
      "onClick": this.debug_stepover
    }, "Step Over"), React.createElement(Button, {
      "disabled": true,
      "onClick": this.debug_stepout
    }, "Step Out"), React.createElement(Button, {
      "onClick": this.debug_stop
    }, "Stop")))) : void 0), React.createElement(Row, {
      "className": "main-row"
    }, React.createElement(Col, {
      "md": (debugging ? 8 : 12)
    }, React.createElement(AceEditor, {
      "ref": "editor",
      "name": "editor",
      "className": "editor",
      "value": code,
      "onChange": this.onChange,
      "theme": "monokai",
      "readOnly": !editing,
      "markers": markers,
      "onLoad": (function(editorInstance) {
        editorInstance.container.style.resize = "both";
        return document.addEventListener("mouseup", function(e) {
          return editorInstance.resize();
        });
      })
    })), (debugging ? React.createElement(Col, {
      "md": 4
    }, React.createElement(VariablePanel, {
      "mydebugger": this["debugger"],
      "vars": vars,
      "lastVars": lastVars
    })) : void 0)), React.createElement(Row, {
      "className": "io-row"
    }, React.createElement(Col, {
      "md": 6
    }, React.createElement(Input, {
      "ref": "input",
      "className": "input-area",
      "type": "textarea",
      "label": "Standard Input",
      "rows": 5,
      "value": input,
      "onChange": this.onChangeInput
    })), React.createElement(Col, {
      "md": 6
    }, React.createElement(Input, {
      "ref": "output",
      "className": "output-area",
      "type": "textarea",
      "label": "Standard Output",
      "rows": 5,
      "value": output,
      "onChange": this.onChangeOutput
    })))));
  }
});

React.render(React.createElement(Main, null), document.getElementById("mycontainer"));
