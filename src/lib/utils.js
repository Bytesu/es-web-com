import {flattenDepth} from "lodash"


var _secret = 'vHoXb@sM7VF4VPtw';

var _authToken = null;
export const utils = {
    asyncForEachWithSub: async (arr, predicate) => {
        let arrTmp = flattenDepth(arr);
        const results = await Promise.all(arrTmp.map(predicate));
        return arr.forEach((_v, index) => results[index]);
    },
    isUrlValid: function (str) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(str);
    },
    toFixed:function(num,fractionDigits=2){
        return parseFloat(num).toFixed(fractionDigits);
    },

    isIntegerValid: function (str) {
        return /^\d+$/.test(str);
    },

    isIMEIValid: function (imei) {

        if (!/^[0-9]{15}$/.test(imei)) {
            return false;
        }

        var sum = 0, factor = 2, checkDigit, multipliedDigit;

        for (var i = 13, li = 0; i >= li; i--) {
            multipliedDigit = parseInt(imei.charAt(i), 10) * factor;
            sum += (multipliedDigit >= 10 ? ((multipliedDigit % 10) + 1) : multipliedDigit);
            if (factor === 1) {
                factor++;
            } else {
                factor--;
            }
        }
        checkDigit = ((10 - (sum % 10)) % 10);

        return checkDigit === parseInt(imei.charAt(14), 10);
    },

    isEmailValid: function (email) {
        var emailPattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return emailPattern.test(email);
    },

    isPhoneNoValid: function (phoneNo) {
        var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        return phoneNumberPattern.test(phoneNo);
    },

    isChinesePhoneValid: function (phoneNo) {
        var cnRegExp = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
        var hkRegExp = /^((\+?852)|(\(\+852\)))?(5|6|8|9)\d{7}/;
        var macRegExp = /^((\+?853)|(\(\+853\)))?[6]([8|6])\d{5}$/;
        var twRegExp = /^((\+?886)|(\(\+886\)))?([0][9])\d{8}$/;
        return cnRegExp.test(phoneNo) || hkRegExp.test(phoneNo) || macRegExp.test(phoneNo) || twRegExp.test(phoneNo);
    },

    isICCIDValid: function (iccid) {
        return /^\d{20}$/.test(iccid);
    },

    isGroupCapacityValid: function (v) {
        var capacity = v + '';
        return capacity === '5' || capacity === '10';
    },

    isValidationCodeValid: function (v) {
        return /^\d\d(\d)+$/.test(v);
    },

    copyToClipboard: function (content) {
        // if (!_copyHelper) {
        //     _copyHelper = $('<pre style="position:absolute;left:-9999px;top:0;"></pre>').appendTo(document.body);
        // }
        // _copyHelper.html(content);
        // window.getSelection().removeAllRanges();
        // var range = document.createRange();
        // range.selectNode(_copyHelper[0]);
        // window.getSelection().addRange(range);
        // try {
        //     // Now that we've selected the anchor text, execute the copy command
        //     var successful = document.execCommand('copy');
        //     var msg = successful ? 'successful' : 'unsuccessful';
        //     if (successful) {
        //         kfamily.alertService.show({
        //             type: 'success',
        //             content: '已复制到剪贴板!'
        //         });
        //     } else {
        //         kfamily.alertService.show({
        //             type: 'warning',
        //             content: '复制到剪贴板时发生错误.'
        //         });
        //     }
        // } catch (err) {
        //     kfamily.alertService.show({
        //         type: 'warning',
        //         content: '复制到剪贴板时发生错误.'
        //     });
        // }
        // Remove the selections - NOTE: Should use
        // removeRange(range) when it is supported


        // window.getSelection().removeAllRanges();
    },



    clearAuthToken: function () {
        _authToken = null;
        sessionStorage.removeItem('_tk');
    },
    setAuthToken: function (token) {
        _authToken = token;
        sessionStorage.setItem('_tk', token);
    },
    getAuthToken: function () {
        if (!_authToken) {
            _authToken = sessionStorage.getItem('_tk');
        }
        if (_authToken) {
            return _authToken;
        }
    },

}


