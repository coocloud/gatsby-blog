module.exports = {
  siteMetadata: {
    title: 'Blogs Apps Innovative Ideas',
    author: 'coocloud',
    description: 'All about coocloud | Build Apps | coocloud',
    siteUrl: 'https://www.coocloud.co.za',
    googlekey: 'cMeWysQFe9S3GdwuRxRvPk2M_DKWb3abq-CP6OhRH3U',
  },
  pathPrefix: '/gatsby-starter-blog',
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    {
        resolve: `gatsby-source-prismic`,
        options: {
            repositoryName: `coocloud`,
            accessToken: `MC5XOVRCUlJFQUFDZ0F4NXlD.77-9RC1hSe-_vV_vv73vv73vv73vv71t77-977-9emko77-977-9an0wRu-_vTDvv73vv70p77-977-977-977-9`,
        },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `coocloud Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/coocloud.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
  ],
}
