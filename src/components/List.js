import React from 'react'
import _ from 'lodash'

import Colors from './colors'
import { ButtonLike } from './Components'


const List = ({ items=[], render, selectionRender=_.identity, selected, setSelected }) => {
    const styles = {
        list: {
            alignSelf: 'stretch',
            overflowY: 'auto'
        },
        item: selected => ({
            alignSelf: 'stretch',
            margin: '3px 0',
            backgroundColor: selected ? Colors.blue : undefined,
            paddingLeft: '0.5rem',
            cursor: 'pointer'
        })
    }

    return (
        <div style={styles.list}>
            {items.map((item, index) => {
                const forSelection = selectionRender(item)
                const itemSelected = forSelection === selected
                return (
                    <ButtonLike key={index}
                                style={styles.item(itemSelected)}
                                onClick={() => setSelected(itemSelected ? undefined : forSelection)}>
                        {render(item)}
                    </ButtonLike>
                )
            })}
        </div>
    )
}

export default List
