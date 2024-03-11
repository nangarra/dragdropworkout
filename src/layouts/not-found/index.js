import { Card } from '@mui/material'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React from 'react'

const NotFound = () => {
    return (
        <DashboardLayout>
            <Card style={{ overflow: 'hidden' }}>
                <img src='/img/404.jpg' />
            </Card>
        </DashboardLayout>
    )
}

export default NotFound