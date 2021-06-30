import React, {useState, forwardRef, useEffect, useImperativeHandle} from 'react';
import {Formik} from "formik";
import * as Yup from "yup";
import {arrayToPluckObjFn, utils, genDefaultId} from '../../lib/'
import "../date/index.scss"
import "./index.scss"
import {AutoComponent} from "../autoComponent";
import {isEmpty} from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
export {Radio} from './radio'
const Types = {
    SELECT: "SELECT",
    RADIO: "RADIO",
    CHECKBOX: "CHECKBOX",
    DATE: "DATE",
    PLAIN: "PLAIN",
    AUTO_SUGGEST: "AUTO_SUGGEST",
    CARD: "CARD",
};

export function FormItem(props) {
    const [verify, setVerify] = useState({
        verify: false,
        label: "Verify"
    });
    const {values, errors, touched, handleChange, setFieldValue, handleBlur, name, title} = props;
    if (props.type === Types.RADIO) {
        return <div className="form-group has-feedback show-att-user">
            <label>{title}</label>
            {props.child?.(props)}
        </div>;
    }
    if (props.type === Types.CHECKBOX) {
        return <div className="form-group has-feedback show-att-user">
            <label><input type="checkbox" name={name}
                          onBlur={handleBlur}
                          onChange={(val) => {
                              handleChange(val)
                              props.onChange?.({...values, [name]: val.target.checked}, props)
                          }}
                          value={values[name]}
                          checked={values[name]}
                          style={{marginRight: "10px"}}/>{title}</label>
        </div>;
    }
    if (props.type === Types.AUTO_SUGGEST) {
        return <div className="form-group has-feedback show-att-user">
            <label>{title}</label>
            <AutoComponent
                suggestions={props.options}
                suggestFn={props.suggestFn}
                selected={props.val || ''}
                name={name}
                onChange={(value) => {
                    setFieldValue(name, value);
                    props.onChange?.({...values, [name]: value}, props)
                }}
                formatText={props.formatVal}
            ></AutoComponent>
            {errors[name] && touched[name] ?
                <div className="error ">{errors[name]}</div> : null}
        </div>;
    }
    if (props.type === Types.DATE) {
        return <div className="form-group has-feedback show-att-user">
            <label>{title}</label>
            {props.child(props)}
        </div>;
    }
    if (props.type === Types.PLAIN) {
        return <div className="form-group has-feedback show-att-user">
            <label>{title}</label>
            {props.child(props)}
        </div>;
    }
    if (props.type === Types.CARD) {
        return <div className="form-group has-feedback show-att-user">
            <label>{title}</label>
            {props.child(props)}
        </div>;
    }
    if (props.type === Types.SELECT) {
        return <div className="form-group has-feedback show-att-user">
            <label>{title}</label>
            <select
                onChange={(val) => {
                    handleChange(val)
                    props.onChange?.({...values, [name]: val.target.value}, props)
                }}
                onBlur={handleBlur}
                value={values[name]}
                className="form-control" name={name}>
                {
                    props.options || null
                }
            </select>
            {props.suffixDesc || null}
            {/*<p className="note-msg">* ATT*/}
            {/*    Prepaid与其他ATT套餐的不同之处在于其先付款再使用，并且Prepaid每月不提供账单。</p>*/}
        </div>;
    }

    return <div className={"form-group has-feedback hidden-transfer-user "+(props.isMobile?'form-group-mobile':'')}>
        <label style={props.labelSty || {}}>{title}</label>
        <div className={"form-input-item"}
             style={props.inputStyle || {}}
        >
            <input type="text"
                   disabled={props.disabled || false}
                   autoComplete={"off"}
                   className="form-control" name={name}
                   placeholder={props.placeholder || ''}
                   value={values[name]}
                   onChange={(value) => {
                       handleChange(value)
                       props.onChange?.({...values, [name]: value.target.value}, props)
                   }}
                   onBlur={(...arg) => {
                       handleBlur(...arg)
                       props.blurValidate?.(arg, props);

                   }}
            />
            {props.validateIcon && !errors[name] && touched[name] ? <FontAwesomeIcon
                icon={faCheckCircle}
                className="valid fa fa-check-circle"></FontAwesomeIcon> : null}
            {props.validateBtn ?
                <a className={"smarty-tag  smarty-addr-signup validate-zip-code pointer smarty-tag-grayed " + (verify.verify ? "smarty-tag-green" : "")}
                   title="Address not verified. Click to verify."
                   onClick={async () => {
                       let verifyRes = await props.validateAction?.(verify.label == 'Verify', values, props)
                       setVerify({
                           ...verify,
                           verify: verifyRes,
                       });
                   }}
                   data-addressid="signup"><span
                    className="smarty-tag-check">✓</span>
                    <span className="smarty-tag-text"
                          onClick={(e) => {

                              if (verify.label === "Undo") {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setVerify({
                                      verify: false
                                  })
                              }
                          }}
                          onMouseEnter={() => {

                              setVerify({
                                  ...verify,
                                  // verify: false,
                                  label: verify.verify ? "Undo" : "Verify"

                              })
                          }}

                          onMouseLeave={() => {
                              setVerify({
                                  ...verify,
                                  label: "Verify"
                              })
                          }}
                    >{verify.label}</span></a> : null}
            {errors[name] && touched[name] ?
                <div className="error ">{errors[name]}</div> : null}
            {props.suffixDesc || null}
        </div>

    </div>;
}

export const Form = forwardRef((props, ref) => {

    const [formDataObj, setFormDataObj] = useState(arrayToPluckObjFn(props.fields, 'name', ''));
    const [formData, setFormData] = useState(props.fields);

    useEffect(() => {
        setFormDataObj(arrayToPluckObjFn(props.fields, 'name', ''))
        setFormData(props.fields)
    }, [props.fields]);

    const refForm = React.useRef();
    useImperativeHandle(ref, () => ({
        submit: async () => {
            let formObj = arrayToPluckObjFn(formData, 'name', 'val');
            Object.keys(formObj).forEach(key => {
                formObj[key] = true;
            });
            if (!isEmpty(refForm.current.errors)) {
                console.log(refForm.current.errors);
            }
            await refForm.current.setTouched(formObj);
            await refForm.current.validateForm();
            let isValid = refForm.current.isValid;
            if (Object.keys(refForm.current.errors).length == 1 && ((refForm.current.errors['schoolToggle'] == "" && !!refForm.current.values.schoolToggle
                && refForm.current.values.schoolToggle != '1') || (
                refForm.current.errors['country'] == '国家不能为空!'
            ))) {
                isValid = true;
                delete refForm.current.errors['schoolToggle']
                delete refForm.current.errors['country']
            }

            return {
                isValid: isValid,
                values: refForm.current.values
            }
        }
    }));
    const isMobile = props.isMobile
    return <Formik
        innerRef={refForm}
        onSubmit={async (values) => {
        }}
        initialValues={arrayToPluckObjFn(formData, 'name', 'val')}
        validationSchema={Yup.object().shape(arrayToPluckObjFn(formData, 'name', 'schema'))}
        validate={async (values) => {
            let errors = {};
            await utils.asyncForEachWithSub(formData, async (item) => {
                if (item.isRequired && !values[item.name]) {
                    errors[item.name] = item.label + "不能为空!"
                }
                let errorsRes = await formDataObj[item.name].validate?.(values[item.name], errors, values);
                if (!errorsRes) errorsRes = {};
                errors = {
                    ...errors,
                    ...errorsRes
                }
            });

            return errors;
        }}
    >
        {
            props => {
                const {handleSubmit} = props;
                return <form
                    role="form"
                    noValidate="novalidate"
                    onSubmit={handleSubmit}
                >
                    {
                        formData.map((item, index) => {
                            if (item instanceof Array) {
                                return <div className="row" key={index}>
                                    {item.map(el => {

                                        return <div
                                            key={el.name}
                                            className={'col-sm-' + (el.col || parseInt(12 / item.length, 0))}>
                                            <FormItem
                                                isMobile={isMobile}
                                                key={el.id || el.name}
                                                {...el}
                                                {...props}
                                            ></FormItem>
                                        </div>
                                    })}
                                </div>
                            }
                            return <FormItem
                                isMobile={isMobile}
                                key={(item.id || item.name)}
                                {...item}
                                {...props}
                            ></FormItem>
                        })
                    }

                </form>
            }
        }
    </Formik>
});
Form.FormTypes = Types;
