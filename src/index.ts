import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Book {
    title: String
    author: Author
    authorId: ID
  }

  type Author {
    name: String
    id: ID!
    books: [Book]
  }

  type Query {
    books: [Book]
    getBookByTitle(title: String!): Book
  }
`

// data sources

const authors = [
  {
    name: 'Kate Chopin',
    id: 1
  },
  {
    name: 'Paul Auster',
    id: 2
  },
  {
    name: 'Brandon Sanderson',
    id: 3
  }
]

const books = [
  {
    title: 'The Awakening',
    authorId: 1,
  },
  {
    title: 'City of Glass',
    authorId: 2,
  },
  {
    title: 'Way of Kings',
    authorId: 3
  }
]

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    getBookByTitle: (parent, args, contextValue, info) => books.find(book => book.title === args.title)
  },
  Book: {
    author: (parent, args, contextValue, info) => authors.find(author => author.id === parent.authorId)
  }, 
  Author: {
    books: (parent, args, contextValue, info) => books.filter(book => book.authorId === parent.id)
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