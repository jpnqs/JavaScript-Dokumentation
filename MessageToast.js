const MsgToast = {
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

  notify: function (settings){
    if (!settings.text) throw "No Text passed through!";

    this.addToast(settings.text, settings);
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

    toastsElement = document.getElementById("toasts");

    if (!toastsElement) throw "No element to put Messagetoasts into!"

    currToasts = toastsElement.innerHTML;
    currToasts = html + currToasts;

    toastsElement.innerHTML = currToasts;

    setTimeout(() => {
      document.getElementById(id).remove();
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
