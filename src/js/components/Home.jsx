import React from "react";
import TodoList from "./TodoList.jsx";
import backgroundImg from "../../img/paper.jpg";

const Home = () => {
  return (
   
    <div
      className="home-container"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="todo-wrapper">
        <div className="card-layer-1"></div>
        <div className="card-layer-2"></div>
        <div className="task-card">
          <h1 className="todo-header">MY TODO LIST</h1>
          <TodoList />
        </div>
      </div>
    </div>
    
  );
};

export default Home;
