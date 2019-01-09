String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

const FUNCTIONS = {
  replaceBool: function(s, replace) {
    if (s.replaceBool === true) {
      s.replaceBool = ["X", "-"];
    }

    if (replace === true || replace == "true") {
      replace = s.replaceBool[0];
    } else if (replace === false || replace == "false") {
      replace = s.replaceBool[1];
    }
  
    return replace;
  },
  
  noEmpty: function (s, replace) {
    if (s.noEmpty === true) {
      s.noEmpty = "-";
    }
    if (Number.isNaN(parseFloat(replace)) && replace == "") {
      replace = s.noEmpty;
    } else if (replace == "" || replace == undefined) {
      replace = 0;
    }
  
    return replace;
  },

  valueColoring: function(s, replace, varName) {
    let color = "";
    if (!s.valueColoring.hasOwnProperty("elements")) {
      console.error("HTML-Renderer: No elements defined!");
      return replace;
    }

    if (!s.valueColoring.colors) {
      s.valueColoring.colors = ["red", "green"];
    }

    if (!Number.isNaN(parseFloat(replace)) && s.valueColoring.elements.includes(varName)) {
      let number = parseFloat(replace);
      if (s.valueColoring.colors.length === 3) {
        if (number < 0) {
          color = s.valueColoring.colors[0];
        } else if (number == 0) {
          color = s.valueColoring.colors[1];
        } else {
          color = s.valueColoring.colors[2];
        }
      } else if (s.valueColoring.colors.length === 2) {
        if (number < 0) {
          color = s.valueColoring.colors[0];
        } else {
          color = s.valueColoring.colors[1];
        }
      } else {
        console.error("HTML-Renderer: Provide at least two and not more than three colors for the Value Coloring!");
      }
      return `<span style="color: ${color}">${replace}</span>`;
    }
    return replace;
  },
}

const WRITER = {
  string:"",
  formatter:{},
  sub1:"{{",
  sub2:"}}",
  result:"",
  settings: {},
  settingFunctions: FUNCTIONS,
  
  getHtmlString: function (string, data) {
    if (Array.isArray(data)) {
      for (let i=0; i<data.length; i++) {
        this.checkForVariables(string, data[i]);
      }
    } else {
      this.checkForVariables(string, data);
    }
    return this.result;
  },

  renderHTML: function(obj) {
    let target = document.getElementById(obj.targetid);
    let tableHdr = obj.tableHdr;
    this.formatter = obj.formatter;

    if (obj.settings) {
      this.settings = obj.settings;
    } else {
      this.settings = {}
    }

    if (!obj.data) {
      target.innerHTML = obj.html;
    } else {
      let html = this.getHtmlString(obj.html, obj.data);
      target.innerHTML = (tableHdr != undefined ? tableHdr : "") + html;
    }
    this.result = "";
  },

  checkForVariables:function (string, dataSet) {
    // first check to see if we do have both substrings
    if(string.indexOf(this.sub1) < 0 || string.indexOf(this.sub2) < 0) return;

    // find one result
    let output = this.replaceVariable(string, dataSet);

    // if there's more substrings
    if (output.indexOf(this.sub1) > -1 && output.indexOf(this.sub2) > -1) {
      this.checkForVariables(output, dataSet);
    } else {
      this.result = this.result + output;
    }
  },

  getCutOffLength: function(string, SP, TP) {
    return string.substring(SP, TP).length + this.sub1.length + this.sub2.length;
  },

  replaceVariable:function (string, dataSet) {
    let replace = "";

    if (string.indexOf(this.sub1) < 0 || string.indexOf(this.sub2) < 0) return false;

    const SP = string.indexOf(this.sub1)+this.sub1.length;
    let string1 = string.substr(0,SP);
    let string2 = string.substr(SP);
    const TP = string1.length + string2.indexOf(this.sub2);
    const varName = string.substring(SP,TP);
    
    if (dataSet[varName] != undefined) {
      replace = dataSet[varName];
    } else {
      console.warn("HTML-Renderer: No data provided to replace {{"+varName+"}}");
    }

    replace = this.checkSettings(replace, varName);
    replace = this.checkForFormatters(varName, dataSet, replace);
    
    return string.splice(string.indexOf(this.sub1), this.getCutOffLength(string, SP, TP), replace);
  },

  checkSettings: function(replace, varName) {
    if (this.settings) {

      for (let key in this.settings) {
        if (this.settings.hasOwnProperty(key) && this.settingFunctions.hasOwnProperty(key)) {
          replace = this.settingFunctions[key](this.settings, replace, varName);
        }
      }
    }
    return replace;
  },

  checkForFormatters: function(varName, dataSet, replace) {
    let op = this.settings.formatter
    if (op) {
      if (op[varName]) {
        if (typeof(op[varName]) != "function") {
          return op[varName];
        } else {
          return op[varName](dataSet[varName]);
        }
      }
    }

    return replace;
  }  
};
