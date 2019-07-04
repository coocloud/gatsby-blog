const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                  }
                }
              }
            }
            allPrismicPage {
              edges {
                node {
                  slugs
                  id
                }
              }
            } 
            allPrismicSocialpage {
              edges {
                node {
                  id
                  slugs
                }
              }
            }                         
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;
        const prismicPosts = result.data.allPrismicPage.edges;
        const prismicSocialPosts = result.data.allPrismicSocialpage.edges;

        console.log(prismicPosts);

        _.each(posts, (post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })

          prismicPosts.forEach(({ node }) => {
            const slugPath = node.slugs[0];
            createPage({
                path: slugPath,
                component: path.resolve(`./src/templates/prismic-post.js`),
                context: {
                    slug: `${slugPath}`,
                    nodeId: node.id,
                },
            })
        })

          prismicSocialPosts.forEach(({ node }) => {
              const slugPath = node.slugs[0];
              createPage({
                  path: slugPath,
                  component: path.resolve(`./src/templates/prismic-social-post.js`),
                  context: {
                      slug: `${slugPath}`,
                      nodeId: node.id,
                  },
              })
          })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  // console.log(node.internal.type);
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

