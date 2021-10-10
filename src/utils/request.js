import { MessageBox, Message } from 'element-ui';
//导入路由
import router from '../router'
import axios from 'axios'

// 环境的切换
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = 'http://localhost:8000';
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = 'http://localhost:9000';
}

// 请求超时时间
axios.defaults.timeout = 30000;

// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// request 拦截
axios.interceptors.request.use(
    config => {
        if (sessionStorage.getItem("token")) {
            config.headers['token'] = sessionStorage.getItem("token");
        } else {
            //非登录页，调登录页
            if (location.hash !== '#/login') {
                // window.location.href = '/';
                router.push("/login")
            }
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

// response 拦截
axios.interceptors.response.use(
    response => {
        const res = response.data

        if (res.code === '00000') {
            return res
        }

        if (res.code === '-1') {
            Message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
            })
        }

        if (res.code === '90000') {
            MessageBox.confirm('您已退出，您可以取消停留在此页面，或重新登录', '确认退出', {
                confirmButtonText: '确认退出',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log('退出')
                // store.dispatch('/login').then(() => {
                //     location.reload()
                // })
                // sessionStorage.clear()
                // window.location.href = '/#/login';
                router.push("/login")
            })
        }
        return Promise.reject(new Error(res.message || 'Error'))
    },
    error => {
        console.log('err' + error)
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)

/**********************************************
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params ? params : "",
            })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**********************************************
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
const post = (url, params) => {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const API = { POST: post, GET: get }

export default API