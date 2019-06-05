// 格式化分2元
export const formatCents2Yuan = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) {
    return false;
  }
  const yuan = Math.floor(val) / 100;
  let s = yuan.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};

// 保留两位小数
export const formatToFixed2 = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) {
    return false;
  }
  const yuan = Math.floor(val * 100) / 100;
  let s = yuan.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};
