import React from 'react'

const PerformPage = ({ exit }) => {
    React.useEffect(() => {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                exit()
            }
        })
    })

    const styles = {
        page: {
            backgroundColor: 'black',
            height: '100vh',
        }
    }

    return <div style={styles.page}>
    </div>
}

export default PerformPage
