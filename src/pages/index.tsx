import Head from 'next/head'

import Prismic from '@prismicio/client'


import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from "react-icons/fi";


import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { useState } from 'react';


interface Post{
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  
}

export default function Home({postsPagination }:HomeProps) { 
  const [posts, setPosts] = useState<PostPagination>({
    ...postsPagination,
    results: postsPagination.results.map(post => ({
      ...post,
      first_publication_date: post.first_publication_date
    })),
  })

  async function loadPost(){
    
    const response = await fetch(postsPagination.next_page)
    .then(data => data.json())
    
    setPosts({
      ...posts,
      results: [...posts.results, ...response.results],
      next_page: response.next_page
    })
  }
   return(
    <> 
      <Head>
        <title>Home | Space Traveling</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <div className={styles.postContent}>
     
          {posts.results.map(post => (
            <Link href={`/post/${post.uid}`} >
              <a key={post.uid} >
                <h1>{post.data.title}</h1>
                <h3>{post.data.subtitle}</h3>
                <div className={styles.infos}>
                  <time><FiCalendar />  
                    {
                     format(new Date( post.first_publication_date),'dd MMM yyyy', {locale: ptBR})
                    } 
                     
                  </time> <span> <FiUser />  {post.data.author}</span>
                </div>
              </a>
            </Link>
          )) }
        </div>
     
        {posts.next_page !== null ? (
          <a href="#" onClick={loadPost}>
            <h4> Carregar mais posts</h4>
          </a>
        ) : ""}
        
      </main>
     
    </>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),    
    ],
    {
      fetch:['post.title', 'post.subtitle','post.author'],
      pageSize:1,    
    },
  );

 const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
}
 
/* const datasPosts = postsResponse.results.map(post => {    
    return{
        uid: post.uid,
        slug:post.slugs,
        title: post.data.title,
        subtitle:post.data.subtitle,
        author:post.data.author,
        first_publication_date: format(new Date(post.last_publication_date),'dd MMM yyyy', {locale: ptBR}),      
       
    }
  })*/
  return{
    props:{
   // datasPosts,
   postsPagination
    }
  }
  

};
