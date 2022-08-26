// Copyright (c)2021 Quinn Michaels
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
    get(packet) {
      return this.func.todataurl(packet);
    },
    uid(packet) {
      return Promise.resolve(this.uid());
    },
    status(packet) {
      return this.status();
    },
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
  },
  onError(err) {
    console.error(err);
  }
});
module.exports = QR
