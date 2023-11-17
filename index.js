// Copyright (c)2021 Quinn Michaels
// QR Deva
const {agent,vars} = require('./data.json').DATA;

const package = require('./package.json');
const info = {
  id: package.id,
  name: package.name,
  version: package.version,
  author: package.author,
  describe: package.description,
  dir: __dirname,
  url: package.homepage,
  git: package.repository.url,
  bugs: package.bugs.url,
  license: package.license,
  copyright: package.copyright
};

const Deva = require('@indra.ai/deva');
const QR = new Deva({
  info,
  agent,
  vars,
  utils: {
    translate(input) {return input.trim();},
    parse(input) {return input.trim();},
    process(input) {return input.trim();},
  },
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
  }
});
module.exports = QR
