import React from 'react'
import {
    FaArrowDown,
    FaArrowUp,
    FaCaretDown,
    FaCaretRight,
    FaFolderPlus,
    FaPlus,
    FaSortAlphaDown,
    FaTrash
} from 'react-icons/fa'

const Icons = {
    add: FaPlus,
    addSong: FaFolderPlus,
    arrowDown: FaArrowDown,
    arrowUp: FaArrowUp,
    collapsed: FaCaretRight,
    delete: FaTrash,
    expanded: FaCaretDown,
    sortDown: FaSortAlphaDown,
    treeSeparator: FaCaretRight
}

export default Icons

export const icon = (name, props) => React.createElement(name, props)
