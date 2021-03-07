const axios = require('axios')
const moment = require('moment')

const API_KEY = process.env.API_KEY

async function test() {
    const fs = require('fs')
    const result = await axios.get(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2020-06-01/2020-06-17?apiKey=${API_KEY}`)
    // console.log(result.data)
    const tickers = result.data.results.map(element => {
        return {
            delta: element.c - element.o,
            volume: element.v,
            openValue: element.o,
            closeValue: element.c,
            highestValue: element.h,
            lowestValue: element.l,
            timestamp: moment.unix(element.t).format('DD-MM-YYYY[ às ]HH:mm:ss'),
        }
    })

    console.log(tickers)

    fs.writeFileSync(`test-${moment().format('DDMMYYYY[-]HHmmss')}.txt`, JSON.stringify(tickers))
    // return tickers
}

test()

async function webSocket() {
    const url = ''

    const WebSocket = require('websocket')

    const APIKEY = process.env.API_KEY
    const websocket = new WebSocket('websockets://socket.polygon.io/forex')

    // ex1,
    const forexList = [
        'C.AUD/USD',
        'C.USD/EUR',
    ].join(',')

    // Connection Opened:
    websocket.on('open', () => {
        console.log('Connected!')
        websocket.send(`{"action":"auth","params":"${APIKEY}"}`)
        websocket.send(`{"action":"subscribe","params":"${forexList}"}`)
    })

    // Per message packet:
    websocket.on('message', (data) => {
        data = JSON.parse(data)
        data.map((msg) => {
            if (msg.ev === 'status') {
                return console.log('Status Update:', msg.message)
            }
            console.log('Tick:', msg)
        })
    })

    websocket.on('error', console.log)
}

