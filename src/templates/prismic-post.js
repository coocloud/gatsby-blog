import React from 'react'
import { graphql } from "gatsby";

export default ({ data }) => {
    const post = data.prismicPage;
    console.log(post);
    if (!post) {
        return (
            <div>Nothing</div>

        )
    }
    return (
            <div>
                <h1>{post.data.title.text}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.data.description.html }} />
                <img src={post.data.image.url} alt={post.data.image.alt}/>
            </div>
    )
}

export const pageQuery = graphql`
  query PrismicPostById($nodeId: String!) {
      prismicPage(id: {eq: $nodeId}) {
        id
        data {
          title {
            html
            text
          }
          description {
            html
            text
          }
          image {
            alt
            copyright
            url
          }          
        }
      } 
  }
`