import {Form} from "react-bootstrap";
import {useState, useEffect} from "react";
import {Button} from "react-bootstrap";
import axios from "axios";
import "./App.css";
import Modal from 'react-bootstrap/Modal';
import React from "react";

function App() {

  // const [, updateState] = React.useState();
  // const forceUpdate = React.useCallback(() => updateState({}), []);
  const fileReader = new FileReader();

  const [note, setNote] = useState({
      title: "",
      description: "",
      fileUpload: ""
  });

  const handleChange  = (event) => {
      // const {name,value} = event.target
      
      setNote({
          ...note,
          [event.target.name]: event.target.value
      })
  }

  // var form = document.querySelector('form');
  const handleClick = (event) => {
    
    const formData = new FormData();

    formData.append("title", note.title);
    formData.append("description", note.description);
    formData.append("fileUpload", note.fileUpload);

    if (note.title !== "" && note.description !== "") {
      // axios.post("/app", formData);
      axios({
        method: "post",
        url: "/app",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          //handle success
          console.log(response);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });

      setNote({
        title: "",
        description: "",
        fileUpload: ""
      })
    }

    // console.log(formData);

    // for (var [key, value] of formData.entries()) { 
    //   console.log(key, value);
    // }

    // console.log(formData.entries());
  }

  // const handleNoteClick = (event) => {
  //     if (note.title !== "" && note.description !== "") {
  //       axios.post("/app", note);
  //       setNote({
  //         title: "",
  //         description: ""
  //       })
  //       console.log(note)
  //     }
  // }

  const handleDelete = (id) => {
    axios.delete(`/app/${id}`)
    .then((doc) => {
      console.log(doc);
    })
    .catch((err) => console.log(err));
  }
  
  const [notes, setNotes] = useState([]);

  axios
  .get("/app", {})
  .then((res) => {
      setNotes(res.data.reverse());
  })
  .catch((err) => console.log(err));
  
  // const headers = { 'Content-Type': 'application/json' }
  // fetch('/notes', { headers });

  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  }
  const handleHide = () => {
    setShow(false);
  }

  const [updatedNote, setUpdatedNote] = useState({});

  const handleSelectNote = (note) => {
    console.log(note);
    setUpdatedNote(note);
    handleShow();
  }

  const handleChangeEdit = (event) => {
    setUpdatedNote({
        ...updatedNote,
        [event.target.name]: event.target.value
    })
  }

  const saveUpdatedNote = () => {
    axios
      .put(`/app/${updatedNote._id}`, updatedNote)
      .then((doc) => console.log(doc))
      .catch((err) => console.log(err));
    handleHide();
  }
  
  // const [fileName, setFileName] = useState("");

  const uploadFileHandler = (e) => {
    // console.log("aye")
    // fileReader.readAsArrayBuffer(e.target.files[0]);

    setNote({
        ...note,
        fileUpload: e.target.files[0]
    })

    // setFileName(e.target.files[0]);
      
  }

  return (
    <div className="App">
      <div className="add-note">
        <div className="title">Add new note</div>
        <Form encType="multipart/form-data">
            <Form.Group>
                <Form.Control 
                    placeholder="title"
                    name="title"
                    value={note.title}
                    onChange={handleChange}
                    className="form-control"
                />
                <Form.Control 
                    as="textarea"
                    placeholder="description"
                    name="description"
                    value={note.description}
                    onChange={handleChange}
                    className="form-control"
                />
                {/* <Form.Control
                  type="file"
                  name="fileUpload"
                  filename="fileUpload"
                  label="Choose file"
                  onChange={handleChange}
                /> */}
            </Form.Group>
        </Form>
        <Button className="submit-button" onClick={handleClick}>Add</Button>
        <br />
      </div>
      <br />
      <div className="title">Notes</div>
      <div className="notes">
        {
            notes.length > 0 ? notes.map((note) => 
            <div className="note" key={note._id}>
              <span className="note-actions">
                <span className="note-action-update" onClick={() => {handleSelectNote(note)}}><span className="note-action-label">update</span> ✎</span>
                <br/>
                &nbsp;<span className="note-action-delete" onClick={() => {handleDelete(note._id)}}>&nbsp;<span className="note-action-label">delete</span> 🗑</span>
              </span>
              <b>{note.title}</b>
              <br />
              <i>{note.description}</i>
              <br />
            </div>
          ) : <div style={{textAlign:"center", color:"#a5a5a5"}}>nothing here, or still fetching from the database</div>
        }
      </div>

      <div>
        <Modal fullscreen="true" dialogClassName="edit-modal" show={show} onHide={handleHide}>
        
          <Modal.Header>
              <span style={{float: "right", padding: "4px 10px 0 0", cursor: "pointer", userSelect: "none"}} className="close" onClick={handleHide}>✖</span>
              <Modal.Title><div className="title" style={{display: "inline", padding: "5px"}}>Update note: "{updatedNote.title}"</div></Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form>
                  <Form.Group>
                      <Form.Control
                          style={{marginTop: "10px"}}
                          placeholder="title"
                          name="title"
                          value={updatedNote.title ? updatedNote.title : ""}
                          onChange={handleChangeEdit}
                      />
                      <Form.Control
                          as="textarea"
                          name="description"
                          placeholder="description"
                          value={updatedNote.description ? updatedNote.description : ""}
                          onChange={handleChangeEdit}
                      />
                      {/* <Form.Control
                        type="file"
                        name="file"
                        label="Choose file"
                        value={updatedNote.file ? updatedNote.file : ""}
                        onChange={uploadFileHandler}
                      /> */}
                  </Form.Group>
              </Form>
          </Modal.Body>
  
          <Modal.Footer>
              {/* <Button className="submit-button-modal" variant="secondary" onClick={handleHide}>
                  Close
              </Button> */}
              <Button className="submit-button-modal" variant="primary" onClick={saveUpdatedNote} style={{marginTop: "5px", marginBottom: "0px"}}>
                  Update
              </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
