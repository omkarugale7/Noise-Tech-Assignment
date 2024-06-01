import React from 'react'


export default ({ comments }) => {

    const renderComments = comments.map(comment => {
        let content = comment.content
        console.log(comment.status)

        return <li key={comment.id}>{content}</li>


    })

    return <ul>

        {renderComments}
    </ul>

}