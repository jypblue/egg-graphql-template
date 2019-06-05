function getDecimalLen(num) {
  if (!num) return;
  return num.toString().split('.')[1] ? num.toString().split('.')[1].length : 0;
}
export default {
  bind: (el, binding) => {
    let input = el.querySelector('input');
    let max = binding.value || 2;
    input.addEventListener('keypress', e => {
      let key = e.key;
      let val = e.target.value;
      // 过滤非数字/第二个./大于两位小数
      if ((/\D/.test(key) && key !== '.') || (val.toString().indexOf('.') > -1 && key === '.') || getDecimalLen(val) >= max) {
        e.preventDefault();
      }
    }, false);
  }
};