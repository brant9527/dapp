class CFClient {
  env: string;
  api_env: any;
  debug: boolean;
  uri: any;
  requestMaps: any;
  listeners: any;
  timer: any;
  listenerId: number;
  readyed: boolean;
  readyCallbacks: any;
  autoReconnect: boolean;
  reconnectTime: number;
  subscribes: any;
  userListeners: any;
  ws: any;

  constructor(opts: any) {
    this.env = opts.env ? opts.env : "local";
    this.api_env = opts.api_env;
    this.debug = !!opts.debug;
    this.uri = opts.uri;
    this.requestMaps = {};
    this.listeners = {};
    this.timer = null;
    this.listenerId = 0;
    this.readyed = false;
    this.readyCallbacks = [];
    this.autoReconnect = true;
    this.reconnectTime = 1000;
    this.subscribes = [];
    this.userListeners = [];

    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.uri);
    // console.log(this.ws)
    this.ws.onopen = () => {
      this.ws.send('{"type":"handshake", "version":"1.1"}');
    };

    this.ws.onmessage = (evt: any) => {
      this.onmessage(evt);
    };

    this.ws.onclose = (evt: any) => {
      this.onclose(evt);
    };
  }

  onmessage(evt: any) {
    const msg = evt.data ? JSON.parse(evt.data) : {};
    //console.log(evt)
    if (msg.type == "handshake") {
      const interval = msg.data.heartbeat.interval;
      this.heartbeat(interval);
      this.readyed = true;
      this.reconnectTime = 1000;
      const subscribes = this.subscribes.concat();
      this.subscribes = [];
      this.resubscribe(subscribes);
      const userListeners = this.userListeners.concat();
      this.userListeners = [];
      for (const ul of userListeners) {
        this.addListener(ul.channel, ul.callback);
      }
      for (const i in this.readyCallbacks) {
        this.readyCallbacks[i].call(this, this);
      }
      this.readyCallbacks = [];
    } else if (msg.type == "response") {
      if (this.requestMaps[msg.id]) {
        const callback = this.requestMaps[msg.id];
        delete this.requestMaps[msg.id];
        callback(msg.error, msg.data);
      }
    } else if (msg.type == "push") {
      if (this.listeners[msg.channel]) {
        const listeners = this.listeners[msg.channel];
        for (const i in listeners) {
          listeners[i].callback(msg.data);
        }
      }
    }
  }

  resubscribe(subscribes: any) {
    if (subscribes.length > 20) {
      subscribes = [];
    }
    if (subscribes.length > 0) {
      const sub = subscribes.shift();
      this.subscribe(sub.channel, sub.params, sub.callback);

      setTimeout(() => {
        this.resubscribe(subscribes);
      }, 100);
    }
  }

  onclose(evt: any) {
    console.log("Connection closed.");
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.listeners = {};

    console.log("will connect after " + this.reconnectTime + " seconds");
    setTimeout(() => {
      if (this.autoReconnect) {
        if (this.reconnectTime < 5000) {
          this.reconnectTime += 1000;
        }
        this.connect();
      }
    }, this.reconnectTime);
  }

  close() {
    this.autoReconnect = false;
    this.ws.close();
  }

  heartbeat(interval: number) {
    this.timer = setInterval(() => {
      this.ws.send('{"type":"heartbeat"}');
    }, interval * 1000);
  }

  request(route: any, params: any, callback?: any) {
    if (typeof params == "function") {
      callback = params;
      params = null;
    }
    const requestId = Math.floor(Math.random() * 89999999) + 10000000;
    //console.log(requestId)
    if (typeof callback == "function") {
      this.requestMaps[requestId] = callback;
    }
    const request = {
      type: "request",
      id: requestId,
      method: route,
      params: params,
    };
    this.ws.send(JSON.stringify(request));
  }

  subscribe(channel: any, params: any, callback?: any) {
    if (typeof params == "function") {
      callback = params;
      params = null;
    }
    if (typeof callback == "function") {
      this.addListener(channel, callback, true);
    }
    const request = {
      type: "subscribe",
      channel: channel,
      params: {},
    };
    if (params) {
      request.params = params;
    }
    this.subscribes.push({ channel, params, callback });
    this.ws.send(JSON.stringify(request));
  }

  unsubscribe(channel: any, params?: any) {
    const request = {
      type: "unsubscribe",
      channel: channel,
      params: {},
    };
    if (params) {
      request.params = params;
    }
    this.ws.send(JSON.stringify(request));
    this.removeListeners(channel);
    if (channel == "*") {
      this.subscribes = [];
    } else {
      for (const i in this.subscribes) {
        const sub = this.subscribes[i];
        if (sub.channel == channel) {
          //check params ?
          this.subscribes.splice(i, 1);
          break;
        }
      }
    }
  }

  addListener(channel: any, callback: any, autoListen = false) {
    if (!channel || typeof callback != "function") {
      return;
    }
    this.listenerId++;
    if (typeof this.listeners[channel] == "undefined") {
      this.listeners[channel] = [];
    }
    if (!autoListen) {
      this.userListeners.push({
        channel,
        callback,
      });
    }
    const listeners = this.listeners[channel];
    listeners.push({
      id: this.listenerId,
      callback: callback,
    });
    return this.listenerId;
  }

  removeListener(listenerId: any) {
    for (const event in this.listeners) {
      for (const idx in this.listeners[event]) {
        if (this.listeners[event][idx].id == listenerId) {
          this.listeners[event].splice(idx, 1);
          return;
        }
      }
    }
  }

  removeListeners(event: any) {
    if (event == null || typeof event == "undefined" || event == "*") {
      this.listeners = {};
    } else if (typeof this.listeners[event] != "undefined") {
      delete this.listeners[event];
    }
  }
  ready(callback: any) {
    if (typeof callback == "function") {
      if (this.readyed) {
        callback.call(this, this);
      } else {
        this.readyCallbacks.push(callback);
      }
    }
  }
}

export default CFClient;
