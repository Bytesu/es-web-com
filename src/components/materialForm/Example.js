import React, {useState, useContext} from 'react';
import {Form} from "./"
import {ButtonCustom, CustomFormInput} from "./components"
import Grid from '@material-ui/core/Grid/index';
import styles from "./example.module.scss"
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import {ActionBoxContext, ActionBoxTypes} from '../';
import {AlertContext} from "../../context";
import Upload from 'rc-upload';
import * as Yup from "yup";
import {oneDay, postFn, RequestPrefix, getFn} from "../../lib";


export function FormExample(props) {
    const formRef = React.useRef(null);
    const dialog = useContext(ActionBoxContext);
    const alert = useContext(AlertContext);

    const beforeUpload = React.useCallback(async (e) => {
        let fileExt = e.name.split('.')
        fileExt = fileExt[fileExt.length-1]
        if(fileExt.toLowerCase()!=='csv'){
            alert.setAlert({
                type: 'danger',
                content: '文件上传失败, 请确认上传csv格式文件！',
            });
            return false;
        }
        try {
            const formData = await formRef.current.submit();
            return formData.isValid;
        } catch (e) {
            console.log(e);
            return false
        }
        return true;
    }, [formRef]);
    const uploadData = React.useCallback(async (file) => {
        const formData = await formRef.current.submit();
        return {
            ...formData.values,
            dryRun: !formData.values.dryRun || true,
            periodEnd: formData.values.periodEnd.replace(/-/ig, '/'),
            periodStart: formData.values.periodStart.replace(/-/ig, '/')
        };
    }, [formRef]);
    const dayInit = moment().format("YYYY-MM-DD");
    const dayEndInit = moment(new Date().getTime() + 5 * oneDay).format("YYYY-MM-DD");
    const [formArray] = useState([
        {
            name: "recipent",
            label: 'Email',
            val: 'support@tclm.com',
            title: <>Email:<abbr> * </abbr></>,
            placeholder: "请输入Email",
            isRequired: true,
            schema: Yup.string().required("Email不能为空"),

        },
        {
            name: "periodStart",
            label: 'Start Date',
            val: dayInit,
            type: Form.FormTypes.DATE,
            isRequired: true,
            child({setFieldValue, values}) {
                return <TextField
                    fullWidth
                    type="date"
                    label={"起始日期"}
                    value={values['periodStart']}
                    variant="filled"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={e => {
                        setFieldValue('periodStart', e.target.value > values['periodEnd'] ? values['periodEnd'] : e.target.value)
                    }}
                />
            },
            title: <>起始日期:<abbr> * </abbr></>,
            placeholder: "请选择起始日期",
            validate: async (value, errors) => {
                return errors;
            },
            schema: Yup.string().required("起始日期不能为空"),

        },
        {
            name: "periodEnd",
            label: '截止日期',
            isRequired: true,
            type: Form.FormTypes.DATE,
            child({setFieldValue, values}) {
                return <TextField
                    fullWidth
                    type="date"
                    label={"截止日期"}
                    variant="filled"
                    value={values['periodEnd']}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={e => {
                        setFieldValue('periodEnd', e.target.value < values['periodStart'] ? values['periodStart'] : e.target.value)
                    }}
                />
            },
            val: dayEndInit,
            title: <>截止日期:<abbr> * </abbr></>,
            placeholder: "请选择截止日期",
            validate: async (value, errors) => {
                return errors;
            },
            schema: Yup.string().required("截止日期不能为空"),

        },
        {
            name: "dryRun",
            title: '存入服务器',
            label: '存入服务器',
            val: false,
            type: Form.FormTypes.CHECKBOX,

        },
        {
            name: "upload",
            label: 'Start Date',
            title: '',
            type: Form.FormTypes.PLAIN,
            child() {
                return <Upload
                    headers={{
                        "tokenauthorization": `Bearer ${sessionStorage.getItem("_tk")}`,
                    }}
                    name="reportInput"
                    beforeUpload={beforeUpload}
                    onSuccess={async (response) => {


                        const formData = await formRef.current.submit();
                        if (formData.values['dryRun'] && response.length) {
                            dialog.setBodyComponent({
                                id: '1',
                                title: '电话号码',
                                type: ActionBoxTypes.DIALOG,
                                bodyComponent: <div style={{lineBreak: 'anywhere'}}>
                                    {response.join(',')}
                                </div>,
                                opt: {
                                    okFn() {
                                        dialog.close(1)
                                    }
                                }

                            })
                        } else {
                            alert.setAlert({
                                type: 'success',
                                content: '文件上传成功, 处理结果将发送至您的邮箱，请注意查收！',
                            });
                        }
                    }}
                    onError={(e)=>{
                        console.log(e)
                        alert.setAlert({
                            type: 'danger',
                            content: '文件上传失败, 请确认上传csv格式文件！',
                        });
                    }}
                    action={`${RequestPrefix}admin/overageReport`}
                    data={uploadData}
                >
                    <Box display="flex" justifyContent="center">
                        <ButtonCustom>点击上传报表</ButtonCustom>
                    </Box>
                </Upload>
            },
        },
    ]);

    const [formArray2] = useState(() => {
        return [
            {
                name: "recipent",
                label: 'Email',
                val: 'support@famulei.us',
                isRequired: true,
                title: <>Email:<abbr> * </abbr></>,
                placeholder: "请输入Email",

            },
        ]
    });
    const formRef2 = React.createRef();
    return (
        <>
            <Container className={styles.container}>
                <Grid container spacing={3}>
                    <Grid item xs>
                    </Grid>
                    <Grid item xs={6}>
                        <Form
                            noLabel={true}
                            FormInput={CustomFormInput}
                            ref={formRef}
                            fields={formArray}
                        ></Form>
                    </Grid>
                    <Grid item xs>
                    </Grid>
                </Grid>
            </Container>
            <Container className={styles.container}>
                <Grid container spacing={3}>
                    <Grid item xs>
                    </Grid>
                    <Grid item xs={6}>
                        <Form
                            FormInput={CustomFormInput}
                            ref={formRef2}
                            fields={formArray2}
                        ></Form>
                        <ButtonCustom
                            onClick={async () => {
                                let formData = await formRef2.current.submit();
                                if (formData.isValid) {
                                    const requestRes = await getFn('/admin/overageReportTemplate?recipent=' + formData.values['recipent'])
                                    if (requestRes.data) {
                                        alert.setAlert({
                                            type: 'success',
                                            content: '模板文件已发送至您的邮箱，请注意查收!',
                                        });
                                    }
                                }
                            }}
                        >获取报表模板</ButtonCustom>
                    </Grid>
                    <Grid item xs>
                    </Grid>
                </Grid>
            </Container>
            <Container className={styles.container}>
                <Grid container spacing={3}>
                    <Grid item xs>
                    </Grid>
                    <Grid item xs={6}>
                        <ButtonCustom
                            onClick={async () => {
                                const requestRes = await postFn('/admin/worker/send?jobName=SyncSubscriptionMsg&objectID=1', {
                                    jobName: "SyncSubscriptionMsg",
                                    objectID: 1
                                })
                                if (requestRes.data) {
                                    alert.setAlert({
                                        delay: 100000,
                                        type: 'success',
                                        content: '系统正在进行同步, 请等待5分钟后生成报表。',
                                    });
                                }
                            }}
                        >与Stripe同步套餐</ButtonCustom>
                    </Grid>
                    <Grid item xs>
                    </Grid>
                </Grid>
            </Container>
        </>

    );
}

