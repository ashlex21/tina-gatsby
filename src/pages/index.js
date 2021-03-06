import React, { useState, useEffect } from "react"

import { TinaProvider, TinaCMS, useCMS, useForm, usePlugin } from "tinacms"

const BlogIndex = () => {
  const cms = new TinaCMS({
    sidebar: true,
  })

  return (
    <TinaProvider cms={cms}>
      <div>
        <PageContent />
      </div>
    </TinaProvider>
  )
}

export default BlogIndex

function PageContent() {
  //Step 1
  const [tinaFields, setTinaFields] = React.useState([])
  const defaultSchema = {
    header: {
      options: [
        {
          name: "header.options[0]",
          label: "Home",
          component: "text",
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
  // const [pageData, setPageData] = useState(page.content || defaultSchema)
  const [pageData, setPageData] = useState(defaultSchema)

  // Step 2: Extract fields from page data

  let fields = []

  const traverse = obj => {
    let currentObj = obj

    if (currentObj.field) {
      fields.push(currentObj)
    } else if (Array.isArray(currentObj)) {
      currentObj.forEach(object => traverse(object))
    } else if (typeof currentObj == "object") {
      // const keys = Object.keys(currentObj);
      // keys.forEach((key) => traverse(currentObj[key]));
      Object.keys(currentObj).forEach(key => traverse(currentObj[key]))
    }
  }

  React.useEffect(() => {
    traverse(pageData)
    console.log(tinaFields)
    setTinaFields(fields)
    console.log(tinaFields)
  }, [])

  const formConfig = {
    id: "tina-tutorial-index",
    label: "Edit Page",
    //Step 3
    fields: tinaFields,

    loadInitialValues() {
      return fetch(`http://localhost:1337/pages/1/`).then(response =>
        setPageData({
          ...pageData,
          ...response.content,
        })
      )
    },

    onSubmit(formData) {
      // Mid step: Duplicate the pageData into finalForm
      const purify = e => JSON.parse(JSON.stringify(e))

      const finalForm = purify(pageData)

      // Step 5: Go through all the fields from formData
      Object.keys(formData).map(address => {
        // Step 6: Get the value from formData
        const value = formData[address]
        // Step 7: Assign the value to that location in finalForm
        eval(`finalForm.${address}.value = ${value}`)
        //beaware when value is string, you've to tweak the value of above then
      })

      return fetch(`http://localhost:1337/pages/1`, {
        method: "PUT",
        // Last step: Send data to strapi
        body: JSON.stringify({
          code: "hn",
          content: finalForm,
          type: "home",
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
  // content will come as header.options.something so keep your heads up
  console.log(editableData)

  // 4. Register it with the CMS
  usePlugin(form)

  return (
    <section className="App-header">
      {/* {editableData} */}
      <p>hello there</p>
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
