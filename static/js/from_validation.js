/**
 * 表单验证工具
 * 提供常见的表单验证功能
 */

// 验证规则集合
const validationRules = {
    required: {
        validate: value => value.trim() !== '',
        message: '此字段为必填项'
    },
    email: {
        validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: '请输入有效的电子邮件地址'
    },
    phone: {
        validate: value => /^1[3-9]\d{9}$/.test(value),
        message: '请输入有效的手机号码'
    },
    minLength: {
        validate: (value, length) => value.length >= length,
        message: (length) => `至少需要${length}个字符`
    },
    maxLength: {
        validate: (value, length) => value.length <= length,
        message: (length) => `不能超过${length}个字符`
    },
    password: {
        validate: value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value),
        message: '密码必须包含大小写字母和数字，且至少8个字符'
    },
    number: {
        validate: value => !isNaN(value),
        message: '请输入有效的数字'
    },
    positiveNumber: {
        validate: value => !isNaN(value) && parseFloat(value) > 0,
        message: '请输入正数'
    },
    url: {
        validate: value => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value),
        message: '请输入有效的URL地址'
    },
    date: {
        validate: value => !isNaN(Date.parse(value)),
        message: '请输入有效的日期'
    },
    sameAs: {
        validate: (value, fieldName, form) => value === form.elements[fieldName].value,
        message: (fieldName) => `必须与${fieldName}字段相同`
    }
};

/**
 * 表单验证类
 */
class FormValidator {
    constructor(formId, options = {}) {
        this.form = document.getElementById(formId);
        this.options = {
            errorClass: 'error',
            errorElement: 'span',
            highlight: (element, errorElement) => {
                element.classList.add('is-invalid');
                errorElement.classList.add('text-danger');
            },
            unhighlight: (element, errorElement) => {
                element.classList.remove('is-invalid');
                errorElement.classList.remove('text-danger');
            },
            ...options
        };
        
        if (!this.form) {
            console.error(`Form with ID "${formId}" not found`);
            return;
        }
        
        this.init();
    }
    
    /**
     * 初始化验证器
     */
    init() {
        this.form.setAttribute('novalidate', 'novalidate');
        this.form.addEventListener('submit', this.validateForm.bind(this));
        
        // 为需要实时验证的字段添加事件监听
        const realtimeFields = this.form.querySelectorAll('[data-validate-realtime]');
        realtimeFields.forEach(field => {
            field.addEventListener('input', this.validateField.bind(this));
            field.addEventListener('blur', this.validateField.bind(this));
        });
    }
    
    /**
     * 验证整个表单
     * @param {Event} event 
     * @returns {boolean}
     */
    validateForm(event) {
        if (event) {
            event.preventDefault();
        }
        
        let isValid = true;
        const fields = this.form.querySelectorAll('[data-validate]');
        
        fields.forEach(field => {
            if (!this.validateField(null, field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.form.submit();
        }
        
        return isValid;
    }
    
    /**
     * 验证单个字段
     * @param {Event} event 
     * @param {HTMLElement} field 
     * @returns {boolean}
     */
    validateField(event, field = null) {
        const element = field || event.target;
        const rules = element.getAttribute('data-validate').split('|');
        const value = element.value;
        let isValid = true;
        
        // 移除之前的错误信息
        this.removeError(element);
        
        for (const rule of rules) {
            const [ruleName, ruleParam] = rule.split(':');
            
            if (!validationRules[ruleName]) {
                console.warn(`Validation rule "${ruleName}" not found`);
                continue;
            }
            
            let ruleValid;
            
            if (ruleName === 'sameAs') {
                ruleValid = validationRules[ruleName].validate(value, ruleParam, this.form);
            } else if (ruleParam) {
                ruleValid = validationRules[ruleName].validate(value, ruleParam);
            } else {
                ruleValid = validationRules[ruleName].validate(value);
            }
            
            if (!ruleValid) {
                let errorMessage;
                
                if (ruleName === 'sameAs') {
                    errorMessage = validationRules[ruleName].message(ruleParam);
                } else if (ruleParam && (ruleName === 'minLength' || ruleName === 'maxLength')) {
                    errorMessage = validationRules[ruleName].message(ruleParam);
                } else {
                    errorMessage = validationRules[ruleName].message;
                }
                
                this.addError(element, errorMessage);
                isValid = false;
                break;
            }
        }
        
        return isValid;
    }
    
    /**
     * 添加错误信息
     * @param {HTMLElement} element 
     * @param {string} message 
     */
    addError(element, message) {
        // 检查是否已经存在错误信息
        let errorElement = element.nextElementSibling;
        
        if (!errorElement || !errorElement.classList.contains(this.options.errorClass)) {
            errorElement = document.createElement(this.options.errorElement);
            errorElement.classList.add(this.options.errorClass);
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
        
        errorElement.textContent = message;
        this.options.highlight(element, errorElement);
    }
    
    /**
     * 移除错误信息
     * @param {HTMLElement} element 
     */
    removeError(element) {
        const errorElement = element.nextElementSibling;
        
        if (errorElement && errorElement.classList.contains(this.options.errorClass)) {
            this.options.unhighlight(element, errorElement);
            errorElement.remove();
        }
    }
    
    /**
     * 重置表单验证状态
     */
    resetForm() {
        const errors = this.form.querySelectorAll(`.${this.options.errorClass}`);
        const invalidFields = this.form.querySelectorAll('.is-invalid');
        
        errors.forEach(error => error.remove());
        invalidFields.forEach(field => field.classList.remove('is-invalid'));
    }
    
    /**
     * 添加自定义验证规则
     * @param {string} name 
     * @param {Function} validateFn 
     * @param {string} message 
     */
    static addRule(name, validateFn, message) {
        if (validationRules[name]) {
            console.warn(`Validation rule "${name}" already exists and will be overwritten`);
        }
        
        validationRules[name] = {
            validate: validateFn,
            message: message
        };
    }
}

// 示例用法
// document.addEventListener('DOMContentLoaded', () => {
//     const validator = new FormValidator('myForm', {
//         errorClass: 'error-message',
//         highlight: (element, errorElement) => {
//             element.classList.add('error-border');
//             errorElement.style.color = 'red';
//         },
//         unhighlight: (element, errorElement) => {
//             element.classList.remove('error-border');
//             errorElement.style.color = '';
//         }
//     });
//     
//     // 添加自定义规则
//     FormValidator.addRule('username', value => /^[a-zA-Z0-9_]{4,16}$/.test(value), '用户名必须是4-16位的字母、数字或下划线');
// });

// 导出FormValidator类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
} else {
    window.FormValidator = FormValidator;
}