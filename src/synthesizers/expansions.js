import _ from 'lodash'

import * as srJv80_02 from './expansions/SR-JV80/SR-JV80-02.json'
import * as srJv80_04 from './expansions/SR-JV80/SR-JV80-04.json'
import * as srJv80_05 from './expansions/SR-JV80/SR-JV80-05.json'
import * as srJv80_06 from './expansions/SR-JV80/SR-JV80-06.json'
import * as srJv80_07 from './expansions/SR-JV80/SR-JV80-07.json'
import * as srJv80_08 from './expansions/SR-JV80/SR-JV80-08.json'
import * as srJv80_09 from './expansions/SR-JV80/SR-JV80-09.json'
import * as srJv80_10 from './expansions/SR-JV80/SR-JV80-10.json'
import * as srJv80_16 from './expansions/SR-JV80/SR-JV80-16.json'

import * as srx_01 from './expansions/SRX/SRX-01.json'
import * as srx_02 from './expansions/SRX/SRX-02.json'
import * as srx_03 from './expansions/SRX/SRX-03.json'
import * as srx_04 from './expansions/SRX/SRX-04.json'
import * as srx_05 from './expansions/SRX/SRX-05.json'
import * as srx_06 from './expansions/SRX/SRX-06.json'
import * as srx_07 from './expansions/SRX/SRX-07.json'
import * as srx_08 from './expansions/SRX/SRX-08.json'
import * as srx_09 from './expansions/SRX/SRX-09.json'
import * as srx_10 from './expansions/SRX/SRX-10.json'
import * as srx_11 from './expansions/SRX/SRX-11.json'
import * as srx_12 from './expansions/SRX/SRX-12.json'
import * as srx_97 from './expansions/SRX/SRX-97.json'
import * as srx_98 from './expansions/SRX/SRX-98.json'


const expansions = {
    'SR-JV80': [
        srJv80_02, srJv80_04, srJv80_05, srJv80_06, srJv80_07, srJv80_08, srJv80_09, srJv80_10, srJv80_16
    ].map(m => m.default),
    'SRX': [
        srx_01, srx_02, srx_03, srx_04, srx_05, srx_06, srx_07, srx_08, srx_09, srx_10, srx_11, srx_12, srx_97, srx_98
    ].map(m => m.default)
}

export const expansionsOfType = expansionType => expansions[expansionType]

export const getExpansionByTypeAndNumber = (expType, number) => _.find(expansions[expType], { number })
