import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";
import axiosInstance from "../API/axios";
import "./Homecss.css";

// const data = [
//   {
//     id: 1,
//     question: "Question 1",
//     options: ["Option 1", "Option 2", "Option 3", "Option 4"],
//     answer: "Option 1",
//     dateTime: "2023-06-23T07:07:02.000Z",
//   },
// ];

const ITEMS_PER_PAGE = 5;

const BoxWithTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  var itemList = [];
  const [reloadFlag, setReloadFlag] = useState(false)
  const [listData, setListData] = useState([]);
  var indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  var indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const [currentItems, setCurrentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSetListData = async (data) => {
    return new Promise(async (resolve) => {
      await setListData(data);
      resolve();
    });
  };
  
  const handleSetCurrentItems = async (data) => {
    return new Promise(async (resolve) => {
      await setCurrentItems(data);
      resolve();
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
  });

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
  });
  const handleUpdateModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const handleUpdate = (item) => { 
    setUpdateFormData({
      _id: item._id,
      question: item.question,
      option1: item.option1,
      option2: item.option2,
      option3: item.option3,
      option4: item.option4,
      answer: item.answer,
    });
    setIsUpdateModalOpen(!isUpdateModalOpen)
  };

  const handleFormChange = (e) => {
    // Update the respective field value in the updateFormData state when the user changes the input
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    const headers = {
      'Authorization': `${localStorage.getItem('accessToken')}`,
    }
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/delete_question", {'_id' : id}, {headers}
      )
      if(response.status === 200) {
        setReloadFlag(!reloadFlag)
      }
    } catch(error) {
    }    
  };

  const fetchData = async () => {
    try {
      const accessToken = await localStorage.getItem("accessToken");
      const headers = {
        Authorization: `${accessToken}`,
      };

      const response = await axiosInstance.get(
        "http://localhost:3000/get_questions",
        { headers }
      );
      if (response.status === 200) {
        const data = await response.data
        if (data.length > 0) {
          await handleSetListData(data)
          var indexOfLastItem = currentPage * ITEMS_PER_PAGE;
          var indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
          await handleSetCurrentItems(data.slice(indexOfFirstItem, indexOfLastItem))  
          setIsLoading(false);
        }
      }
    } catch (error) {
      alert("fetchERROR:", error)
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, reloadFlag]);

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/insert_question",
        formData
      );
      if (response.status === 200) {
        setReloadFlag(!reloadFlag)
      }
    } catch (error) {
      alert("Home Error: ", error);
    }

    setFormData((prevData) => ({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
    }));
    handleModal();
  };
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      'Authorization': `${localStorage.getItem('accessToken')}`
    }
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/update_question",
        updateFormData, {headers}
      );
      if (response.status === 200) {
        setReloadFlag(!reloadFlag)
      }
    } catch (error) {
      alert("UpdateError: ", error);
    }

    setUpdateFormData((prevData) => ({
      _id: "",
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
    }));
    handleUpdateModal();    
  }

  return (
    
    <div className="container">
      <div className="add">
        <button className="add-btn" onClick={handleModal}>
          ADD QUESTION
        </button>
        {/* ADD MODAL */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                {/* Form inputs */}
                <label>
                  Question:
                  <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Option 1:
                  <input
                    type="text"
                    name="option1"
                    value={formData.option1}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Option 2:
                  <input
                    type="text"
                    name="option2"
                    value={formData.option2}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Option 3:
                  <input
                    type="text"
                    name="option3"
                    value={formData.option3}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Option 4:
                  <input
                    type="text"
                    name="option4"
                    value={formData.option4}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Answer:
                  <input
                    type="text"
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                  />
                </label>
                {/* Add other input fields for option1, option2, etc. */}
                <button type="submit">Submit</button>
                <button type="button" onClick={handleModal}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
        {/* UPDATE MODAL */}
        {isUpdateModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleUpdateSubmit}>
                {/* Form inputs */}
                <label>
                  Question:
                  <input
                    type="text"
                    name="question"
                    value={updateFormData.question}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  Option 1:
                  <input
                    type="text"
                    name="option1"
                    value={updateFormData.option1}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  Option 2:
                  <input
                    type="text"
                    name="option2"
                    value={updateFormData.option2}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  Option 3:
                  <input
                    type="text"
                    name="option3"
                    value={updateFormData.option3}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  Option 4:
                  <input
                    type="text"
                    name="option4"
                    value={updateFormData.option4}
                    onChange={handleFormChange}
                  />
                </label>
                <label>
                  Answer:
                  <input
                    type="text"
                    name="answer"
                    value={updateFormData.answer}
                    onChange={handleFormChange}
                  />
                </label>
                {/* Add other input fields for option1, option2, etc. */}
                <button type="submit">Submit</button>
                <button type="button" onClick={handleUpdateModal}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="box">
        <table className="table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Option - 1</th>
              <th>Option - 2</th>
              <th>Option - 3</th>
              <th>Option - 4</th>
              <th>Answer</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            ) : currentItems && currentItems.length > 0 ? (
              <>
               { currentItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.question}</td>
                  <td key={item.option1}>{item.option1}</td>
                  <td key={item.option2}>{item.option2}</td>
                  <td key={item.option3}>{item.option3}</td>
                  <td key={item.option4}>{item.option4}</td>
                  <td>{item.answer}</td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdate(item)}
                    >
                      <RiEdit2Line />
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              )) }
              </>
            ) : (
              <tr>
                <td colSpan="9">No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({
          length: Math.ceil(listData.length / ITEMS_PER_PAGE),
        }).map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>


    // <div className="container">
    //   <div className="add">
    //     <button className="add-btn" onClick={handleModal}>
    //       ADD QUESTION
    //     </button>
    //     {isModalOpen && (
    //       <div className="modal">
    //         <div className="modal-content">
    //           <form onSubmit={handleFormSubmit}>
    //             {/* Form inputs */}
    //             <label>
    //               Question:
    //               <input
    //                 type="text"
    //                 name="question"
    //                 value={formData.question}
    //                 onChange={handleInputChange}
    //               />
    //             </label>
    //             <label>
    //               Option 1:
    //               <input
    //                 type="text"
    //                 name="option1"
    //                 value={formData.op1}
    //                 onChange={handleInputChange}
    //               />
    //             </label>
    //             <label>
    //               Option 2:
    //               <input
    //                 type="text"
    //                 name="option2"
    //                 value={formData.op2}
    //                 onChange={handleInputChange}
    //               />
    //             </label>
    //             <label>
    //               Option 3:
    //               <input
    //                 type="text"
    //                 name="option3"
    //                 value={formData.op3}
    //                 onChange={handleInputChange}
    //               />
    //             </label>
    //             <label>
    //               Option 4:
    //               <input
    //                 type="text"
    //                 name="option4"
    //                 value={formData.op4}
    //                 onChange={handleInputChange}
    //               />
    //             </label>
    //             <label>
    //               Answer:
    //               <input
    //                 type="text"
    //                 name="answer"
    //                 value={formData.op5}
    //                 onChange={handleInputChange}
    //               />
    //             </label>
    //             {/* Add other input fields for option1, option2, etc. */}

    //             <button type="submit">Submit</button>
    //             <button type="button" onClick={handleModal}>
    //               Cancel
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    //   <div className="box">
    //     <table className="table">
    //       <thead>
    //         <tr>
    //           <th>Question</th>
    //           <th>Option - 1</th>
    //           <th>Option - 2</th>
    //           <th>Option - 3</th>
    //           <th>Option - 4</th>
    //           <th>Answer</th>
    //           <th>Date & Time</th>
    //           <th>Update</th>
    //           <th>Delete</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {
    //           currentItems.length > 0 ?
    //           (
    //             currentItems.map((item) => (
    //               <tr key={item._id}>
    //                 <td>{item.question}</td>
    //                 {item.options.map((option, index) => (
    //                   <td key={index}>{option}</td>
    //                 ))}
    //                 <td>{item.answer}</td>
    //                 <td>{item.dateTime}</td>
    //                 <td>
    //                   <button
    //                     className="update-btn"
    //                     onClick={() => handleUpdate(item._id)}
    //                   >
    //                     <RiEdit2Line />
    //                   </button>
    //                 </td>
    //                 <td>
    //                   <button
    //                     className="delete-btn"
    //                     onClick={() => handleDelete(item._id)}
    //                   >
    //                     <RiDeleteBinLine />
    //                   </button>
    //                 </td>
    //               </tr>
    //             ))
    //           ) : (
    //           <p>Loading...</p>
    //           )
    //         }
    //       </tbody>
    //     </table>
    //   </div>

      // {/* Pagination */}
    //   <div className="pagination">
    //     {Array.from({
    //       length: Math.ceil(listData.length / ITEMS_PER_PAGE),
    //     }).map((_, index) => (
    //       <button key={index} onClick={() => handlePageChange(index + 1)}>
    //         {index + 1}
    //       </button>
    //     ))}
    //   </div>
    // </div>
  );
};

export default BoxWithTable;
