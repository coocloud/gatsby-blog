import React from 'react'
import {Link, graphql} from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import Layout from '../components/layout'
import {rhythm} from '../utils/typography'

class BlogIndex extends React.Component {
    // componentDidMount() {
    //     window.instgrm.Embeds.process();
    // }
    componentWillMount() {
        this.loadInstagram();
    }

    loadInstagram() {
        if (typeof window !== 'undefined') {
            if (!window.instgrm) {
                const s = document.createElement('script')
                s.async = s.defer = true
                s.src = `https://platform.instagram.com/en_US/embeds.js`
                s.id = 'react-instagram-embed-script'
                s.onload = this.onLoad
                const body = document.body
                if (body) {
                    body.appendChild(s)
                }
            }
        }
    }

    render() {
        const siteTitle = get(this, 'props.data.site.siteMetadata.title')
        const siteDescription = get(
            this,
            'props.data.site.siteMetadata.description'
        )
        const posts = get(this, 'props.data.allMarkdownRemark.edges')
        const prismicPages = get(this, 'props.data.allPrismicPage.edges')
        const prismicSocialPages = get(this, 'props.data.allPrismicSocialpage.edges')
        console.log(prismicPages);
        console.log(prismicSocialPages);

        return (
            <Layout location={this.props.location}>
                <Helmet
                    htmlAttributes={{lang: 'en'}}
                    meta={[{name: 'description', content: siteDescription}]}
                    title={siteTitle}
                />
                <Bio/>
                {posts.map(({node}) => {
                    const title = get(node, 'frontmatter.title') || node.fields.slug
                    return (
                        <div key={node.fields.slug}>
                            <h3
                                style={{
                                    marginBottom: rhythm(1 / 4),
                                }}
                            >
                                <Link style={{boxShadow: 'none'}} to={node.fields.slug}>
                                    {title}
                                </Link>
                            </h3>
                            <small>{node.frontmatter.date}</small>
                            <p dangerouslySetInnerHTML={{__html: node.excerpt}}/>
                        </div>
                    )
                })}

                {prismicPages.map(({node}) => {
                    console.log(`inside prismic pages node`);
                    console.log(node);
                    const title = get(node, 'data.title.text') || node.slugs[0]
                    console.log(title);
                    const imgUrl = node.data.image.url;
                    console.log(imgUrl);
                    return (
                        <div key={node.slugs[0]}>
                            <h3
                                style={{
                                    marginBottom: rhythm(1 / 4),
                                }}
                            >
                                <Link style={{boxShadow: 'none'}} to={node.slugs[0]}>
                                    {title}
                                </Link>
                            </h3>
                            <small>{node.first_publication_date}</small>
                            <p dangerouslySetInnerHTML={{__html: node.data.description.html}}></p>
                            <p> {node.data.description.text} </p>
                            {/*<span>{node.data.image.url}</span>*/}
                            <img src={imgUrl} alt={node.data.title.text}/>
                        </div>
                    )
                })}


                {prismicSocialPages.map(({node}) => {
                    console.log(`inside prismic social pages node`);
                    console.log(node);
                    const title = get(node, 'data.title.text') || node.slugs[0]
                    console.log(title);
                    const embedUrl = node.data.body;
                    console.log(embedUrl);
                    let embedBlock = "";

                    embedUrl.map(({primary}) => {
                        console.log(`primary node`);
                        console.log(primary);
                        embedBlock = primary.instagram_embed.html;
                        embedBlock = embedBlock.replace("\//\www.instagram.com/embed.js","https://www.instagram.com/embed.js");
                    })
                    return (
                        <div key={node.slugs[0]}>
                            <h3
                                style={{
                                    marginBottom: rhythm(1 / 4),
                                }}
                            >
                                <Link style={{boxShadow: 'none'}} to={node.slugs[0]}>
                                    {title}
                                </Link>
                            </h3>
                            <small>{node.first_publication_date}</small>
                            <p dangerouslySetInnerHTML={{__html: embedBlock}}></p>
                        </div>
                    )
                })}
            </Layout>
        )
    }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
          }
        }
      }
    }
    allPrismicPage {
        edges {
          node {
            id
            slugs
            first_publication_date
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
    }
    allPrismicSocialpage {
        edges {
            node {
            id
            first_publication_date
            slugs
            data {
            title {
                html
                text
            }
            release_date
            author_name {
                html
                text
            }
            body {
                id
                children {
                id
                }
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
    pageInfo {
      hasNextPage
    }
  }  
  }
`
