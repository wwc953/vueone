/**
 *  npm install jsencrypt --save-dev
 *  npm i encryptlong -S
 */
// 处理长文本数据时报错 jsencrypt.js Message too long for RSA
import JSEncrypt from 'jsencrypt'
// encryptlong是基于jsencrypt扩展的长文本分段加解密功能
import Encrypt from 'encryptlong'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

// 默认公钥key
// const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
//     '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ=='

// 默认私钥key
const privateKey = 'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEA0vfvyTdGJkdbHkB8\n' +
    'mp0f3FE0GYP3AYPaJF7jUd1M0XxFSE2ceK3k2kw20YvQ09NJKk+OMjWQl9WitG9p\n' +
    'B6tSCQIDAQABAkA2SimBrWC2/wvauBuYqjCFwLvYiRYqZKThUS3MZlebXJiLB+Ue\n' +
    '/gUifAAKIg1avttUZsHBHrop4qfJCwAI0+YRAiEA+W3NK/RaXtnRqmoUUkb59zsZ\n' +
    'UBLpvZgQPfj1MhyHDz0CIQDYhsAhPJ3mgS64NbUZmGWuuNKp5coY2GIj/zYDMJp6\n' +
    'vQIgUueLFXv/eZ1ekgz2Oi67MNCk5jeTF2BurZqNLR3MSmUCIFT3Q6uHMtsB9Eha\n' +
    '4u7hS31tj1UWE+D+ADzp59MGnoftAiBeHT7gDMuqeJHPL4b+kC+gzV4FGTfhR9q3\n' +
    'tTbklZkD2A=='


const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkieMb0EntYotTUNt9ZyusU4mh3GW9k4lL4q42aNDS6aVN//55EnM45CrUC5qjW2zfEqrFLNPGwONueYGmDoVySXmS4Uy0enhnJSWqLRlLhiIr3oVHzPUZQ1v/cGultMSepCVsQmJ5z+LhcYt7UfVAh8dEpMg81Rthtf1V2RgtyAXe3JJjl8b24VG2lwkD8oJCp2fJpwOnhMbKPe/t5XEgUb++XAw5CZxN3fMRyuMz3+3GMeUrQOfatXpnX4RxUPY0tt3X7Y249ICbOG4QdVyG89wdATilECh/Y3DTyg61k8DDfs2zEUwPPURx0XbBAUNaiVHJcTSkKdxb7GgDIXi1wIDAQAB'


export default {
    /* JSEncrypt加密 */
    rsaPublicData(data) {
        var jsencrypt = new JSEncrypt()
        jsencrypt.setPublicKey(publicKey)
        // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
        var result = jsencrypt.encrypt(data)
        return result
    },
    /* JSEncrypt解密 */
    rsaPrivateData(data) {
        var jsencrypt = new JSEncrypt()
        jsencrypt.setPrivateKey(privateKey)
        var result = jsencrypt.encrypt(data)
        return result
    },
    /* Encrypt加密 */
    encrypt(data) {
        const PUBLIC_KEY = publicKey
        var encryptor = new Encrypt()
        encryptor.setPublicKey(PUBLIC_KEY)
        const result = encryptor.encryptLong(data)
        return result
    },
    /* Encrypt解密 */
    decrypt(data) {
        const PRIVATE_KEY = privateKey
        var encryptor = new Encrypt()
        encryptor.setPrivateKey(PRIVATE_KEY)
        var result = encryptor.decryptLong(data)
        return result
    }
}