import * as rolandJv1080 from './roland_jv-1080.json'
import * as rolandXv5080 from './roland_xv-5080.json'

const synthesizers = [
    rolandJv1080.default,
    rolandXv5080.default
]

export const synthNames = synthesizers.map(synth => synth.name)

export const getSynthByName = synthName => synthesizers.filter(synth => synth.name === synthName)[0]
