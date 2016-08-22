
function EnvelopeGenerator(context) {
  this.attackTime = 0.05;
  this.decayTime = 0.2;
  this.releaseTime = 0.1;
  this.sustainLevel = 0.1;
  this.context = context;
  this.timeout = null;

  var that = this;
  $(document).bind('gateOn', function (_) {
    that.trigger();
  });
  $(document).bind('setAttack', function (_, value) {
    that.attackTime = value;
  });
  $(document).bind('setRelease', function (_, value) {
    that.releaseTime = value;
  });
};

EnvelopeGenerator.prototype.trigger = function() {
  let now = this.context.currentTime;
  this.param.cancelScheduledValues(now);
  this.param.setValueAtTime(0, now);
  this.param.linearRampToValueAtTime(1, now + this.attackTime);
  this.param.linearRampToValueAtTime(this.sustainLevel, now + this.attackTime + this.decayTime);
  clearTimeout(this.timeout);
};

EnvelopeGenerator.prototype.untrigger = function(cb) {
  let now = this.context.currentTime;
  this.param.cancelScheduledValues(now);
  this.param.linearRampToValueAtTime(0, now + this.releaseTime);
  if (typeof cb !== 'undefined') {
    this.timeout = setTimeout(cb, 1000 * this.releaseTime);
  }
};

EnvelopeGenerator.prototype.connect = function(param) {
  this.param = param;
};

