// Copyright (c)2021 Quinn Michaels
// QR Code Deva test file

const {expect} = require('chai')
const qr = require('./index.js');

describe(qr.me.name, () => {
  beforeEach(() => {
    return qr.init()
  });
  it('Check the DEVA Object', () => {
    expect(qr).to.be.an('object');
    expect(qr).to.have.property('agent');
    expect(qr).to.have.property('vars');
    expect(qr).to.have.property('listeners');
    expect(qr).to.have.property('methods');
    expect(qr).to.have.property('modules');
  });
})
