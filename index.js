// Copyright (c)2021 Quinn Michaels
// QR Deva

const fs = require('fs');
const path = require('path');

const data_path = path.join(__dirname, 'data.json');
const {agent,vars} = require(data_path).data;

const Deva = require('@indra.ai/deva');
const QR = new Deva({
  agent: {
    uid: agent.uid,
    key: agent.key,
    name: agent.name,
    describe: agent.describe,
    prompt: agent.prompt,
    voice: agent.voice,
    profile: agent.profile,
    translate(input) {
      return input.trim();
    },
    parse(input) {
      return input.trim();
    }
  },
  vars,
  listeners: {},
  modules: {
    qrcode: require('qrcode'),
  },
  deva: {},
  func: {
    /**************
    func: todataurl
    params: opts
    describe: Generate a QR Code data url.
    ***************/
    todataurl(opts) {
      return new Promise((resolve, reject) => {
        this.modules.qrcode.toDataURL(opts.q.text,this.vars.qr).then(qr => {
          return resolve({
            text:`${opts.q.text}\n${qr}`,
            html:`<img src="${qr}"/>`,
            data: {
              qr,
            },
          })
        }).catch(err => {
          return this.error(err, opts, reject)
        })
      });
    }
  },
  methods: {
    /**************
    method: get
    params: packet
    describe: Call teh todataurl function and return a qr code.
    ***************/
    get(packet) {
      return this.func.todataurl(packet);
    },

    /**************
    method: uid
    params: packet
    describe: Generate a system unique id.
    ***************/
    uid(packet) {
      return Promise.resolve(this.uid());
    },

    /**************
    method: status
    params: packet
    describe: Return the current status for the deva.
    ***************/
    status(packet) {
      return this.status();
    },

    /**************
    method: help
    params: packet
    describe: Help system for the QR Deva.
    ***************/
    help(packet) {
      return new Promise((resolve, reject) => {
        this.lib.help(packet.q.text, __dirname).then(help => {
          return this.question(`#feecting parse ${help}`);
        }).then(parsed => {
          return resolve({
            text: parsed.a.text,
            html: parsed.a.html,
            data: parsed.a.data,
          });
        }).catch(reject);
      });
    }
  }
});
module.exports = QR
