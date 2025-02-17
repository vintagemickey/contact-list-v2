import './App.css'
import {MainForm} from "./components/MainForm/MainForm";
import {Contacts} from "./components/Contacts/Contacts.tsx";
import {Typography} from "antd";
const { Title } = Typography;


function App() {
  return (
    <>
      <Title>Contact List</Title>
      <MainForm/>
      <Contacts/>
    </>
  )
}

export default App
