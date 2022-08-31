const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const app = express();

const events = [];

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type Event {
        id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootQuery {
        events: [Event!]!
    }
    type RootMutation {
        createEvent(eventInput: EventInput): Event
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) =>{
            const event = {
                id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date().toISOString(),
            };
            console.log(event);
            events.push(event)

            return event
        }
    },
    graphiql: true
})
);

try {
    app.listen(3002, () => {
        console.log(`Server is running on 3002`);
    });
} catch (err) {
    console.log(err);
}
