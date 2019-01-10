const MsgToast = {
  toastCount: {
    "top-left": 0,
    "top-right": 0,
    "bottom-left": 0,
    "bottom-right": 0
  },

  types: {
    success: {
      background: "#aff1c7",
      border_color: "green"
    },
    warning: {
      background: "#ffffc8",
      border_color: "yellow"
    },
    error: {
      background: "#ff9898",
      border_color: "red"
    }
  },

  positions: {
    "top-left": "left: 0;",
    "top-right": "right: 0;",
    "bottom-left": "bottom: 0; left: 0",
    "bottom-right": "bottom: 0; right: 0"
  },

  notify: function (settings){
    if (!settings.text) throw "No Text passed through!";

    this.addToast(settings.text, settings);
  },

  getContainer: function (position) {
    let container = document.getElementById(`toastsContainer-${position}`);
    if (container) {
      return container;
    } else {
      return this.createContainer(position);
    }
  },

  createContainer: function(position) {
    let body = document.getElementsByTagName("body")[0];
    let bodyHTML = body.innerHTML;
    let positionCss = this.positions[position] ? this.positions[position] : this.positions["top-right"];

    let containerHtml = `<div id="toastsContainer-${position}" style="position: absolute; margin: 10px; ${positionCss}"></div>`;
    body.innerHTML = containerHtml + bodyHTML;

    return document.getElementById(`toastsContainer-${position}`);
  },

  destroyContainer: function(position) {
    document.getElementById(`toastsContainer-${position}`).remove();
  },

  addToast: function (msg, settings) {
    // set default values if no value is passed
    settings = this.setDefaults(settings);

    let id = Math.random().toString(36).substring(7);
    const html = `<div class="toast" id="${id}" style="
    background: ${settings.type.background};
    min-height: 20px;
    min-width: 100px;
    max-width: 300px;
    text-align: center;
    font-family: arial;
    border: 2px solid ${settings.type.border_color};
    border-radius: 5px;
    margin: 5px 0;">
      <p style="margin: 5px;">${msg}</p>
    </div>`;

    if (!settings.position) {
      settings.position = "top-left";
    }

    toastsElement = this.getContainer(settings.position);

    if (!toastsElement) throw "No element to put Messagetoasts into!"

    currToasts = toastsElement.innerHTML;
    currToasts = html + currToasts;

    toastsElement.innerHTML = currToasts;
    this.toastCount[settings.position]++;

    setTimeout(() => {
      document.getElementById(id).remove();
      this.toastCount[settings.position]--;

      if (this.toastCount[settings.position] < 1) {
        this.destroyContainer(settings.position);
      }
    }, parseInt(settings.displayTime))
  },

  setDefaults: function(settings) {
    if (!settings.type) {
      settings.type = this.types.success;
    } else {
      settings.type = this.types[settings.type.toLowerCase()];
    }

    if (!settings.displayTime) {
      settings.displayTime = 5000;
    }

    return settings;
  }

}
