import * as dfd from 'danfojs'
import dayjs from "dayjs";

/**
 *
 * @param dfData {Array[]} like [{
 *     "itemid": "42269",
 *     "clock": "1690382664",
 *     "value": "8.882217999999995",
 *     "ns": "384468312"
 * }]
 *
 * @param duration {string} 'day', 'hour', 'fiveMins'
 */
export function aggMeanByDuration(dfData, duration) {
    if (dfData === null || typeof dfData === 'undefined') {return null}
    const columns = ["itemid", "clock", "value", "ns"]
    const dtypes = ["string", "int32", "float32", "string"]
    const df = new dfd.DataFrame(dfData, {columns, dtypes})
    const applyFuncs = {
        hour: tsToHour,
        day: tsToDay,
        fiveMins: toEveryFiveMins
    }
    df['clock'] = df['clock'].apply(applyFuncs[duration])
    df['value'] = df['value'].apply((v) => {
        return parseFloat(parseFloat(v).toFixed(2))})
    const valueMean = df.groupby(['clock']).col(['value']).mean()
    valueMean.rename({'value_mean': 'value'}, {inplace: true})
    return dfd.toJSON(valueMean)
}

/**
 *
 * @param ts {Number}
 * @return {String}
 */
function tsToHour(ts) {
    return dayjs.unix(ts).format("YYYY-MM-DDTHH:00:00")
}

function toEveryFiveMins(ts) {
    const unixTime = dayjs.unix(ts)
    const roundMinInFiveMins = Math.floor(unixTime.minute() / 5) * 5
    return dayjs.unix(ts).format(`YYYY-MM-DDTHH:${roundMinInFiveMins}:00`)
}

function tsToDay(ts) {
    return dayjs.unix(ts).format("YYYY-MM-DD")
}