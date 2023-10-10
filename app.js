/*
Programming Language: JavaScript

Server-side Framework: Node.js with Express.js

Database: SQLite (as mentioned in the provided database file blogData.db)

*/

const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const dbPath = path.join(__dirname, "blogData.db");
let dbConnectionObject = null;

const initializeDBAndServer = async () => {
  try {
    dbConnectionObject = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(8383, () => {
      console.log("Server Running at http://localhost:8383/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//user exist Middleware function
const userExistOrNotMiddleware = async (requestObject,responseObject,next)=>{
    const requestObjectParameters =  requestObject.params 
    console.log(requestObjectParameters) 
    const { userId } = requestObjectParameters;
    const userExistQuery = `SELECT * FROM users WHERE userId=${userId};`
    const dbResponse = await dbConnectionObject.get(userExistQuery)
    if (dbResponse === undefined) {
        responseObject.status(404);
        responseObject.send("User Doesn't exists");
    }
    else{
        next() // next route handler 
    }
}

//blog exist middleware function
const blogExistMiddleware = async (requestObject,responseObject,next)=>{
    const requestObjectParameters =  requestObject.params 
    console.log(requestObjectParameters) 
    const { blogId } = requestObjectParameters;
    const blogExistQuery = `SELECT * FROM blogs WHERE blogId=${blogId};`
    const dbResponse = await dbConnectionObject.get(blogExistQuery)
    if (dbResponse === undefined) {
        responseObject.status(404);
        responseObject.send("Blog Doesn't exists");
    }
    else{
        next() // next route handler 
    }
}

// comment Exist Middleware 
const commentExistMiddleware = async (requestObject,responseObject,next)=>{
    const requestObjectParameters =  requestObject.params 
    console.log(requestObjectParameters) 
    const { commentId } = requestObjectParameters;
    const commentExistQuery = `SELECT * FROM Comments WHERE commentId=${commentId};`
    const dbResponse = await dbConnectionObject.get(commentExistQuery)
    if (dbResponse === undefined) {
        responseObject.status(404);
        responseObject.send("Comment Doesn't exists");
    }
    else{
        next() // next route handler 
    }
}


// Users

// Get all users API 1
app.get("/users", async (requestObject, responseObject) => {
  const usersQuery = `SELECT * FROM users`;
  const users = await dbConnectionObject.all(usersQuery);
  responseObject.send(users);
});

// Create a new user API 2
app.post("/users", async (requestObject, responseObject) => {
  const requestObjectBody =  requestObject.body
  console.log(requestObjectBody)
  const { username, email,password } = requestObjectBody;

  const registerUsernameQuery = `SELECT * FROM users WHERE username='${username}';`;
  const dbResponse = await dbConnectionObject.get(registerUsernameQuery);

  if (dbResponse !== undefined) {
    responseObject.status(400);
    responseObject.send("User already exists");
  }
  if (dbResponse === undefined) {
    if (password.length < 8) {
      responseObject.status(400);
      responseObject.send("Password is too short");
    } else {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const creatingUserQuery = `
        INSERT INTO users (username, email, password)
        VALUES ('${username}', '${email}', '${encryptedPassword}');
      `;
      await dbConnectionObject.run(creatingUserQuery);
      responseObject.status(200);
      responseObject.send("User created successfully");
    }
  }
});

// Get a user by ID API 3
app.get("/users/:userId",userExistOrNotMiddleware, async (requestObject, responseObject) => {
  const requestObjectParameters =  requestObject.params 
  console.log(requestObjectParameters) 
  const { userId } = requestObjectParameters;
  const getUserQuery = `SELECT * FROM users WHERE userId = ${userId}`;
  const basicUserDetails = await dbConnectionObject.get(getUserQuery);
  const displayingUserDetails = {
    userId: basicUserDetails.userId,
    username: basicUserDetails.username,
    email: basicUserDetails.email,
  }
  responseObject.send(displayingUserDetails);
});

// Update a user by ID API 4
app.put("/users/:userId",userExistOrNotMiddleware, async (requestObject, responseObject) => {
    console.log("User exist validation through userExistOrNotMiddleware function completed successfully")
    const requestObjectParameters =  requestObject.params 
    console.log(requestObjectParameters) 
    const { userId } = requestObjectParameters;

    const requestObjectBody = requestObject.body;
    console.log(requestObjectBody)
    const { username, email } =requestObjectBody;

    const updateUserQuery = `UPDATE users SET username = '${username}', email = '${email}'WHERE userId = ${userId}`;
    await dbConnectionObject.run(updateUserQuery);
    responseObject.send("User updated successfully");
});

// Delete a user by ID API 5
app.delete("/users/:userId",userExistOrNotMiddleware, async (requestObject, responseObject) => {
  const { userId } = requestObject.params;
  const deleteUserQuery = `DELETE FROM users WHERE userId = ${userId}`;
  await dbConnectionObject.run(deleteUserQuery);
  responseObject.send("User deleted successfully");
});

// Blogs

// Get all blogs API 6
app.get("/blogs", async (requestObject, responseObject) => {
  const blogsQuery = `SELECT * FROM blogs`;
  const blogsDetails = await dbConnectionObject.all(blogsQuery);
  responseObject.send(blogsDetails);
});

// Create a new blog API 7
app.post("/blogs", async (requestObject, responseObject) => {
  const { title, content, userId } = requestObject.body;
  const createBlogQuery = `
    INSERT INTO blogs (title, content, userId)
    VALUES ('${title}', '${content}', ${userId})
  `;
  await dbConnectionObject.run(createBlogQuery);
  responseObject.send("Blog created successfully");
});

// Get a blog by ID API 8
app.get("/blogs/:blogId",blogExistMiddleware, async (requestObject, responseObject) => {
  const { blogId } = requestObject.params;
  const getBlogQuery = `SELECT * FROM blogs WHERE blogId = ${blogId}`;
  const blog = await dbConnectionObject.get(getBlogQuery);
  responseObject.send(blog);
});

// Update a blog by ID API 9
app.put("/blogs/:blogId",blogExistMiddleware, async (requestObject, responseObject) => {
  const { blogId } = requestObject.params;
  const { title, content } = requestObject.body;

  const updateBlogQuery = `
    UPDATE blogs
    SET title = '${title}', content = '${content}'
    WHERE blogId = ${blogId}
  `;
  await dbConnectionObject.run(updateBlogQuery);
  responseObject.send("Blog updated successfully");
});

// Delete a blog by ID API 10
app.delete("/blogs/:blogId",blogExistMiddleware, async (requestObject, responseObject) => {
  const { blogId } = requestObject.params;
  const deleteBlogQuery = `DELETE FROM blogs WHERE blogId = ${blogId}`;
  await dbConnectionObject.run(deleteBlogQuery);
  responseObject.send("Blog deleted successfully");
});

// Comments

// Get all comments API 11
app.get("/comments", async (requestObject, responseObject) => {
  const commentsQuery = `SELECT * FROM Comments`;
  const comments = await dbConnectionObject.all(commentsQuery);
  responseObject.send(comments);
});

// Create a new comment API 12
app.post("/comments", async (requestObject, responseObject) => {
  const { content, userId, blogId } = requestObject.body;
  const createCommentQuery = `
    INSERT INTO Comments (content, userId, blogId)
    VALUES ('${content}', ${userId}, ${blogId})
  `;
  await dbConnectionObject.run(createCommentQuery);
  responseObject.send("Comment created successfully");
});

// Get a comment by ID API 13
app.get("/comments/:commentId",commentExistMiddleware, async (requestObject, responseObject) => {
  const { commentId } = requestObject.params;
  const getCommentQuery = `SELECT * FROM Comments WHERE commentId = ${commentId}`;
  const comment = await dbConnectionObject.get(getCommentQuery);
  responseObject.send(comment);
});

// Update a comment by ID API 14
app.put("/comments/:commentId",commentExistMiddleware, async (requestObject, responseObject) => {
  const { commentId } = requestObject.params;
  const { content } = requestObject.body;

  const updateCommentQuery = `
    UPDATE Comments
    SET content = '${content}'
    WHERE commentId = ${commentId}
  `;
  await dbConnectionObject.run(updateCommentQuery);
  responseObject.send("Comment updated successfully");
});

// Delete a comment by ID API 15
app.delete("/comments/:commentId",commentExistMiddleware, async (requestObject, responseObject) => {
  const { commentId } = requestObject.params;
  const deleteCommentQuery = `DELETE FROM Comments WHERE commentId = ${commentId}`;
  await dbConnectionObject.run(deleteCommentQuery);
  responseObject.send("Comment deleted successfully");
});

// Define a function to get 1st level friends
 const getFirstLevelFriends=async (userId)=>{
    const firstLevelFriendsQuery = `
    SELECT * FROM friends
    WHERE user1Id = ${userId} OR user2Id = ${userId}
  `;
  const firstLevelFriends = await dbConnectionObject.all(firstLevelFriendsQuery);
  return firstLevelFriends;
}

// Get 1st level friends of a user API 16
app.get("/users/:userId/level/1", async (requestObject, responseObject) => {
    const { userId } = requestObject.params;
    const firstLevelFriends = await getFirstLevelFriends(userId);
    responseObject.send(firstLevelFriends);
});
  

// Define a function to get 2nd level friends
const getSecondLevelFriends= async (userId)=>{
    const secondLevelFriendsQuery = `
      SELECT DISTINCT users.* 
      FROM users
      INNER JOIN friends AS f1 ON (users.userId = f1.user1Id OR users.userId = f1.user2Id)
      INNER JOIN friends AS f2 ON (users.userId = f2.user1Id OR users.userId = f2.user2Id)
      WHERE (f1.user1Id = ${userId} OR f1.user2Id = ${userId})
      AND (f2.user1Id != ${userId} AND f2.user2Id != ${userId})
    `;
    const secondLevelFriends = await dbConnectionObject.all(secondLevelFriendsQuery);
    return secondLevelFriends;
}
  
// Get 2nd level friends of a user API 17
app.get("/users/:userId/level/2", async (requestObject, responseObject) => {
    const { userId } = requestObject.params;
    const secondLevelFriends = await getSecondLevelFriends(userId);
    responseObject.send(secondLevelFriends);
});
