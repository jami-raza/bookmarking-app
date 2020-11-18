const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb');
q = faunadb.query;

const typeDefs = gql`
  type Query {
    
    Bookmark: [bookmar]
    
  }
  type bookmar {
    id: ID!
    title: String!
    url: String!
    desc: String!
  }
  type Mutation {
    addbookmark(title: String!, url: String!, desc: String!): bookmar
    delbookmark(id:ID!): bookmar
    
  }
`

//const authors = [
//  { id: 1, name: 'Terry Pratchett', married: false },
//  { id: 2, name: 'Stephen King', married: true },
//  { id: 3, name: 'JK Rowling', married: false },
//]
const client = new faunadb.Client({secret:"fnAD6EFsqIACAbyMUIBkf-9N8h4ncLSdCk30MKeb"})

const resolvers = {
  Query: {
    Bookmark: async (root,args,context) => {
      try{
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('bookmarkdata'))),
            q.Lambda((x) => q.Get(x))
          )     
        )
        console.log(result)
        return result.data.map((d)=>{
          return {
            id:d.ref.id,
            title: d.data.title,
            url: d.data.url,
            desc: d.data.desc,
          }
        })
      }catch(err){
        console.log(err)
      }
      
    },
   
  },
  Mutation: {
    addbookmark: async (_, { title, url, desc }) => {
      try{
        const result = await client.query(
          q.Create(q.Collection('Bookmark'),{
            data:{
              title,
              url,
              desc
            }
          })
        )
        return result.data.data
      }
      catch(err){
        console.log(err)
      }
    },
    delbookmark: async (_, {id}) => {
      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection('Bookmark'),
          id
          ))
        );
          console.log(result)
          return result.data.data

      }catch(err){
        console.log(err)
      }
    },
    
    
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
