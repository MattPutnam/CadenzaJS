import React from 'react'


const PerformPage = ({ exit }) => {
    React.useEffect(() => {
        const esc = e => {
            if (e.key === 'Escape') {
                exit()
            }
        }

        document.addEventListener('keydown', esc)
        return () => document.removeEventListener('keydown', esc)
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
