import React, {useState} from "react"
import {useQuery, useMutation} from '@apollo/client';
import gql from 'graphql-tag';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
const useStyles = makeStyles((theme: Theme) =>
createStyles({
  app: {
    
    maxWidth: "500px",
    margin: "auto",
  },
  form:{
    textAlign:"center",
    color:"#000",
    
  },
  input:{
    width:"400px",
    marginBottom:"10px",
    marginTop:"10px"
  },
  link:{
    textDecoration:"none",
    color:"#fff"
  },
  showBookmark:{
    textAlign:"left",
    boxShadow:"0 0 10px #3f51b5",
    marginBottom:"20px"
  }
}));

const Get_Bookmark = gql`
{
  Bookmark {
    id
    title
    url
    desc
  }
}
`;
const Add_Bookmark = gql`
  mutation addbookmark($title: String!, $url: String!, $desc: String!) {
    addbookmark(title: $title, url: $url, desc: $desc) {
    id
    title
    url
    desc
  }
  }

`;

const DEL_BOOKMARK = gql`
  mutation delbookmark($id: ID!){
    delbookmark(id: $id){
      id
    }
  }
`;

export default function Home() {
  const classes = useStyles()
  const [bookTitle, setbooktitle] = useState("");
  const [bookUrl, setBookUrl] = useState("")
  const [bookdesc, setBookdesc] = useState("")
  const {error, loading, data} = useQuery(Get_Bookmark)

  const [addbookmark] = useMutation(Add_Bookmark);
  const [delbookmark] = useMutation(DEL_BOOKMARK);

  const addMark = (event) => {
    event.preventDefault()
    addbookmark({
      variables:{
        title:bookTitle,
        url:bookUrl,
        desc:bookdesc,
      },
      refetchQueries:[{ query: Get_Bookmark }]
    });
    setbooktitle("");
    setBookUrl("");
    setBookdesc("");
  }

  const delBookmark = (id) => {
    console.log(id)
    delbookmark({
      variables:{
        id:id,
      },
      refetchQueries:[{ query: Get_Bookmark }]
    })
  }

  if (loading){
    return <div>Loading ...</div>
  }
  if (error) {
    console.log(error)
    return <div> Error </div>
  }
  console.log(data)
  return ( 
    <div className={classes.app}>
      <h1>BookMark App</h1>
      <Box p={1} m={1}>
    <form onSubmit={addMark} className={classes.form}>
      <label>
        
        <TextField  type="text" value={bookTitle}
        onChange={(e)=> setbooktitle(e.target.value)}
        label="Title" variant="outlined"
        className={classes.input}
        required
        />
      </label>
      <br/>
      <label>
        
        <TextField  type="text" value={bookUrl}
         onChange={(e)=> setBookUrl(e.target.value)}
         label="Url" variant="outlined"
         className={classes.input}
         required
        />
      </label>
      <br/>
      <label>
        <TextareaAutosize  value={bookdesc}
         onChange={(e)=> setBookdesc(e.target.value)}
        rowsMin={6}
        placeholder="Description"
        className={classes.input}
        />
      </label>
      <br/>
      <Button variant="contained" color="primary" type="submit">
        Add Bookmark
      </Button>
    </form>
    </Box>
    <h2>Bookmark list</h2>
    {data.Bookmark.map((data)=>{
      return (
        
        <Box key={data.id} p={2} className={classes.showBookmark}>
          <Box>
          <p>{data.title}</p>
          </Box>
          <Box>
          <p><a href={data.url}>{data.url}</a></p>
          <p>{data.desc}</p>
          </Box>
          <Box p={1} >
          <Button variant="contained" color="secondary" style={{marginRight:"5px"}}>
            <Link className={classes.link} href={data.url} target="blank">Visit site</Link>
          </Button>
          <Button variant="contained"  onClick={()=>{delBookmark(data.id)}}
          
          >
            Delete
          </Button>
          
          </Box>
        </Box>
        
      )
    })}
  </div>
  )
}
