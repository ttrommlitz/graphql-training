import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
    getBookByTitle(title: String!): Book
  }
`

// data sources

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
  {
    title: 'Way of Kings',
    author: 'Brandon Sanderson'
  }
]

// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
  Query: {
    books: () => books,
    getBookByTitle: (parent, args, contextValue, info) => books.find(book => book.title === args.title)
  }
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)