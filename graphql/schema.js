const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Student {
        _id: ID!
        name: String!
        unit: String!
        lesson: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        students: [Student]
    }

    input UserInputData {
        email: String!
        password: String!
    }

    type RootQuery{
        hello: String
    }

    type RootMutation{
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)