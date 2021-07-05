import * as React from "react"
import { TinaProvider, TinaCMS, useCMS, useForm, usePlugin } from "tinacms"

const BlogIndex = ({ pageContext: pageRecord }) => {
  const cms = new TinaCMS({
    sidebar: true,
  })

  return (
    <TinaProvider cms={cms}>
      <div>
        <p>Hello there</p>
        <PageContent page={pageRecord} />
      </div>
    </TinaProvider>
  )
}

export default BlogIndex

//NON-GATSBY CODE

function PageContent({ page }) {
  // Step 1: Define page data (Different for different pages)
  const defaultSchema = {
    header: {
      options: [
        {
          label: "Home",
          link: "",
          name: "header.options[0]",
          field: true,
        },
        {
          label: "About",
          link: "",
          name: "header.options[1]",
          field: true,
          component: "text",
        },
      ],
      languages: [
        {
          label: "English",
          link: "",
          name: "header.languages[0]",
          field: true,
          component: "textarea",
        },
      ],
    },
  }
  const [pageData, setPageData] = useState(page.content || defaultSchema)

  // Step 2: Extract fields from page data
  let fields = []

  const traverse = pageData => {
    let currentObj = pageData
    if (currentObj.field) fields.push(currentObj)
    /*
      if (pageData is array) traverse items and traverse them
       if(Array.isArray(pageData)) traverse(pageData)
      if (pageData is object) traverse each key
      if(Object.keys(pageData))Object.keys.map
      else ignore
    */
  }

  const formConfig = {
    id: "tina-tutorial-index",
    label: "Edit Page",
    // Step 3: Add that fields array to formConfig
    fields,
    loadInitialValues() {
      return fetch(`http://localhost:1337/pages/1/${page.id}`).then(response =>
        setPageData({
          ...pageData,
          ...response.content,
        })
      )
    },
    // Step 4: Extract page schema from fields object
    onSubmit(formData) {
      const _formData = {
        "header.languages[0]": "English",
        "header.languages[1]": "Hindi",
      }
      // Mid step: Duplicate the pageData into finalForm
      const purify = e => JSON.parse(JSON.stringify(e))

      const finalForm = purify(pageData) //same traverse function or just to make duplicate like const purify = pageData => {return dupData = pageData}

      // Step 5: Go through all the fields from formData
      Object.keys(formData).map(address => {
        // Step 6: Get the value from formData
        const value = formData[address]
        // Step 7: Assign the value to that location in finalForm
        eval(`finalForm.${address}.value = ${value}`)
      })

      /*
        For strapi

        1. Make a content type for all pages (not just individual pages)
        2. Page schema
          - id
          - code
          - content
          - type
            - home
            - about
            - contact
      */

      return fetch(`http://localhost:1337/pages/${page.id}`, {
        method: "PUT",
        // Last step: Send data to strapi
        body: JSON.stringify({
          code: page.code,
          content: finalForm,
          type: page.type,
        }), //to be filled
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
