import { genNodeAPI } from 'arseeding-js';


const instance = await genNodeAPI('bc0cb2f34ac6326290fe115c603e5690f8daad4ee3ca3f0120dfbdfdd7972e5c')
const arseedUrl = '<https://arseed.web3infra.dev>'
const data = Buffer.from('/icon/twitter_32x32.png')
const payCurrency = 'bnb' // everpay supported all tokens
const ops = {
    tags: [{ name: "wAtwitter240.png", value: 'image/png' }]
}
const res = await instance.sendAndPay(arseedUrl, data, payCurrency, ops)

console.log('res', res)
