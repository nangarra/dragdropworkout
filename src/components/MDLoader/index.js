import React from 'react'

const Loading = (props) => {
  const { loading, children } = props

  if (loading) {
    return <>        <div className="w-full h-full bg-white dark:bg-gray-800 dark:bg-opacity-60 bg-opacity-50 absolute inset-0" />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">


        <img className={`w-[60px] h-[60px]`} src='/favicon.png' />

      </div>
    </>
  }

  return <>{children}</>
}

export default Loading