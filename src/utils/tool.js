const tagReg = /<\/?([^<|^>]*)>/g

/**
 * string cut
 *
 * @export
 * @param {any} value
 * @param {any} limit
 * @returns
 */
export function cutStr(value, limit) {
  if (!value) {
    return ''
  }
  value = '' + value
  // remove html tag
  value = value.replace(tagReg, '')
  let strLength = 0
  const strLen = value.length
  let strCut = ''
  for (let i = 0; i < strLen; i++) {
    const a = value.charAt(i)
    strLength++
    if (encodeURI(a).length > 4) {
      // 中文字符的长度经编码之后大于4
      strLength += 1
    }
    strCut = strCut.concat(a)
    if (strLength > limit) {
      strCut = strCut.concat('...')
      return strCut
    }
    if (strLength === limit) {
      return strCut
    }
  }

  // 如果给定字符串小于指定长度，则返回源字符串；
  if (strLength < limit) {
    return value
  }
}

/**
 * simple version deep copy
 * @param {Object} obj
 */
export function deepClone(obj) {
  // obj not contain special type like：undefined,NaN,function
  return JSON.parse(JSON.stringify(obj))
}

export function jsonProp(obj) {
  // type check
  if (!obj || (typeof obj !== 'object')) {
    return obj
  }
  Object.keys(obj).forEach((key) => {
    if ((typeof obj[key]) === 'object') {
      obj[key] = JSON.stringify(obj[key])
    }
  })
  return obj
}

// 获取cookie
export function getCookie(cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
  }
  return ''
}
// 设置cookie
export function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + '=' + escape(value) +
    ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}
// 删除cookie
export function delCookie(name) {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--;) {
      if (keys[i] === name) {
        document.cookie = keys[i] + '=1;path=/;expires=' + (new Date(-1).toUTCString())
        return
        // 试试
      }
    }
  }
}

// 获取url参数
export function getParamer(paramer) {
  var url = window.location.href.split('?')[1]
  if (url) {
    if (url.indexOf('&') > 0) {
      var urlParamArry = url.split('&')
      for (var i = 0; i < urlParamArry.length; i++) {
        var paramerName = urlParamArry[i].split('=')
        if (paramer == paramerName[0]) {
          return paramerName[1]
        }
      }
    } else {
      if (paramer == url.split('=')[0]) {
        var paramerValue = url.split('=')[1]
        return paramerValue
      }
    }
  }
  return null;
}
// 获取URL参数
export function serilizeUrl(url) {
  var result = {}
  url = url.split('?')[1]
  var map = url.split('&')
  for (var i = 0; i < map.length; i++) {
    result[map[i].split('=')[0]] = map[i].split('=')[1]
  }
  return result
}

export function format(date, format) {
  if (typeof date === 'string') {
    if (date.indexOf('T') >= 0) {
      date = date.replace('T', ' ')
    }
    date = new Date(Date.parse(date.replace(/-/g, '/')))
  }
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  var w = [
    ['日', '一', '二', '三', '四', '五', '六'],
    ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  ]
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(w+)/.test(format)) {
    format = format.replace(RegExp.$1, w[RegExp.$1.length - 1][date.getDay()])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

/**
 * 获取上一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
export function getPreMonth(date) {
  var arr = date.split('-')
  var year = arr[0] // 获取当前日期的年份
  var month = arr[1] // 获取当前日期的月份
  var day = arr[2] // 获取当前日期的日
  var days = new Date(year, month, 0)
  days = days.getDate() // 获取当前日期中月的天数
  var year2 = year
  var month2 = parseInt(month) - 1
  if (month2 == 0) {
    year2 = parseInt(year2) - 1
    month2 = 12
  }
  var day2 = day
  var days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  var t2 = year2 + '-' + month2
  return t2
}

// 深拷贝
export function clone(Obj) {
  var newObj
  if (Obj instanceof Array) {
    newObj = [] // 创建一个空的数组
    var i = Obj.length
    while (i--) {
      newObj[i] = clone(Obj[i])
    }
    return newObj
  } else if (Obj instanceof Object) {
    newObj = {} // 创建一个空对象
    for (var k in Obj) { // 为这个对象添加新的属性
      newObj[k] = clone(Obj[k])
    }
    return newObj
  } else {
    return Obj
  }
}

// 排序
export function compare(prop) {
  return function(obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]; if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}
