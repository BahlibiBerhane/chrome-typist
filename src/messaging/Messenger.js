class Messenger {

  constructor(options) {
    this.correspondent = options.correspondent;
  }

  start() {
    chrome.runtime.onMessage.addListener((request) => {
      if ((
        (request.to === this.correspondent.name) ||
        (request.to === 'all')
      ) &&
        (request.from !== this.correspondent.name)
      ) {
        this.correspondent.trigger(request.message, request.data);
      }
    });

    if (typeof chrome.commands !== 'undefined') {
      chrome.commands.onCommand.addListener((command) => {
        this.correspondent.trigger(`command:${command}`);
      });
    }
  }

  sendMessage(to, message, data) {
    const msg = this.buildMessage(to, message, data);

    if (typeof chrome.tabs !== 'undefined') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, msg);
      });
    } else {
      chrome.runtime.sendMessage(msg);
    }
  }

  buildMessage(to, message, data) {
    const msg = {
      to,
      from: this.correspondent.name,
      message: `${this.correspondent.name}:${message}`,
      data,
    };

    return msg;
  }

}

export default Messenger;
