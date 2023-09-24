import React, { useState, useEffect } from "react";
import Modal from "./components/Modal";
import axios from 'axios';

const App = () => {
  const [viewCompleted, setViewCompleted] = useState(false);
  const [activeItem, setActiveItem] = useState({
    title: "",
    description: "",
    completed: false
  });
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axios
      .get("http://localhost:8000/api/tasks/")
      .then(res => setTaskList(res.data))
      .catch(err => console.log(err));
  };

  const displayCompleted = status => {
    setViewCompleted(status);
  };

  const renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => displayCompleted(true)}
          className={viewCompleted ? "active" : ""}
        >
          completed
        </span>
        <span
          onClick={() => displayCompleted(false)}
          className={viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };

  const renderItems = () => {
    const newItems = taskList.filter(item => item.completed === viewCompleted);
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  const toggle = () => {
    setActiveItem(prevItem => ({ ...prevItem, modal: !prevItem.modal }));
  };

  const handleSubmit = item => {
    toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then(() => refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then(() => refreshList());
  };

  const handleDelete = item => {
    console.log(item.id)
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(() => refreshList());
  };

  const createItem = () => {
    const item = { title: "", description: "", completed: false };
    setActiveItem(item);
    toggle();
  };

  const editItem = item => {
    setActiveItem(item);
    toggle();
  };

  return (
    <main className="content">
      <h1 className="text-black text-uppercase text-center my-4">Task Manager</h1>
      <div className="row ">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="">
              <button onClick={createItem} className="btn btn-primary">
                Add task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush">
              {renderItems()}
            </ul>
          </div>
        </div>
      </div>
      {activeItem.modal ? (
        <Modal
          activeItem={activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      ) : null}
    </main>
  );
};

export default App;
