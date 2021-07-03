import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { TinaProvider, TinaCMS, useCMS, useForm, usePlugin } from "tinacms"

const BlogIndex = () => {
  const cms = new TinaCMS({
    sidebar: true,
  })

  return (
    <div>
      <p>Hello there</p>
      {/* <PageContent /> */}
    </div>
  )
}

export default BlogIndex

//NON-GATSBY CODE

function PageContent() {
  const formConfig = {
    id: "tina-tutorial-index",
    label: "Edit Page",
    fields: [
      {
        name: "title",
        label: "Title",
        component: "text",
      },
      {
        name: "ThisCouldBeYou",
        label: "slogan",
        component: "textarea",
      },
      {
        name: "YourJourney",
        label: "Journey",
        component: "textarea",
      },
      {
        name: "makeYourCareer",
        label: "career",
        component: "textarea",
      },
    ],
    // initialValues: pageData,
    loadInitialValues() {
      return fetch("http://localhost:1337/home-pages/1").then(response =>
        response.json()
      )
    },
    // onSubmit: async () => {
    //   window.alert("Saved!");
    // },
    onSubmit(formData) {
      const { makeYourCareer, YourJourney, ThisCouldBeYou } = formData
      return fetch("http://localhost:1337/home-pages/1", {
        method: "PUT",
        body: JSON.stringify({
          id: 1,
          title: formData.title,
          body: formData.body,
          makeYourCareer,
          YourJourney,
          ThisCouldBeYou,
          userId: 1,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(e => console.error(e))
    },
  }

  // 3. Create the form
  const [editableData, form] = useForm(formConfig)

  const { title, makeYourCareer, YourJourney, ThisCouldBeYou } = editableData

  // 4. Register it with the CMS
  usePlugin(form)

  return (
    <section className="App-header">
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <h1>{title}</h1>
      <p>{makeYourCareer}</p>
      <p>{YourJourney}</p>
      <p>{ThisCouldBeYou}</p>
      {/* <p>{makeYourCareer}</p> */}
      <EditButton />
    </section>
  )
}

function EditButton() {
  const cms = useCMS()
  return (
    <button onClick={() => cms.toggle()}>
      {cms.enabled ? "Exit Edit Mode" : "Edit This Site"}
    </button>
  )
}

// import logo from "./Icon.svg"
// import "./App.css"

// function App() {
//   return (
//     <TinaProvider cms={cms}>
//       <div className="App">
//         <PageContent />
//       </div>
//     </TinaProvider>
//   )
// }

// export default App

// const pageData = {
//   title: "Tina is not a CMS",
//   body: "It is a toolkit for creating a custom CMS.",
// };
