import Head from 'next/head';

import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';


import styles from './post.module.scss';
import { FiCalendar, FiUser, FiClock  } from "react-icons/fi";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {useRouter} from 'next/router'

interface Post {
  
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content:{
      heading:string;
      body: {
        text: string;
      }[]
    }[]
  };
}

interface PostProps {
  post: Post;
}

 export default function Post({post}:PostProps) {
  
  const router = useRouter();

  if(router.isFallback){
    return <h1>Carregando...</h1>
  }

  // Count Words
  const wordsTotal = post.data.content.reduce((total, item) => {
    total += item.heading.split(' ').length
    const wordsBody = item.body.map(bodyText => bodyText.text.split(' ').length)
    wordsBody.map(word => (total += word))
    return total
  }, 0)

  //Time
  const timeOfReading = wordsTotal / 200;
  return(
    <div className={styles.container}>
      <div className={styles.containerImg}>
        <img src={post.data.banner.url} alt='Banner' width='100%' height='400px'/>
      </div>
      <main className={styles.containerMain}>
        <h1>{post.data.title}</h1>
        <div className={styles.info}>
          <time><FiCalendar /> {format(new Date(post.first_publication_date),'dd MMM yyyy', {locale: ptBR}) }</time>
          <strong> <FiUser /> {post.data.author} </strong> 
          <strong><FiClock /> {Math.ceil(timeOfReading)} min </strong>
        </div>
        <section className={styles.contentGroup}>
          
            {  
                 post.data.content.map(resContent => {
                  const heading = resContent.heading
                  const body = resContent.body.map(res => {return res.text} )
                  return (
                    <>
                      <h3 >{
                       heading
                        
                      }</h3>
                      <p>{body}</p>
                      
                    </>
                  )
              })
            }           
           
        </section>
      </main>
    </div>
  )
}
  

export const getStaticPaths:GetStaticPaths = async () => {
  const prismic = getPrismicClient()
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'post')
  )

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }))
  return{
    paths,       
    fallback:true
  }
 };

 export const getStaticProps:GetStaticProps = async ({ params }) => {

    const {slug} = params;
    ;
    const prismic = getPrismicClient();
    const response = await prismic.getByUID('post', String(slug), {});

    
    const post = {
        uid: response.uid,
        first_publication_date: response.first_publication_date,
        last_publication_date: response.last_publication_date,
        data: {
          title: response.data.title,
          author: response.data.author,
          subtitle: response.data.subtitle,
          banner: {
            url: response.data.banner.url,
          },          
          content:response.data.content.map(res =>({
            heading: res.heading,
            body: [...res.body] 
          }))
        }     
    }
    
  
  return {
    props:{
      post,
    },
   
    
  }
};
