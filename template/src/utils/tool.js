// 通用封装的工具方法
// 创建uuid
export const uuid = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return uuid;
};

// 判断type
export const isType = (obj) => {
  return (obj === undefined || obj === null) ? obj : (obj.constructor && obj.constructor.toString().match(/function\s*([^(]*)/)[1]);  // eslint-disable-line
};

// 改变数组中item位置
export const swapItem = (arr, fromIndex, toIndex) => {
  if (isType(arr) === 'Array' && arr.length) {
    arr[toIndex] = arr.splice(fromIndex, 1, arr[toIndex])[0];
  }
  return arr;
};

// emoji html 2 text
export const emojiHtml2Text = (html) => {
  //   去除br标签
  html = html.replace(/<br\s*\/?>/gi, '\n').replace(/^ +/g, '').replace(/ +$/g, '').replace(/&nbsp;/g, '\t');
  html = html.replace(/<div>/gi, '\n').replace(/<\/div>/gi, '');
  return html;
};

export const http2Html = (text) => {
  const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|%)+)/g;
  return text.replace(reg, '<a class="yit-url-link" target="_blank" href="$1$2">$1$2</a>');
};

// emoji text 转 html
export const emojiText2Html = (text, emojiObj) => {
  const reg = /\[\d{4}\]/gi;
  if (!text) {
    return text;
  }
  return text.replace(reg, (word) => {
    return `<img src="${emojiObj[word]}" class="yit-emoji__item-icon-img">`;
  });
};

// text 2 html
export function text2Html(text) {
  text = text.replace(/\n/gi, '<br>').replace(/\t/gi, '&nbsp;');
  return text;
}

// html 转 text
export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

export const unescapeHTML = (html) => {
  return html.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
};

export const escapeHTML = (text) => {
  return text.replace(/[<>]/g, function(match, pos, originalText) {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
    }
  });
};

// 英文字母首字母大写
export const char1stUpperCase = (str) => {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
};

// 去空格
export const trim = (s) => {
  if (isType(s) !== 'String') {
    return s;
  }
  const str = s.replace(/^\s\s*/, '');
  const ws = /\s/;
  let i = str.length;
  while (ws.test(str.charAt(--i)))
    ;
  return str.slice(0, i + 1);
};

// 获取数组最后一个值不改变原数组
export const arrayLast = arr => arr[arr.length - 1];

// 检查对象数组中是否含有某一个属性值
export const checkDup = (array, name, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i][name] === value) {
      return true;
    }
  }
  return false;
};


// 解决JSON格式化报错问题
export const censor = (censor) => {
  let i = 0;
  return function(key, value) {
    if (i !== 0 && typeof (censor) === 'object' && typeof (value) === 'object' && censor === value) { return '[Circular]' }
    if (i >= 29) // seems to be a harded maximum of 30 serialized objects?
    { return '[Unknown]' }
    ++i; // so we know we aren't using the original object anymore
    return value;
  };
};

// 获取url查询变量
export const getQueryString = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};
