function getError(action, option, xhr) {
  let msg;
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to post ${action} ${xhr.status}`;
  }

  const err = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = action;
  return err;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

export function upload(option) {
  if (typeof XMLHttpRequest === 'undefined') {
    return;
  }

  const xhr = new XMLHttpRequest();
  const action = option.action; // 上传远程地址

  if (xhr.upload) {
    xhr.upload.onprogress = function(e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
      }
      option.onProgress(e);
    };
  }

  const formData = new FormData();

  // 多个文件上传
  if (option.files) {
    Object.keys(option.files).forEach(key => {
      formData.append(option.prefixName + '.content' + key, option.files[key]);
    });
  }
  // 单个文件上传
  // option.filename 上传文件的前缀
  if (option.file) {
    formData.append(option.prefixName, option.file);
  }

  xhr.onerror = function(e) {
    option.onError(e);
  };

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr));
    }

    option.onSuccess(getBody(xhr));
  };

  xhr.open('post', action, true);

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  for (let item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }
  xhr.send(formData);
  return xhr;
}


export function ajax(options = {}) {
  /**
   * 默认为GET请求
   * */
  options.type = (options.type || 'GET').toUpperCase();
  /**
   * 返回值类型默认为json
   * */
  options.dataType = options.dataType || 'json';
  /**
   * 默认为异步请求
   * */
  options.async = options.async || true;

  const params = getParams(options.data);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let status = xhr.status;
      if (status >= 200 && status < 300) {
        options.success && options.success(getBody(xhr));
      } else {
        options.error && options.error(getError(options.url, options, xhr));
      }
    }
  };
  if (options.type === 'GET') {
    xhr.open('GET', options.url + '?' + params, options.async);
    xhr.send(null);
  } else if (options.type === 'POST') {
    xhr.open('POST', options.url, options.async);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
  }

  return xhr;
}

/**
* 对象参数的处理
* @param data
* @returns {string}
*/
function getParams(data) {
  let arr = [];
  for (let param in data) {
    if (data[param]) {
      arr.push(encodeURIComponent(param) + '=' + encodeURIComponent(data[param]));
    }
  }
  console.log(arr);
  arr.push(('randomNumber=' + Math.random()).replace('.'));
  console.log(arr);
  return arr.join('&');
}


export function ajaxPromise(options) {
  const { url, type, data, dataType, async } = options;
  return new Promise((resolve, reject) => {
    ajax({
      url: url, // 请求地址
      type: type,   // 请求方式
      data: data, // 请求参数
      dataType: dataType,     // 返回值类型的设定
      async: async,   // 是否异步
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}
