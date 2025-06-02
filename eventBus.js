class EventBus {
  constructor() {
    this.events = {};
  }
  on(key, fn) {
    if (!this.events[key]) {
      this.events[key] = []
    }
    this.events[key].push(fn);
  }
  emit(key, ...args) {
    if (!this.events[key]) {
      return;
    }
    this.events[key].forEach(fn => {
      fn.apply(null, args)
    })
  }
  /**
   * 如果未传递 fn，则卸载整个事件的所有方法
   * 如果传递 fn，则卸载指定方法
   * @param {*} key 
   * @param {*} fn 
   */
  off(key, fn) {
    if (!this.events[key]) {
      return;
    }
    if (!fn) {
      this.events[key] = [];
      return;
    }
    const index = this.events[key].findIndex(item => item === fn)
    if (index > -1) {
      this.events[key].splice(index, 1)
    }

  }
  /**
   * 执行一次后销毁
   */
  once(key, fn) {
    if (!this.events[key]) {
      this.events[key] = []
    }

    const wrapFn = (...args) => {
      this.off(key, wrapFn)
      fn.apply(null, args)
    }
    this.events[key].push(wrapFn)
  }
}


const bus = new EventBus();

bus.on('update', (name, age) => {
  console.log(`update by ${name} in ${age}`);
})

bus.on('color-change', (color = 'red') => {
  console.log('color-change to ' + color);
})

bus.once('start', () => {
  console.log('Let\'s start');
})

bus.emit('start')
bus.emit('start')

bus.emit('update', 'chp', 18);
bus.emit('color-change', 'green');

bus.off('update');
bus.emit('update'); // 不触发

