
class EnvelopeGenerator {
  constructor(context) {
    this.attackTime = 0.05;
    this.decayTime = 0.2;
    this.releaseTime = 0.1;
    this.sustainLevel = 0.1;
    this.context = context;
    this.timeout = null;
    this.gainNode = null;
  }

  trigger() {
    let now = this.context.currentTime;
    this.gainNode.cancelScheduledValues(now);
    this.gainNode.setValueAtTime(0, now);
    this.gainNode.linearRampToValueAtTime(1, now + this.attackTime);
    this.gainNode.linearRampToValueAtTime(this.sustainLevel, now + this.attackTime + this.decayTime);
    clearTimeout(this.timeout);
  }

  untrigger(callback) {
    let now = this.context.currentTime;
    this.gainNode.cancelScheduledValues(now);
    this.gainNode.linearRampToValueAtTime(0, now + this.releaseTime);
    if (typeof callback !== 'undefined') {
      this.timeout = setTimeout(callback, 1000 * this.releaseTime);
    }
  }

  connect(gainNode) {
    this.gainNode = gainNode;
  }
}

export default EnvelopeGenerator
