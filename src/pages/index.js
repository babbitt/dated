import * as React from "react"
import { Editor } from '../components/editor'
import 'react-toastify/dist/ReactToastify.css';
import { getUser } from "../components/user";
import { UserEditor } from "../components/user/UserEditor";


//#region Styles
const pageStyles = {
  color: "#232129",
  padding: 20,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
//#endregion

//#region data
//#endregion

//#region markup
const IndexPage = () => {

  const USER = getUser()
  const [userEditorOpen, setUserEditorOpen] = React.useState(true)

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,200;0,400;1,200;1,400&family=Yomogi&display=swap" rel="stylesheet"/>
      <main style={pageStyles}>
        <title>Dated</title>
      </main>
      {
        userEditorOpen 
        ?
          <UserEditor is_open={userEditorOpen} set_open={setUserEditorOpen}/>
        :
          <Editor user={USER}/>
      }
    </>
  )
}
//#endregion
export default IndexPage
