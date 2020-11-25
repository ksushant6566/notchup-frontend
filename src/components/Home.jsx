import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import moment from 'moment';

const Home = () => {
    const [parentName, setParentName] = useState("");
    const [parentContact, setParentContact] = useState("");
    const [parentEmail, setParentEmail] = useState("");
    const [childName, setChildName] = useState("");
    const [childAge, setChildAge] = useState("");
    const [selectedCourse, setSelectedCourse] = useState({slots: []});
    const [trialSlot, setTrialSlot] = useState("");

    const [courses, setCourses] = useState([]);
    const [avaialbleSlots, setAvailableSlots] = useState({});
    const [submitStatus, setSubmitStatus] = useState("");

//  FETCH COURSES

    useEffect( () => {

        document.getElementsByTagName("form")[0].style.display = 'flex'
        document.getElementsByTagName("button")[0].style.display = 'block'
        document.getElementsByClassName("response")[0].style.display = 'block'

        axios("https://script.google.com/macros/s/AKfycbzJ8Nn2ytbGO8QOkGU1kfU9q50RjDHje4Ysphyesyh-osS76wep/exec")
            .then(res => {
                setCourses(res.data)
            })
            .catch(err => console.log(err))
    }, [])

// HANDLE SUBMIT 

    const handleSubmit = (e) => {
        e.preventDefault();
        const details = {
            parentName,
            // parentContact,
            parentEmail,
            childName,
            // childAge,
            // selectedCourse : selectedCourse.course_name,
            trialSlot : trialSlot.substring(0, 22)
        }
        
        axios.post("http://localhost:5000/submit", details)
            .then(res => {
                console.log(res.data)
                res.data === "successfull" ? setSubmitStatus("successfull") : setSubmitStatus("unsuccessfull");
            })
            .catch(err => {
                console.log(err)  
            })

        document.getElementsByTagName("form")[0].style.display = 'none'
        document.getElementsByTagName("button")[0].style.display = 'none'
        document.getElementsByClassName("response")[0].style.display = 'block'
    
    }

// RENDER COMPONENTS ACCORDING TO SUBMIT RESPONSE

    useEffect(() => {
        
        if(submitStatus === "successfull") {
            document.getElementsByClassName("response")[0].innerHTML = 'Your Class has been Booked Sucessfully\nCheck Email for confirmation'
        }else if(submitStatus === "unsuccessfull"){
            document.getElementsByClassName("response")[0].innerHTML = 'Something went wrong\nPlease try again'
        }
    }, [submitStatus])

// UPDATE AVAILABLE SLOTS EVERYTIME SELECTED COURSE CHANGES

    useEffect(() => {
        const slots = {};
        const currentDate = new Date();
        selectedCourse.slots.forEach(slot => {
            const newDate = new Date(parseInt(slot.slot));

            if(newDate.getDate() > currentDate.getDate()
                || ( newDate.getDate() === currentDate.getDate() && (currentDate.getHours() + 4) <= newDate.getHours() )
            ) {
                console.log(currentDate.toLocaleString())
            
                const key = newDate.toDateString().substring(0, 10);
                if(!slots[key]) { slots[key] = []; }
                slots[key].push(newDate.toLocaleString())
            }

        })
        
        setAvailableSlots(slots);

    }, [selectedCourse])


    return (
        <div className="container">

            <div className="header">
                <h1>Book A Free Trial Class For Your Child</h1>
                <hr></hr>
            </div>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label">Parent's Name</label>
                    <input
                        name="parentName"
                        className="form-control"
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                    ></input>
                </div>

                <div className="form-group">
                    <label className="label">Parent's Contact Number</label>
                    <input
                        name="parentContact"
                        className="form-control"
                        type="Number"
                        value={parentContact}
                        onChange={(e) => setParentContact(e.target.value)}
                    ></input>
                </div>

                <div className="form-group">
                    <label className="label">Parent's Email ID</label>
                    <input
                        name="parentEmail"
                        className="form-control"
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                    ></input>
                </div>

                <div className="form-group">
                    <label className="label">Child's Name</label>
                    <input
                        name="childName"
                        className="form-control"
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                    ></input>
                </div>

                <div className="form-group">
                    <label className="label">Child's Age</label>
                    <input
                        name="childAge"
                        className="form-control"
                        type="number"
                        min="7"
                        max="17"
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                    ></input>
                </div>

                <div className="form-group">
                    <label className="label">Course </label>
                    <select
                        name="selectedCourse"
                        className="form-control "
                        value={JSON.stringify(selectedCourse)}
                        onChange={(e) => setSelectedCourse(JSON.parse(e.target.value))}   
                    >
                        {courses.map(course => {
                                return (
                                    <option key={course.course_id} value={JSON.stringify(course)}>{course.course_name}</option>
                                )
                            })}
                    </select>
                </div>

            

                <div className="slots">
                    { 
                        Object.keys(avaialbleSlots).map(item => {

                            return (
                                <div key={item} className="form-group slot">
                                    <label className="label">{item}</label> 
                                    <select 
                                        value={trialSlot} 
                                        onChange={(e) => setTrialSlot(e.target.value)} 
                                        className="form-control" >

                                        {
                                            avaialbleSlots[item].map(slot => {
                                                return ( <option  key={slot} value={slot} >{slot.substring(12, 28)}</option> )
                                            })
                                        }

                                    </select>   
                                </div>
                            )
                        })
                    }
                </div>
            </form> 

            <div className="response"></div>


            <div>
                <button className="btn btn-lg btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
            
        </div>
    )
}

export default Home;