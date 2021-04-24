import React, {useState, useEffect, useRef} from 'react';
import {AlertContext,DialogContext, OrderContext} from './context';

const Alert =(props)=>{
    return <div>{props.children}</div>
}

function useTimeout(callback, delay, refs) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        let id = setTimeout(tick, delay);
        return () => clearTimeout(id);

    }, [delay]);
}

export function usePusher() {
    const [alert, setAlert] = useState({type: '', content: '', delay: 0});
    const {type, content} = alert;
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (!!type && !!content) {
            setShow(true);
        }
    }, [type, setShow, content]);
    useTimeout(
        () => {
            setShow(false);
        },
        alert.delay || 2000,
        [setShow, alert]
    );

    return {
        alert,
        setAlert,
        show,
        setShow,
    };
}

export function AlertProvider(props) {
    const pusher = usePusher();
    const {
        alert,
        show, setShow
    } = pusher;

    const {type, content} = alert;

    return (
        <AlertContext.Provider value={pusher}>
            {show && (
                <Alert bsStyle={type} className="alert-fixed" onDismiss={() => setShow(false)}>
                    <h4>{content}</h4>
                </Alert>
            )}
            {props.children}
        </AlertContext.Provider>
    );
}


export function useDialog(){
    return {};
}
export function DialogProvider(props) {

    return  <DialogContext.Provider>
        {props.children}
    </DialogContext.Provider>
}

export const ORDER_KEY = "order_data";
export const ORDER_TYPE = {
    ORDER: "order",
    REFILL: "refill"
};


export function useOrder() {
    const [orderInfo, setOrderInfo] = useState(()=>{
        return JSON.parse(sessionStorage.getItem(ORDER_KEY) || "{}");
    });
    return {
        getOrderByKey(key, prefix = ORDER_KEY.ORDER) {
            return orderInfo[`${prefix}_${key}`];
        },
        clearByPrefix(prefix = ORDER_KEY.ORDER) {
            const orderInfoTmp = {};
            Object.keys(orderInfo).forEach(key => {
                if (!key.startsWith(`${prefix}_`)) {
                    orderInfoTmp[key] = orderInfo[key]
                }
            })
            sessionStorage.setItem(ORDER_KEY, JSON.stringify(orderInfoTmp));
            setOrderInfo(orderInfoTmp)
        },
        setOrderByKey:  (payload, key, prefix = ORDER_KEY.ORDER, opt = {}) => {
            let orderData = {
                ...orderInfo,
                [`${prefix}_${key}`]: payload
            };
            if (opt.clearPrefix) {//clear prefix 开头的字段
                const orderInfoTmp = {};
                Object.keys(orderInfo).forEach(key => {
                    if (!key.startsWith(`${prefix}_`)) {
                        orderInfoTmp[key] = orderInfo[key]
                    }
                });
                orderInfoTmp[`${prefix}_${key}`] = payload;
                orderData = orderInfoTmp;
            }
            sessionStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
            setOrderInfo(orderData)
        }
        ,
        setOrderInfo(payload) {
            setOrderInfo({
                ...orderInfo,
                ...payload
            })
        },
        orderInfo,
    }
}

export function OrderProvider(props) {
    const orderData = useOrder();

    return (
        <OrderContext.Provider value={orderData}>
            {props.children}
        </OrderContext.Provider>
    );
}


