import React from 'react'
import { graphql } from "gatsby";

export default ({ data }) => {
    console.log(data);
    const post = data.prismicSocialpage;
    console.log(post);
    let embedBlock = post.data.body[0].primary.instagram_embed.html;
    embedBlock = embedBlock.replace("<script async src=\"//\www.instagram.com/embed.js\"\><\/\script>","");
    if (!post) {
        return (
            <div>Nothing</div>

        )
    }
    return (
        <div>
            <h1>{post.data.title.text}</h1>
            <div dangerouslySetInnerHTML={{ __html: embedBlock }} />
        </div>
    )
}

export const pageQuery = graphql`
  query PrismicSocialPostById($nodeId: String!) {
      prismicSocialpage(id: {eq: $nodeId}) {
        id
        data {
          release_date
          title {
            html
            text
          }
          body {
            id
            primary {
              instagram_embed {
                version
                title
                author_name
                author_url
                author_id
                media_id
                provider_name
                provider_url
                type
                width
                html
                thumbnail_url
                thumbnail_width
                thumbnail_height
                embed_url
              }
            }
          }
        }
      } 
  }
`