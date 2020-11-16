import React, {useState} from "react"
import {useQuery, useMutation} from '@apollo/client';
import gql from 'graphql-tag';

const Get_Bookmark = gql`
{
  Bookmark {
    id
    title
    url
  }
}
`;
const Add_Bookmark = gql`
  mutation addbookmark($title: String!, $url: String!) {
    addbookmark(title: $title, url: $url) {
    id
  }
  }

`;

export default function Home() {
  const [bookTitle, setbooktitle] = useState("");
  const [bookUrl, setBookUrl] = useState("")
  const {error, loading, data} = useQuery(Get_Bookmark)
  const [addbookmark] = useMutation(Add_Bookmark);

  const addMark = (event) => {
    event.preventDefault()
    addbookmark({
      variables:{
        title:bookTitle,
        url:bookUrl,
      },
      refetchQueries:[{ query: Get_Bookmark }]
    });
    setbooktitle("")
    setBookUrl("")
  }

  if (loading){
    return <div>Loading ...</div>
  }
  if (error) {
    return <div> Error </div>
  }
  console.log(data)
  return ( <div>
    <form onSubmit={addMark}>
      <label>
        <p>Title</p>
        <input type="text" value={bookTitle}
        onChange={(e)=> setbooktitle(e.target.value)}
        />
      </label>
      <label>
        <p>Url</p>
        <input type="text" value={bookUrl}
         onChange={(e)=> setBookUrl(e.target.value)}
        />
      </label>
      <button type="submit">add bookmark</button>
    </form>
    {data.Bookmark.map((data)=>{
      return (
        <div key={data.id}>
          <p>{data.title}</p>
          <p>{data.url}</p>
        </div>
      )
    })}
  </div>
  )
}
