import { Formik, Form, Field, FieldArray, useFormik } from "formik";
import {
  ClassicEditor,
  Context,
  Bold,
  Essentials,
  Italic,
  Paragraph,
} from "ckeditor5";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useState } from "react";
import { exportToExcel } from "react-json-to-excel";
import * as Yup from "yup";
import "./Validation.css";
import html2pdf from "html2pdf.js";

const QuestionAnswer = () => {
  const [allData, setAllData] = useState([]);
 const [add ,setAdd] = useState(false)
 const [localData,setLocalData]= useState(false)
  const headerData = localStorage.formData;
  const footerheader = JSON.parse(headerData);
  console.log(footerheader);

  const handleSubmit = (values) => {
    const formattedData = values.Question.map((item) => ({
      question: item.question,
      answer: item.answer,
    }));
    setAllData(formattedData);
    setAdd(true);
    
  };

  // console.log(localStorage);
  // console.log("alldata:", allData);


  const exportHtmlToPDF = () => {
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
    <h1 style="
      text-align: center;
      font-size: 24px;
      color: black;
      margin-bottom: 20px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 10px;
    ">
      ${footerheader.header || "Default Header"}
    </h1>
    <br/>
  `;
    footerheader;

    allData.forEach((item, index) => {
      const itemDiv = document.createElement("div");

      itemDiv.innerHTML = `
        ${item.Header ? item.Header : ""}
        <p><b>Question:</b> ${item.question}</p>
        <p><b>Answer:</b> ${item.answer}</p>
        ${item.Footer ? item.Footer : ""}
      `;
      tempDiv.appendChild(itemDiv);
    });
    tempDiv.innerHTML += `
    <div style="text-align: center; margin-bottom: 25px; background-color: #f1f1f1; padding: 10px; font-size: 14px; color: #333;  border-top: 1px solid #ddd;">
      <small>${footerheader.footer || "Default Footer"}</small>
    </div>
    <br/>
  `;
    if (tempDiv.innerHTML.trim() === "") {
      console.error("No content to export!");
      return;
     
     

    }
    html2pdf()
      .set({
        margin: 1,
        filename: "ExportedContent.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(tempDiv)
      .save();

    
    };

    const handleEdit = ()=>{
      setAdd(false);
    }
  
    // const handleReset = ()=>{
    //   setAdd([])
     
     
    // }


   let count =1
  return (
    <>
      <label htmlFor=""> Enter your Answer and Question</label>
      <Formik
         
        initialValues={{ Question: [ { question: "", answer: "" }] }}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          Question: Yup.array()
            .of(
              Yup.object().shape({
                question: Yup.string().required("Question Required"),
                answer: Yup.string().required("Answer Required"),
              })
            )
            .required("Required field"),
        })}
      >
        {({ values, errors, touched }) => (
          <Form>
            <FieldArray
              name="Question"
              render={(arrayHelpers) => (
                <div>
                  {values.Question.map((item,index) => (
                    <div key={item.id} style={{ border:"solid",borderColor:"#bdd3e4",gap: "20px" }}>
                    <label> Question : </label>
                      <CKEditor
                        editor={ClassicEditor}
                        config={{
                          plugins: [Essentials, Bold, Italic, Paragraph],
                          toolbar: [
                         
                            "heading",
                            "undo",
                            "redo",
                            "|",
                            "bold",
                            "italic",
                          ],
                        }}
                        onChange={(event, editor) => {
                          const quesdata = editor.getData();
                          const questext = quesdata.replace(
                            /<\/?[^>]+(>|$)/g,
                            ""
                          );
                          arrayHelpers.replace(index, {
                            ...item,
                            question: questext,
                          });
                        }}
                      />
                      {touched.Question?.[index]?.question &&
                        errors.Question?.[index]?.question && (
                          <div style={{ color: "red" }}>
                            {errors.Question[index].question}
                          </div>
                        )}

                      <label> Answer: </label>
                      <CKEditor
                        editor={ClassicEditor}
                        config={{
                          plugins: [Essentials, Bold, Italic, Paragraph],
                          toolbar: [
                         
                            "heading",
                            "undo",
                            "redo",
                            "|",
                            "bold",
                            "italic",
                          ],
                        }}
                        onChange={(event, editor) => {
                          const ansdata = editor.getData();

                          const answertext = ansdata.replace(
                            /<\/?[^>]+(>|$)/g,
                            ""
                          );
                          arrayHelpers.replace(index, {
                            ...item,
                            answer: answertext,
                          });
                        }}
                      />
                      {touched.Question?.[index]?.answer &&
                        errors.Question?.[index]?.answer && (
                          <div style={{ color: "red" }}>
                            {errors.Question[index].answer}
                          </div>
                        )}


                     
                    {
     
                        values.Question.length> 1 ? (
                          <button
                        type="button"
                        className="remove-button"
                        onClick={() => {
                          // debugger;
                          arrayHelpers.remove(index)
                        }}
                         disabled={ add==true}

                         
                      >
                        Remove
                      </button>
                        ) : null  
                      
                    }
                       
                    </div>
                                    
                  ))}
                  
                  <button
                    type="button"
                    className="submit-button"
                    onClick={() => {
                      arrayHelpers.push({ id: count++, question: "", answer: "" });
                    }}

                    disabled={add==true}
                  >
                    Add
                  </button>
                  <div>
                    <button type="submit" className="submit-button"
                     disabled={add==true}>
                      Submit
                    </button>
                  </div>
                  <div>
                    <button type="submit" className="submit-button"
                     disabled={add==false}
                     onClick={handleEdit}
                     >
                      Edit
                    </button>
                  </div>
               
                </div>
              )}
            />

            {allData && allData.length > 0 ? (
              allData.map((item, index) => (
                <div key={item.id}>
                  <div ><h1>{item.header}</h1></div>
                  <div style={{ wordBreak: "break-all" }}>

                    <p>
                      <b>Question:{index+1}</b> {item.question}
                    </p>
                    <p>
                      <b>Answer:{index+1}</b> {item.answer}
                    </p>
                  </div>

                  <div><small>{item.footer}</small></div>
                </div>
              ))
            ) : (
              <p></p>
            )}
              <button
                    onClick={() => exportToExcel(allData, "data")}
                    className="submit-button"
                    disabled={allData.length == 0 ||add ==false}
                  >
                    Download Excel
                  </button>

            <button
              onClick={exportHtmlToPDF }
              className="submit-button"
              disabled={allData.length == 0||add ==false}
            >
              Export to PDF
            </button>
{/* 
            <button
              onClick={handleReset}
              className="submit-button"
              disabled={allData.length == 0}
            >
              Reset
            </button> */}
          </Form>
        )}
        
      </Formik>

    </>
  );
};

export default QuestionAnswer;
