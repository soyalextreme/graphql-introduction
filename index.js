const express = require("express");
const app = express();
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");
const morgan = require("morgan");

const { courses } = require("./data.json");
//console.log(courses);

const schema = buildSchema(`
    type Query{
        course(id: Int!): Course,
        courses(topic: String): [Course]
    }

    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }

    type Course {
        id: Int,
        title: String,
        author: String,
        topic: String,
        url: String
    }

`);

let getCourse = (args)=>{
    let id = args.id;
    return courses.filter(course =>{
        return course.id == id;
    })[0]

}


let updateCourseTopic = ({id, topic })=>{
    courses.map(course=>{
        if(course.id === id){
            course.topic = topic;
            return course;
        }
    });
    console.log(courses)
    return courses.filter(course=> course.id === id)[0];
}


let getCourses = (args)=>{
    if(args.topic){
        let topic = args.topic;
        return courses.filter(course => course.topic === topic);
    }else{
        return courses;
    }
};

const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
}

app.use(morgan("tiny"));

app.use("/graphql", express_graphql({
    schema: schema,
    rootValue: root,
    // para poder ver el interfaz
    graphiql: true
}))




app.listen(3000,()=>{
    console.log("server on port 3000");
})
