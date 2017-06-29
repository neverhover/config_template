//验证提示信息 国际化
var verify_International = {
        en: {
            messages: {
                after: (field, [target]) => `The ${field} must be after ${target}.`,
                alpha_dash: (field) => `The ${field} may contain alpha-numeric characters as well as dashes and underscores.`,
                alpha_num: (field) => `The ${field} may only contain alpha-numeric characters.`,
                alpha_spaces: (field) => `The ${field} may only contain alphabetic characters as well as spaces.`,
                alpha: (field) => `The ${field} may only contain alphabetic characters.`,
                before: (field, [target]) => `The ${field} must be before ${target}.`,
                between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`,
                confirmed: (field) => `The ${field} confirmation does not match.`,
                credit_card: (field) => `The ${field} is invalid.`,
                date_between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`,
                date_format: (field, [format]) => `The ${field} must be in the format ${format}.`,
                decimal: (field, [decimals] = ['*']) => `The ${field} must be numeric and may contain ${decimals === '*' ? '' : decimals} decimal points.`,
                digits: (field, [length]) => `The ${field} must be numeric and exactly contain ${length} digits.`,
                dimensions: (field, [width, height]) => `The ${field} must be ${width} pixels by ${height} pixels.`,
                email: (field) => `The ${field} must be a valid email.`,
                ext: (field) => `The ${field} must be a valid file.`,
                image: (field) => `The ${field} must be an image.`,
                in: (field) => `The ${field} must be a valid value.`,
                ip: (field) => `The ${field} must be a valid ip address.`,
                max: (field, [length]) => `The ${field} may not be greater than ${length} characters.`,
                max_value: (field, [max]) => `The ${field} must be ${max} or less.`,
                mimes: (field) => `The ${field} must have a valid file type.`,
                min: (field, [length]) => `The ${field} must be at least ${length} characters.`,
                min_value: (field, [min]) => `The ${field} must be ${min} or more.`,
                not_in: (field) => `The ${field} must be a valid value.`,
                numeric: (field) => `The ${field} may only contain numeric characters.`,
                regex: (field) => `The ${field} format is invalid.`,
                required: (field) => `The ${field} is required.`,
                size: (field, [size]) => `The ${field} must be less than ${size} KB.`,
                url: (field) => `The ${field} is not a valid URL.`
            }
        },
        zh_CN: {
            messages: {
                after: (field, [target]) => ` ${field}必须在${target}之后`,
                alpha_dash: (field) => ` ${field}能够包含字母数字字符，包括破折号、下划线`,
                alpha_num: (field) => `${field} 只能包含字母数字字符.`, 
                alpha_spaces: (field) => ` ${field} 只能包含字母字符，包括空格.`,
                alpha: (field) => ` ${field} 只能包含字母字符.`,
                before: (field, [target]) => ` ${field} 必须在${target} 之前.`,
                between: (field, [min, max]) => ` ${field} 必须在${min}~${max}之间.`,
                confirmed: (field, [confirmedField]) => ` ${field} 不能和${confirmedField}匹配.`,
                date_between: (field, [min, max]) => ` ${field}必须在${min}和${max}之间.`,
                date_format: (field, [format]) => ` ${field}必须在在${format}格式中.`,
                decimal: (field, [decimals] = ['*']) => ` ${field} 必须是数字的而且能够包含${decimals === '*' ? '' : decimals} 小数点.`,
                digits: (field, [length]) => ` ${field} 必须是数字，且精确到 ${length}数`,
                dimensions: (field, [width, height]) => ` ${field}必须是 ${width} 像素到 ${height} 像素.`,
                email: (field) => ` ${field} 必须是有效的邮箱.`,
                ext: (field) => ` ${field} 必须是有效的文件.`,
                image: (field) => ` ${field} 必须是图片.`,
                in: (field) => ` ${field} 必须是一个有效值.`,
                ip: (field) => ` ${field} 必须是一个有效的ip地址.`,
                max: (field, [length]) => ` ${field} 不能大于${length}字符.`,
                mimes: (field) => ` ${field} 必须是有效的文件类型.`,
                min: (field, [length]) => ` ${field} 必须至少有 ${length} 字符.`,
                not_in: (field) => ` ${field}必须是一个有效值.`,
                numeric: (field) => ` ${field} 只能包含数字字符.`,
                regex: (field) => ` ${field} 格式无效.`,
                required: (field) => `${field} 是必须的.`,
                size: (field, [size]) => ` ${field} 必须小于 ${size} KB.`,
                url: (field) => ` ${field}不是有效的url.`
            }
        }
};

function vue_validate_set_language (language) {
    if (language == "") {
        language = 'zh_CN'
    };
    //验证提示信息国际化
    var vee_config = {
        locale: language
    };

    Vue.use(VeeValidate, vee_config);


    VeeValidate.Validator.updateDictionary(verify_International);
    VeeValidate.Validator.setLocale(language); //验证信息提示文字默认为中文
}

