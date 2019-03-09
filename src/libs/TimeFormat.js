let math = require('mathjs');
// 时间格式转换
export function formatDate(date, fmt) {
    // 调用例如
    // enter_apply_time  >> 时间戳
    // formatDate(new Date(enter_apply_time * 1000), 'yyyy-MM-dd hh:mm:ss')
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
};
function padLeftZero(str) {
    return ('00' + str).substr(str.length)
};
// 解决加减乘除的精度问题
export function add(parameter1, parameter2) {
    // 0.1＋0.2
    return math.format(math.chain(math.bignumber(parameter1)).add(math.bignumber(parameter2)).done());
};
// 减
export function subtract(parameter1, parameter2) {
    // 0.2-0.1
    return math.format(math.chain(math.bignumber(parameter1)).subtract(math.bignumber(parameter2)).done());
};
// 乘
export function multiply(parameter1, parameter2) {
    // 0.1*0.2
    return math.format(math.chain(math.bignumber(parameter1)).multiply(math.bignumber(parameter2)).done());
};
// 除
export function divide(parameter1, parameter2) {
    //0.1/0.2
    return math.format(math.chain(math.bignumber(parameter1)).divide(math.bignumber(parameter2)).done());
};

// 判断输入框是否为空
export function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}
// 判断带小数点的数字
    // let reg_number = /^([1-9]\d*|0)(\.\d{1,2})?$/;


// 参数1  _this.$refs.shop_info_c.$refs.input   input的ref
// 调用谷歌地图
export function GoogleMap(input, object_add) {
    var map = new google.maps.Map('')
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
    var autocomplete = new google.maps.places.Autocomplete(input)
    autocomplete.setComponentRestrictions({
        'country': ['cn','us']
    })
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name'])
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace()
        if (!place.geometry) {
            return
        }
        for (let i = 0; i < place.address_components.length; i++) {
            let addressType = place.address_components[i].types[0]
            if (object_add[addressType]) {
                let val = place.address_components[i][object_add[addressType]]
                object_add[addressType] = val
            }
            // console.log(object_add[addressType]);
        }
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport)
        } else {
            map.setCenter(place.geometry.location)
            map.setZoom(17)
        }
        // console.log(object_add);
        return object_add;
    })
    /*
    *上面方法已封装好-------》调用即可
    *下面这代码纯属单纯引用
    * ***
    navigator.geolocation.getCurrentPosition(bankmarker)
    function bankmarker(position) {
        let map = new google.maps.Map('')
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
        let autocomplete = new google.maps.places.Autocomplete(input)
        autocomplete.setComponentRestrictions({
            'country': 'us'
        })
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name'])
        autocomplete.addListener('place_changed', function () {
            let place = autocomplete.getPlace()
            if (!place.geometry) {
                window.alert("No details available for input: '" + place.name + "'")
                return
            }
            for (let i = 0; i < place.address_components.length; i++) {
                let addressType = place.address_components[i].types[0]
                if (object_add[addressType]) {
                    let val = place.address_components[i][object_add[addressType]]
                    object_add[addressType] = val
                }
            }
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport)
            } else {
                map.setCenter(place.geometry.location)
                map.setZoom(17)
            }
        })
        // return object_add
    };
    */
}
// 对象比对是否相等
export function diff(obj1, obj2) {
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    if (!o1 || !o2) { /*  判断不是对象  */
        return obj1 === obj2;
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false; //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    }
    for (var attr in obj1) {
        var t1 = obj1[attr] instanceof Object;
        var t2 = obj2[attr] instanceof Object;
        if (t1 && t2) {
            return diff(obj1[attr], obj2[attr]);
        } else if (obj1[attr] !== obj2[attr]) {
            return false;
        }
    }
    return true;
}

// my:计算两个时间差,传入时间格式为：2019-01-14 15：53
//  timeDifference(2019-01-14 15：53,2019-01-14 15：53)
export const timeDifference = (time1, time2) => {
    var date3 = new Date(time1).getTime() - new Date(time2).getTime() // 时间差的毫秒数
    // 计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    // var leave1 = equipmentEatTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    // 计算出小时数
  
    var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    // 计算相差分钟数
    var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    // 计算相差秒数
    var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    // console.log(' 相差 ' + days + '天 ' + hours + '小时 ' + minutes + ' 分钟' + seconds + ' 秒')
    let str = ''
    if (days === 0) {
      str = hours + ' : ' + minutes + ' : ' + seconds
    } else {
      str = days + 'days ' + hours + ' : ' + minutes + ' : ' + seconds
    }
    return str
  }